
galleryApp.controller('homeController', ['$scope', 'dataService', function ($scope, dataService) {

	$scope.headline = "Nightly builds of popular extensions";
	$scope.feed = "/feed/";

    dataService.getAllExtensions().success(function (data) {

        for (var i = 0; i < data.length; i++) {
        	dataService.normalizePackage(data[i]);
        }

        $scope.packages = data;
    });

}]);
