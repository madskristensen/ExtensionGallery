
galleryApp.controller('homeController', ['$scope', 'dataService', function ($scope, dataService) {


    dataService.getAllExtensions().success(function (data) {

        for (var i = 0; i < data.length; i++) {
            var package = data[i];

            if (package.Icon)
                package.Icon = '/extensions/' + package.ID + '/preview.png';
            else
                package.Icon = constants.DEFAULT_ICON_IMAGE;
        }

        $scope.packages = data;
    });

}]);
