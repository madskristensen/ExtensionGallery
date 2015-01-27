using System.Linq;
using ExtensionGallery.Models;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc;
using System.IO;
using System.Threading.Tasks;
using ExtensionGallery.Code;

namespace ExtensionGallery.Controllers
{
	public class FeedController : Controller
	{
		PackageHelper _helper;
		FeedWriter _feed;

		public FeedController(IHostingEnvironment env)
		{
			_helper = new PackageHelper(env.WebRoot);
			_feed = new FeedWriter();
		}

		public IActionResult Index()
		{
			Response.ContentType = "text/xml";
			string baseUrl = Request.Scheme + "://" + Request.Host;

			Package[] packages = _helper.PackageCache.OrderByDescending(p => p.DatePublished).ToArray();
			return Content(_feed.GetFeed(baseUrl, packages));
		}

		public IActionResult Extension(string id)
		{
			Response.ContentType = "text/xml";
			string baseUrl = Request.Scheme + "://" + Request.Host;

			if (!string.IsNullOrEmpty(id))
			{
				Package package = _helper.GetPackage(id);
				return Content(_feed.GetFeed(baseUrl, package));
			}

			return new RedirectResult("/", true);
		}

		public IActionResult Author(string id)
		{
			Response.ContentType = "text/xml";
			string baseUrl = Request.Scheme + "://" + Request.Host;

			if (!string.IsNullOrEmpty(id))
			{
				var packages = _helper.PackageCache
									  .Where(p => p.Author.Equals(id, System.StringComparison.OrdinalIgnoreCase))
									  .OrderByDescending(p => p.DatePublished);

				return Content(_feed.GetFeed(baseUrl, packages.ToArray()));
			}

			return new RedirectResult("/", true);
		}

	}
}