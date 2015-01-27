using System.Linq;
using ExtensionGallery.Models;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc;
using System.IO;
using System.Threading.Tasks;
using ExtensionGallery.Code;
using System;

namespace ExtensionGallery2.Controllers
{
	public class ExtensionController : Controller
	{
		IHostingEnvironment _env;
		PackageHelper _helper;

		public ExtensionController(IHostingEnvironment env)
		{
			_env = env;
			_helper = new PackageHelper(env.WebRoot);
		}

		public IActionResult Index()
		{
			var packages = _helper.PackageCache.OrderByDescending(p => p.DatePublished);
			return Json(packages);
		}

		public IActionResult Get(string id)
		{
			var package = _helper.GetPackage(id);
			return Json(package);
		}

		[HttpPost]
		public async Task<IActionResult> UploadFile([FromQuery]string repo, string issuetracker)
		{
			try
			{
				Stream bodyStream = Context.Request.Body;
				Package package = await _helper.ProcessVsix(bodyStream, repo, issuetracker);

				return Json(package);
			}
			catch (Exception ex)
			{
				Response.StatusCode = 500;
				Response.Headers["x-error"] = ex.Message;
				return Content(ex.Message);
			}
		}
	}
}