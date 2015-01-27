
galleryApp.controller('extensionController', ['$scope', '$rootScope', '$location', '$route', 'dataService', function ($scope, $rootScope, $location, $route, dataService) {

	var id = $route.current.params.id;
	$scope.older = [];

	dataService.getExtension(id).success(function (data) {

		if (data.Error) {
			$location.path('/');
		}

		var package = dataService.normalizePackage(data);

		$rootScope.pageTitle = data.Title;

		$scope.package = data;
	});

}]);
