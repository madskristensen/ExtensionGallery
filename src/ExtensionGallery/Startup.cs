using System;
using Microsoft.AspNet.Http;
using System.Linq;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Routing;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Logging;

namespace ExtensionGallery
{
	public class Startup
	{
		public Startup(IHostingEnvironment env)
		{
			// Setup configuration sources.
			Configuration = new Configuration()
				.AddJsonFile("config.json")
				.AddEnvironmentVariables();
		}

		public IConfiguration Configuration { get; set; }

		// This method gets called by the runtime.
		public void ConfigureServices(IServiceCollection services)
		{
			// Add EF services to the services container.
			//services.AddEntityFramework(Configuration)
			//    .AddSqlServer()
			//    .AddDbContext<ApplicationDbContext>();

			//// Add Identity services to the services container.
			//services.AddDefaultIdentity<ApplicationDbContext, ApplicationUser, IdentityRole>(Configuration);

			// Add MVC services to the services container.
			services.AddMvc();

			// Uncomment the following line to add Web API servcies which makes it easier to port Web API 2 controllers.
			// You need to add Microsoft.AspNet.Mvc.WebApiCompatShim package to project.json
			// services.AddWebApiConventions();

		}

		// Configure is called after ConfigureServices is called.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerfactory)
		{
			// Configure the HTTP request pipeline.
			// Add the console logger.
			//loggerfactory.AddConsole();

			// Add the following to the request pipeline only in development environment.
			if (string.Equals(env.EnvironmentName, "Development", StringComparison.OrdinalIgnoreCase))
			{
				//app.UseBrowserLink();
				app.UseErrorPage(ErrorPageOptions.ShowAll);
				//app.UseDatabaseErrorPage(DatabaseErrorPageOptions.ShowAll);
			}
			else
			{
				// Add Error handling middleware which catches all application specific errors and
				// send the request to the following path or controller action.
				//app.UseErrorHandler("/Home/Error");
			}

			app.UseErrorPage(ErrorPageOptions.ShowAll);

			// Add static files to the request pipeline.
			var options = new StaticFileOptions();
			options.ContentTypeProvider = new CustomContentTypeProvider();
			options.ServeUnknownFileTypes = true;
			options.OnPrepareResponse = _ =>
			{
				string[] valid = new[] { ".js", ".css", ".ico", ".png", ".gif", ".jpg", ".svg", ".woff", ".woff2", ".ttf", ".eot", ".vsix" };
				string ext = System.IO.Path.GetExtension(_.File.Name).ToLowerInvariant();
				if (valid.Contains(ext))
				{
					_.Context.Response.Headers.Add("cache-control", new string[] { "max-age=31536000" });
				}
			};
			app.UseStaticFiles(options);

			// Add cookie-based authentication to the request pipeline.
			//app.UseIdentity();

			// Add MVC to the request pipeline.
			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "extension",
					template: "extension/{id}",
					defaults: new { controller = "Api", action = "Html" });

				routes.MapRoute(
					name: "author",
					template: "author/{name}",
					defaults: new { controller = "Api", action = "Html" });

				routes.MapRoute(
					name: "default",
					template: "{controller}/{action}/{id?}",
					defaults: new { controller = "Home", action = "Index" });
			});
		}
	}

	public class CustomContentTypeProvider : FileExtensionContentTypeProvider
	{
		public CustomContentTypeProvider()
		{
			Mappings[".html"] = "text/html;charset=utf-8";
			Mappings[".js"] = "text/javascript";
			Mappings[".ico"] = "image/x-icon";
			Mappings[".vsix"] = "application/octed-stream";
		}
	}
}
