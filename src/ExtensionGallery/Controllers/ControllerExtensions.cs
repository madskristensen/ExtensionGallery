using System;
using System.Collections.Generic;
using System.Linq;
using ExtensionGallery.Code;
using Microsoft.AspNet.Mvc;

namespace ExtensionGallery.Controllers
{
    public static class ControllerExtensions
    {
		public static bool MatchesIfModifiedSince(this Controller controller, IEnumerable<Package> packages)
		{
			Package package = packages.FirstOrDefault();
			return controller.MatchesIfModifiedSince(package);
		}

		public static bool MatchesIfModifiedSince(this Controller controller, Package package)
		{
			if (package == null)
				return false;

			controller.Response.Headers["Last-Modified"] = package.DatePublished.ToString("r");

			DateTime lastModified = package.DatePublished;
			DateTime ifModifiedSince;
			lastModified = new DateTime(lastModified.Year, lastModified.Month, lastModified.Day, lastModified.Hour, lastModified.Minute, lastModified.Second);

			if (DateTime.TryParse(controller.Request.Headers["If-Modified-Since"], out ifModifiedSince))
			{
				controller.Response.StatusCode = 304;
				return lastModified == ifModifiedSince.ToUniversalTime();
			}

			return false;
		}
	}
}