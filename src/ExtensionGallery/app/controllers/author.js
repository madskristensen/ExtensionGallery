
galleryApp.controller('authorController', ['$scope', '$rootScope', '$route', 'dataService', function ($scope, $rootScope, $route, dataService) {

	$rootScope.pageTitle = "Extensions by " + toTitleCase($route.current.params.name);

	$scope.feed = "/feed/author/" + $route.current.params.name + "/";
	$scope.query = '';


	$scope.packageSearch = function (package) {
		var q = $scope.query.toUpperCase();

		return package.Name.toUpperCase().indexOf(q) != -1 ||
			   package.Description.toUpperCase().indexOf(q) != -1 ||
			   package.Author.toUpperCase().indexOf(q) != -1 ||
			   (package.Tags && package.Tags.toUpperCase().indexOf(q) != -1);
	};

	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	}

     dataService.getAllExtensions(function (data) {

    	var author = $route.current.params.name.toUpperCase()

    	$scope.packages = data.filter(function (p) { return p.Author.toUpperCase() === author });
    });

}]);
