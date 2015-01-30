using System;
using System.Collections.Generic;
using System.Linq;
using ExtensionGallery.Code;
using Microsoft.AspNet.Mvc;

namespace ExtensionGallery.Controllers
{
	public static class ControllerExtensions
	{
		public static bool IsConditionalGet(this Controller controller, IEnumerable<Package> packages)
		{
			Package package = packages.FirstOrDefault();
			return controller.IsConditionalGet(package);
		}

		public static bool IsConditionalGet(this Controller controller, Package package)
		{
			if (package == null)
				return false;

			controller.Response.Headers["Last-Modified"] = package.DatePublished.ToString("r");
			controller.Response.Headers["ETag"] = "\"" + package.DatePublished.Ticks.ToString() + "\"";

			// Test If-None-Match
			if (controller.Request.Headers["If-None-Match"] == controller.Response.Headers["ETag"])
			{
				controller.Response.StatusCode = 304;
				return true;
			}

			// Test Is-Modified-Since
			DateTime lm = package.DatePublished;
			DateTime ifModifiedSince;
			lm = new DateTime(lm.Year, lm.Month, lm.Day, lm.Hour, lm.Minute, lm.Second, DateTimeKind.Utc);

			if (DateTime.TryParse(controller.Request.Headers["If-Modified-Since"], out ifModifiedSince))
			{
				controller.Response.StatusCode = 304;
				return lm == ifModifiedSince;
			}

			return false;
		}
	}
}