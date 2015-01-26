galleryApp.service("dataService", ["$http", function ($http) {

	var urlBase = "/home/";

	this.getAllExtensions = function () {
		return $http.get(urlBase + "getallextensions");
	}

	this.getExtension = function (id) {
		return $http.get(urlBase + "extension/" + id);
	}

	this.upload = function (bytes) {
		return $http.post(urlBase + 'uploadfile', new Blob([bytes], {}));
		//var xhr = new XMLHttpRequest();
		//xhr.open('POST', urlBase + 'uploadfile', true);
		//var blob = new Blob([bytes], {});
		//xhr.send(blob);  // multipart/form-data
		//return xhr;
	}

}]);

