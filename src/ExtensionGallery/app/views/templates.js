angular.module('galleryApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/views/devguide.html',
    "<h1 class=page-header>Add your extension</h1><p>You can add your extension to this gallery in 2 different ways as part of your build automation.</p><ol><li>Use PowerShell</li><li>Use <a href=http://appveyor.com>AppVeyor</a></li></ol><p>Both PowerShell and AppVeyor uses a <a href=https://github.com/madskristensen/ExtensionScripts/blob/master/AppVeyor/vsix.ps1>custom script</a> that makes it easy to publish the extension to this gallery. It contains other functions that are useful for incrementing the VSIX version and other handy things.</p><section><h2>Use PowerShell</h2><p>First you must execute the VSIX script</p><pre>(new-object Net.WebClient).DownloadString(\"https://raw.github.com/madskristensen/ExtensionScripts/master/AppVeyor/vsix.ps1\") | iex</pre><p>That allows you to call methods upload the .vsix extension file to the gallery.</p><pre>Vsix-PublishToGallery</pre><p>That will find all .vsix files in the working directory recursively and upload them. To specify the path, simply pass it in as the first parameter:</p><pre>Vsix-PublishToGallery .\\src\\WebCompilerVsix\\**\\*.vsix</pre></section><section><h2>Use AppVeyor</h2><p>AppVeyor is a build server hosted in the cloud and it's free.</p><p>After you've created an account, you can start doing automated builds. A really nice thing is that AppVeyor can automatically kick off a new build when you commit code to either GitHub, VSO or other code repositories.</p><p>To automatically upload your extension to vsixgallery.com when the build has succeeded, all you have to do is to add an <strong>appveyor.yml</strong> file to the root of your repository. The content of the file should look like this:</p><pre>version: 1.0.{build}\r" +
    "\n" +
    "\r" +
    "\n" +
    "install:\r" +
    "\n" +
    "  - ps: (new-object Net.WebClient).DownloadString(\"https://raw.github.com/madskristensen/ExtensionScripts/master/AppVeyor/vsix.ps1\") | iex\r" +
    "\n" +
    "\r" +
    "\n" +
    "before_build:\r" +
    "\n" +
    "  - ps: Vsix-IncrementVsixVersion | Vsix-UpdateBuildVersion\r" +
    "\n" +
    "\r" +
    "\n" +
    "build_script:\r" +
    "\n" +
    "  - msbuild /p:configuration=Release /p:DeployExtension=false /p:ZipPackageCompressionLevel=normal /v:m\r" +
    "\n" +
    "\r" +
    "\n" +
    "after_test:\r" +
    "\n" +
    "  - ps: Vsix-PushArtifacts | Vsix-PublishToGallery\r" +
    "\n" +
    "</pre><p>You might want to check out these real-world uses:</p><ul><li><a href=https://github.com/madskristensen/WebEssentials2015/blob/master/appveyor.yml>Web Essentials 2015</a></li><li><a href=https://github.com/jaredpar/VsVim/blob/master/appveyor.yml>VsVim</a></li><li><a href=https://github.com/madskristensen/WebCompiler/blob/master/appveyor.yml>Web Compiler</a></li><li><a href=https://github.com/madskristensen/AddAnyFile/blob/master/appveyor.yml>Add New File</a></li></ul></section>"
  );


  $templateCache.put('app/views/extension.html',
    "<div id=extensions><div data-ng-model=package data-ng-show=package><h1 class=page-header>{{package.Name}}</h1><article class=extension><img class=preview data-ng-src={{package.Preview}} alt=\"{{package.Name}}\"><div class=properties><div class=details><p>{{package.Description}}</p><p><strong>Author:</strong> <a data-ng-href=\"/author/{{package.Author | lowercase | escape }}\">{{package.Author}}</a></p><!--<p><strong>Supports:</strong> <span data-ng-repeat=\"version in package.SupportedVersions\">{{version + '&nbsp;'}}</span></p>--><p data-ng-show=package.Tags><strong>Tags:</strong> {{package.Tags}}</p><p><strong>Version:</strong> {{package.Version}}</p><p><strong>Updated:</strong> <time datetime=\"{{package.DatePublished | date:'yyyy-MM-dd'}}\">{{package.DatePublished | date:'MMM d. yyyy HH:mm'}}</time></p></div><ul><li data-ng-show=package.MoreInfoUrl><a href={{package.MoreInfoUrl}}><span class=\"glyphicon glyphicon-home\" aria-hidden=true></span> Website</a></li><li data-ng-show=package.Repo><a href={{package.Repo}}><span class=\"glyphicon glyphicon-pencil\" aria-hidden=true></span> Source code</a></li><li data-ng-show=package.IssueTracker><a href={{package.IssueTracker}}><span class=\"glyphicon glyphicon-ok\" aria-hidden=true></span> Issue Tracker</a></li></ul><br><a class=\"btn btn-success\" href={{package.DownloadUrl}} target=_self><span class=\"glyphicon glyphicon-cloud-download\" aria-hidden=true></span> Download</a> <a class=\"btn btn-default\" href=/feed/extension/{{package.ID}} target=_self><span class=\"glyphicon glyphicon-cog\" aria-hidden=true></span> Feed</a></div></article><br><div data-ng-show=package.readme class=clearfix><p class=readme ng-bind-html=\"package.readme | rawHtml\"></p></div><div data-ng-show=package.License class=clearfix><h2>License</h2><pre ng-bind-html=\"package.License | rawHtml\"></pre></div></div></div>"
  );


  $templateCache.put('app/views/feedguide.html',
    "<h1 class=page-header>Subscribe to feed</h1><p>Visual Studio is capable of subscribing to extension feeds, so you will be notified of any updates to extensions found in this gallery. You will only be notified of any updates to extensions that you already have installed.</p><section><h2>Choose the right feed</h2><p>There are several feeds in this gallery you can subscribe to.</p><dl><dt>The main feed</dt><dd>By subscribing to the <a href=\"/feed/\" target=_self>main feed</a> you will be notified by Visual Studio whenever any of the extensions in this gallery are updated. The feed contains all extensions available.</dd><dt>Feed per author</dt><dd>Each extension author has their own feed, so you can choose to subsribe to one or more authors' extensions.</dd><dt>Feed for individual extension</dt><dd>If you're only interested in getting updates to specific extensions, then you can subsribe to feeds for that one extension.</dd></dl></section><section><h2>Setup</h2><p>In Visual Studio go to <strong>Tools -> Options -> Environment -> Extensions and Updates</strong>.</p><p><img src=/img/visual-studio-options-dialog.png alt=\"Visual Studio options dialog\"></p><p>Click the <strong>Add</strong> button and fill in the name and URL fields.</p><p><strong>Name</strong>: Give it a name you like</p><p><strong>URL</strong>: Could be the main feed <a href=\"/feed/\" target=_self>http://vsixgallery.com/feed/</a></p><p>And finally click the <strong>Apply</strong> button.</p><p>That's it. You've now added the nightly feed to Visual Studio and updates will start to show up in <strong>Tools -> Extensions and Updates</strong> dialog</p><br><h3>Extensions and Updates</h3><p>You can now see the updates coming in to the <strong>Tools -> Extensions and Updates</strong> dialog.</p><p><img src=/img/visual-studio-extensions-updates.png alt=\"Visual Studio Extensions and Updates\"></p></section>"
  );


  $templateCache.put('app/views/home.html',
    "<h1 class=page-header>{{pageTitle}} <a href={{feed}} class=\"btn btn-default\" target=_self><span class=\"glyphicon glyphicon-cog\" aria-hidden=true></span> Feed</a></h1><div id=extensions><div id=searchform class=form-group><label class=sr-only for=search>Search</label><div class=input-group><div class=input-group-addon><span class=\"glyphicon glyphicon-search\"></span></div><input type=text id=search data-ng-model=query placeholder=Search class=\"form-control\"></div></div><article data-ng-repeat=\"package in packages | filter: packageSearch as results\"><a class=icon href=/extension/{{package.ID}}><img width=90 data-ng-src={{package.Icon}} alt=\"{{package.Name}}\"></a><div><h3><a data-ng-href=/extension/{{package.ID}}>{{package.Name}}</a> <span>v{{package.Version}}</span></h3><a class=author data-ng-href=\"/author/{{package.Author | lowercase | escape }}\">{{package.Author}}</a><p>{{package.Description}}</p><a class=\"btn-sm btn-success\" href={{package.DownloadUrl}} target=_self><span class=\"glyphicon glyphicon-cloud-download\" aria-hidden=true></span> Download</a> <a class=\"btn-sm btn-default\" href=/feed/extension/{{package.ID}} target=_self><span class=\"glyphicon glyphicon-cog\" aria-hidden=true></span> Feed</a> Updated <time datetime=\"{{package.DatePublished | date:'yyyy-MM-dd'}}\">{{package.relativeDate}}</time></div></article><article ng-show=\"results.length == 0\"><h3>No extensions found</h3></article></div>"
  );


  $templateCache.put('app/views/upload.html',
    "<h1 class=page-header>Upload new extension</h1><p>Upload a new extension to the gallery. It can either be a brand new extension or and updated version of an extension that's already on the gallery.</p><form id=upload data-ng-hide=form.$submitted data-ng-submit=upload()><div class=form-group><label for=repo>Source code</label><input type=url data-ng-model=repo id=repo class=form-control placeholder=\"Url to the source code repository\"></div><div class=form-group><label for=issuetracker>Issue tracker</label><input type=url id=issuetracker data-ng-model=issuetracker class=form-control placeholder=\"Url to the issue tracker\"></div><div class=form-group><label for=uploadfile>Select file</label><input type=file id=uploadfile accept=.vsix required><p class=help-block>Only .vsix files are supported</p></div><input type=submit value=Upload class=\"btn-sm btn-primary\"><p class=has-error data-ng-show=\"upload.url.$invalid || error\">{{error}}</p></form>"
  );

}]);
