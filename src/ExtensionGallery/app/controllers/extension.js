
galleryApp.controller('extensionController', ['$scope', '$rootScope', '$location', '$route', 'dataService', function ($scope, $rootScope, $location, $route, dataService) {

    var id = $route.current.params.id;

    dataService.getExtension(id, function (data) {

        if (data.error) {
            $location.path('/');
        }

        $rootScope.pageTitle = data.Name;

        dataService.getMarkdown(data, function (data) {
            if (data.error !== true)
                $scope.package.readme = data;
        });

        $scope.package = data;
    });

    window.scrollTo(0, 0);

}]);
