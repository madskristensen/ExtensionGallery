
galleryApp.controller('extensionController', ['$scope', '$location', '$route', 'dataService', function ($scope, $location, $route, dataService) {

	var id = $route.current.params.id;
	$scope.older = [];

	dataService.getExtension(id).success(function (data) {

		if (data.Error) {
			$location.path('/');
		}

		var package = dataService.normalizePackage(data);

		$scope.package = data;
	});

}]);
