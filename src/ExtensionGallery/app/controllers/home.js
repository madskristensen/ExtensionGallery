
galleryApp.controller('homeController', ['$scope', 'dataService', function ($scope, dataService) {

	$scope.headline = "Nightly builds of popular extensions";
	$scope.feed = "/feed/";

	$scope.query = '';

	$scope.packageSearch = function (package) {
		var q = $scope.query.toUpperCase();

		return package.Name.toUpperCase().indexOf(q) != -1 ||
			   package.Description.toUpperCase().indexOf(q) != -1 ||
			   package.Author.toUpperCase().indexOf(q) != -1 ||
			   package.Tags.toUpperCase().indexOf(q) != -1;
	};

	dataService.getAllExtensions().success(function (data) {

		for (var i = 0; i < data.length; i++) {
			dataService.normalizePackage(data[i]);
		}

		$scope.packages = data;
	});

}]);
