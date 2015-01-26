using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using ExtensionGallery.Models;

namespace ExtensionGallery.Code
{
	public class VsixManifestParser
    {
        public Package CreateFromManifest(string tempFolder, string repo, string issuetracker)
        {
            string xml = File.ReadAllText(Path.Combine(tempFolder, "extension.vsixmanifest"));
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml.Replace("xmlns=\"http://schemas.microsoft.com/developer/vsx-schema/2011\"", string.Empty));

            Package package = new Package();

            package.ID = ParseNode(doc, "Identity", true, "Id");
            package.Name = ParseNode(doc, "DisplayName", true);
            package.Description = ParseNode(doc, "Description", true);
            package.Version = new Version(ParseNode(doc, "Identity", true, "Version")).ToString();
            package.Author = ParseNode(doc, "Identity", true, "Publisher");
            package.Icon = ParseNode(doc, "Icon", false);
            package.Preview = ParseNode(doc, "PreviewImage", false);
            package.Tags = ParseNode(doc, "Tags", false);
            package.DatePublished = DateTime.UtcNow;
            package.SupportedVersions = GetSupportedVersions(doc);
            package.ReleaseNotesUrl = ParseNode(doc, "ReleaseNotes", false);
            package.GettingStartedUrl = ParseNode(doc, "GettingStartedGuide", false);
            package.MoreInfoUrl = ParseNode(doc, "MoreInfoUrl", false);
			package.Repo = repo;
			package.IssueTracker = issuetracker;

            string license = ParseNode(doc, "License", false);
            if (!string.IsNullOrEmpty(license))
            {
                string path = Path.Combine(tempFolder, license);
                if (File.Exists(path))
                {
                    package.License = File.ReadAllText(path);
                }
            }

            return package;
        }

        private static IEnumerable<string> GetSupportedVersions(XmlDocument doc)
        {
            XmlNodeList list = doc.GetElementsByTagName("InstallationTarget");
            List<string> versions = new List<string>();

            foreach (XmlNode node in list)
            {
                string raw = node.Attributes["Version"].Value.Trim('[', '(', ']', ')');
                string[] entries = raw.Split(',');

                foreach (string entry in entries)
                {
                    Version v;
                    if (Version.TryParse(entry, out v) && !versions.Contains(v.ToString()))
                    {
                        versions.Add(v.ToString());
                    }
                }
            }

            return versions;
        }

        private string ParseNode(XmlDocument doc, string name, bool required, string attribute = "")
        {
            XmlNodeList list = doc.GetElementsByTagName(name);

            if (list.Count > 0)
            {
                XmlNode node = list[0];

                if (string.IsNullOrEmpty(attribute))
                    return node.InnerText;

                XmlAttribute attr = node.Attributes[attribute];

                if (attr != null)
                    return attr.Value;
            }

            if (required)
            {
                string message = string.Format("Attribute '{0}' could not be found on the '{1}' element in the .vsixmanifest file.", attribute, name);
                throw new Exception(message);
            }

            return null;
        }

    }
}