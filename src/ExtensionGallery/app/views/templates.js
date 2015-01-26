angular.module('galleryApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/views/extension.html',
    "<div id=extensions><div ng-model=package ng-show=package><h1 class=page-header>{{package.Name}} - {{package.Version}}</h1><article><img class=preview ng-src={{package.Preview}} alt=\"{{package.Name}}\"><p>{{package.Description}}</p><div class=details><p><strong>Author:</strong> <a ng-href=\"#/author/{{package.Author | lowercase }}\">{{package.Author}}</a></p><p><strong>Supports:</strong> Visual Studio <span ng-repeat=\"version in package.SupportedVersions\">{{version + '&nbsp;'}}</span></p><p><strong>Tags:</strong> {{package.Tags}}</p><p><strong>Updated:</strong> <time>{{package.DatePublished | date:'MMM d. yyyy'}}</time></p></div><br><a class=\"btn-sm btn-primary\" ng-href={{package.DownloadUrl}}><span class=\"glyphicon glyphicon-cloud-download\" aria-hidden=true></span> Download</a> <a class=\"btn-sm btn-success\" ng-href=/home/feed/{{package.ID}}><span class=\"glyphicon glyphicon-cog\" aria-hidden=true></span> Feed</a></article><br><div ng-show=package.License><h2>License</h2><pre>{{package.License}}</pre></div></div></div>"
  );


  $templateCache.put('app/views/home.html',
    "<div id=extensions><article ng-repeat=\"package in packages\"><img class=icon ng-src={{package.Icon}} alt=\"{{package.Name}}\"><h2><a ng-href=#/extension/{{package.ID}}>{{package.Name}} - {{package.Version}}</a></h2><p>{{package.Description}}</p><a class=\"btn-sm btn-primary\" ng-href={{package.DownloadUrl}}><span class=\"glyphicon glyphicon-cloud-download\" aria-hidden=true></span> Download</a> <a ng-href=/home/feed/{{package.ID}} class=\"btn-sm btn-success\"><span class=\"glyphicon glyphicon-cog\" aria-hidden=true></span> Feed</a> <time>{{package.DatePublished | date:'MMM d. yyyy'}}</time></article></div>"
  );


  $templateCache.put('app/views/upload.html',
    "<h1 class=page-header>Upload new extension</h1><p>Tincidunt integer eu augue augue nunc elit dolor, luctus placerat scelerisque euismod, iaculis eu lacus nunc mi elit, vehicula ut laoreet ac, aliquam sit amet justo nunc tempor, metus vel.</p><form id=upload ng-hide=form.$submitted><input type=file id=uploadfile placeholder=\"URI to VSIX file\" required> <a class=\"btn-sm btn-primary\" ng-click=upload()><span class=\"glyphicon glyphicon-cloud-upload\" aria-hidden=true></span> Upload</a><p class=has-error ng-show=\"upload.url.$invalid || error\">{{error}}</p></form>"
  );

}]);
