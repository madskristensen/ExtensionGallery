galleryApp.service("dataService", ["$http", function ($http) {

    var apiBase = "/api/",
		extBase = "/extensions/",
		cache = [],
		readme = {};

    function normalizePackage(package) {

        package.DownloadUrl = extBase + package.ID + "/" + encodeURIComponent(package.Name + " v" + package.Version) + ".vsix";

        if (package.Icon) {
            package.Icon = extBase + package.ID + '/' + package.Icon;
        } else {
            package.Icon = constants.DEFAULT_ICON_IMAGE;
        }

        if (package.Preview) {
            package.Preview = extBase + package.ID + '/' + package.Preview;
        } else {
            package.Preview = constants.DEFAULT_PREVIEW_IMAGE;
        }

        package.SupportedVersions = package.SupportedVersions.map(function (v) {
            if (v.indexOf('11.') == 0)
                return 2012;
            if (v.indexOf('12.') == 0)
                return 2013;
            if (v.indexOf('14.') == 0)
                return 2015;
        });

        package.relativeDate = moment(package.DatePublished).fromNow();

        return package;
    }

    this.getAllExtensions = function (callback) {

        if (cache.length > 0)
            return callback(cache);

        $http.get(apiBase + "get/")
			.success(function (data) {

			    for (var i = 0; i < data.length; i++) {
			        normalizePackage(data[i]);
			    }

			    cache = data;
			    callback(data);
			})
		.error(function (response) {
		    callback({ error: true });
		});
    }

    this.getExtension = function (id, callback) {
        var package = cache.filter(function (p) { return p.ID === id });

        if (package.length > 0)
            return callback(package[0]);

        $http.get(apiBase + "get/" + id).success(function (data) {

            callback(normalizePackage(data));
        });
    }

    this.upload = function (bytes, query, callback) {
        $http.post(apiBase + "upload" + query, new Blob([bytes], {})).success(function (data) {

            for (var i = 0; i < cache.length; i++) {
                var package = cache[i];

                if (package.ID == data.ID) {
                    cache.splice(i, 1);
                    break;
                }
            }

            cache.splice(0, 0, normalizePackage(data));

            callback(data);
        })
		.error(function (response) {
		    callback({ error: true });
		});;
    }

    this.getMarkdown = function (package, callback) {

        if (!package.Repo) {
            callback({ error: true });
            return;
        }

        var url = package.Repo.replace("https://github.com", "https://raw.githubusercontent.com") + "master/README.md";

        $http.get("http://markdownservice.azurewebsites.net/markdown.ashx?url=" + url)
			.success(function (data) {
			    callback(data);
			})
		.error(function (response) {
		    callback({ error: true });
		});
    }

}]);

