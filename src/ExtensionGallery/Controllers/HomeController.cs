using System.Linq;
using ExtensionGallery.Models;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc;
using System.IO;
using System.Threading.Tasks;
using ExtensionGallery.Code;

namespace ExtensionGallery2.Controllers
{
	public class HomeController : Controller
	{
		IHostingEnvironment _env;
		PackageHelper _helper;
		FeedWriter _feed;

		public HomeController(IHostingEnvironment env)
		{
			_env = env;
			_helper = new PackageHelper(env.WebRoot);
			_feed = new FeedWriter();
		}

		public IActionResult GetAllExtensions()
		{
			var packages = _helper.GetAllPackages();
			return Json(packages);
		}

		public IActionResult Extension(string id)
		{
			try
			{
				var packages = _helper.GetPackage(id);
				return Json(packages);
			}
			catch (DirectoryNotFoundException)
			{
				dynamic error = new { Error = "The extension doesn't exist." };
				return Json(error);
			}
		}

		public IActionResult Feed(string id)
		{
			Response.ContentType = "text/xml";
			string baseUrl = Request.Scheme + "://" + Request.Host;

			if (!string.IsNullOrEmpty(id))
			{
				Package package = _helper.GetPackage(id);
				return Content(_feed.GetFeed(baseUrl, package));
			}
			else
			{
				Package[] packages = _helper.GetAllPackages().ToArray();
				return Content( _feed.GetFeed(baseUrl, packages));
			}
		}

		[HttpPost]
		public async Task<IActionResult> UploadFile()
		{
			Stream bodyStream = Context.Request.Body;
			Package package = await _helper.ProcessVsix(bodyStream);

			return Json(package);
		}
	}
}