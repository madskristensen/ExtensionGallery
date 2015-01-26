using System.Linq;
using ExtensionGallery.Models;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc;
using System.IO;
using System.Threading.Tasks;
using ExtensionGallery.Code;

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
				var packages = _helper.GetAllPackages();
				return Json(packages);
		}

		public IActionResult Get(string id)
		{
			var package = _helper.GetPackage(id);
			return Json(package);
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