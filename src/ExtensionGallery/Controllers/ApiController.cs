using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ExtensionGallery.Code;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc;

namespace ExtensionGallery.Controllers
{
	public class ApiController : Controller
	{
		IHostingEnvironment _env;
		PackageHelper _helper;

		public ApiController(IHostingEnvironment env)
		{
			_env = env;
			_helper = new PackageHelper(env.WebRoot);
		}

		public IActionResult Html()
		{
			return File("index.html", "text/html;charset=utf-8");
		}

		public object Get(string id)
		{
			Response.Headers["Cache-Control"] = "no-cache";
			Response.Headers["Expires"] = DateTime.UtcNow.ToString("r");

			if (string.IsNullOrWhiteSpace(id))
			{
				var packages = _helper.PackageCache.OrderByDescending(p => p.DatePublished);

				if (this.IsConditionalGet(packages))
				{
					return Enumerable.Empty<Package>();
				}

				return packages;
			}

			var package = _helper.GetPackage(id);

			if (this.IsConditionalGet(package))
			{
				return new EmptyResult();
			}

			return package;
		}

		[HttpPost]
		public async Task<IActionResult> Upload([FromQuery]string repo, string issuetracker)
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