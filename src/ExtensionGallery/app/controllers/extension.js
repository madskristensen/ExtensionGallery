
galleryApp.controller('extensionController', ['$scope', '$location', '$route', 'dataService', function ($scope, $location, $route, dataService) {

	var id = $route.current.params.id;
	$scope.older = [];

	dataService.getExtension(id).success(function (data) {

		if (data.Error) {
			$location.path('/');
		}

		var package = data;

		if (package.Preview) {
			package.Preview = '/extensions/' + package.ID + '/preview.png';
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

		$scope.package = data;
	});

}]);
