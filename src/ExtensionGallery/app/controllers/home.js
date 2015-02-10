
galleryApp.controller('homeController', ['$scope', '$rootScope', 'dataService', function ($scope, $rootScope, dataService) {

	$rootScope.pageTitle = "Open VSIX Gallery";

	$scope.feed = "/feed/";
	$scope.query = '';

	$scope.packageSearch = function (package) {
		var q = $scope.query.toUpperCase();

		return package.Name.toUpperCase().indexOf(q) != -1 ||
			   package.Description.toUpperCase().indexOf(q) != -1 ||
			   package.Author.toUpperCase().indexOf(q) != -1 ||
			   (package.Tags && package.Tags.toUpperCase().indexOf(q) != -1);
	};

	dataService.getAllExtensions(function (data) {
		$scope.packages = data;
	});

}]);
