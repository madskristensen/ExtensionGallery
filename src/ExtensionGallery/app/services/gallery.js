galleryApp.service("dataService", ["$http", function ($http) {

    var urlBase = "/home/";

    this.getAllExtensions = function () {
        return $http.get(urlBase + "getallextensions");
    }

    this.getExtension = function (id) {
        return $http.get(urlBase + "extension/" + id);
    }

    this.upload = function (url) {
        return $http.post(urlBase + "ping/?url=" + encodeURIComponent(url));
    }

}]);

