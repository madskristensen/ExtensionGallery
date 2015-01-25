using ExtensionGallery2.Code;
using ExtensionGallery2.Models;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace ExtensionGallery2.Controllers
{
    public class HomeController : Controller
    {
        IHostingEnvironment _env;
        PackageHelper _helper;

        public HomeController(IHostingEnvironment env)
        {
            _env = env;
            _helper = new PackageHelper(env.WebRoot);
        }

        public IActionResult GetAllExtensions()
        {
            var packages = _helper.GetAllPackages();
            return Json(packages);
        }

        public IActionResult Extension(string id)
        {
            try {
                var packages = _helper.GetPackage(id);
                return Json(packages);
            }
            catch (DirectoryNotFoundException)
            {
                dynamic error = new { Error = "The extension doesn't exist." };
                return Json(error);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Ping([FromQuery]string url)
        {
            Package package = await _helper.ProcessVsixRequest(url);
            return Json(package);
        }
    }
}