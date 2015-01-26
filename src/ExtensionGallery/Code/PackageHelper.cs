using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ExtensionGallery.Models;
using Newtonsoft.Json;

namespace ExtensionGallery.Code
{
	public class PackageHelper
	{
		private string _webroot;
		private string _extensionRoot;
		private static List<Package> _cache;

		public PackageHelper(string webroot)
		{
			_webroot = webroot;
			_extensionRoot = Path.Combine(webroot, "extensions");
		}

		public IEnumerable<Package> GetAllPackages()
		{
			if (_cache == null)
			{
				List<Package> packages = new List<Package>();

				foreach (string extension in Directory.EnumerateDirectories(_extensionRoot))
				{
					string json = Path.Combine(extension, "extension.json");
					if (File.Exists(json))
					{
						string content = File.ReadAllText(json);
						Package package = JsonConvert.DeserializeObject(content, typeof(Package)) as Package;
						packages.Add(package);
					}
				}

				_cache = new List<Package>();
				_cache.AddRange(packages);
			}

			return _cache.OrderByDescending(p => p.DatePublished);
		}

		public Package GetPackage(string id)
		{
			if (_cache != null && _cache.Any(p => p.ID == id))
			{
				return _cache.SingleOrDefault(p => p.ID == id);
			}

			string folder = Path.Combine(_extensionRoot, id);
			List<Package> packages = new List<Package>();

			return DeserializePackage(folder);
		}

		private static Package DeserializePackage(string version)
		{
			string content = File.ReadAllText(Path.Combine(version, "extension.json"));
			return JsonConvert.DeserializeObject(content, typeof(Package)) as Package;
		}

		public async Task<Package> ProcessVsix(Stream vsixStream)
		{
			string tempFolder = Path.Combine(_webroot, "temp", Guid.NewGuid().ToString());

			try
			{
				string tempVsix = Path.Combine(tempFolder, "extension.vsix");

				if (!Directory.Exists(tempFolder))
					Directory.CreateDirectory(tempFolder);

				using (FileStream fileStream = File.Create(tempVsix))
				{
					await vsixStream.CopyToAsync(fileStream);
				}

				ZipFile.ExtractToDirectory(tempVsix, tempFolder);

				string manifest = Path.Combine(tempFolder, "extension.vsixmanifest");
				VsixManifestParser parser = new VsixManifestParser();
				Package package = parser.CreateFromManifest(manifest, "http://foo.com", tempFolder);

				string basePath = Path.Combine(_extensionRoot, package.ID);

				SavePackage(tempFolder, manifest, package, basePath);

				File.Copy(tempVsix, Path.Combine(basePath, "extension.vsix"), true);

				return package;
			}
			finally
			{
				Directory.Delete(tempFolder, true);
			}
		}

		private void SavePackage(string temp, string manifest, Package package, string basePath)
		{
			if (Directory.Exists(basePath))
				Directory.Delete(basePath, true);

			Directory.CreateDirectory(basePath);

			File.Copy(manifest, Path.Combine(basePath, "extension.vsixmanifest"), true);

			string icon = Path.Combine(temp, package.Icon ?? string.Empty);
			if (File.Exists(icon))
				File.Copy(icon, Path.Combine(basePath, "icon.png"), true);

			string preview = Path.Combine(temp, package.Preview ?? string.Empty);
			if (File.Exists(preview))
				File.Copy(preview, Path.Combine(basePath, "preview.png"), true);

			string json = JsonConvert.SerializeObject(package);

			File.WriteAllText(Path.Combine(basePath, "extension.json"), json, Encoding.UTF8);

			if (_cache == null)
				return;

			Package existing = _cache.FirstOrDefault(p => p.ID == package.ID);
			if (_cache.Contains(existing))
			{
				_cache.Remove(existing);
			}

			_cache.Add(package);
		}
	}
}