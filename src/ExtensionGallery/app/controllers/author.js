
galleryApp.controller('authorController', ['$scope', '$route', 'dataService', function ($scope, $route, dataService) {

	$scope.headline = "Extensions by " + toTitleCase($route.current.params.name);
	$scope.feed = "/feed/author/" + $route.current.params.name + "/";

	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	}

    dataService.getAllExtensions().success(function (data) {

    	packages = [];

    	for (var i = 0; i < data.length; i++) {
    		var package = data[i];

    		if (package.Author.toUpperCase() === $route.current.params.name.toUpperCase()) {
    			packages.push(dataService.normalizePackage(package));
    		}
        }

        $scope.packages = packages;
    });

}]);
