
galleryApp.controller('authorController', ['$scope', '$route', 'dataService', function ($scope, $route, dataService) {


    dataService.getAllExtensions().success(function (data) {

    	packages = [];

    	for (var i = 0; i < data.length; i++) {
    		var package = data[i];
			console.log(package.Author, $route.current.params.name)
    		if (package.Author.toUpperCase() === $route.current.params.name.toUpperCase()) {
    			packages.push(dataService.normalizePackage(package));
    		}
        }

        $scope.packages = packages;
    });

}]);
