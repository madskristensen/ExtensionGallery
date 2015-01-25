
galleryApp.controller('uploadController', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {

    $scope.url = "https://ci.appveyor.com/api/buildjobs/qahx3eg32h6h0nuk/artifacts/src/vsix/bin/Release/OpenFromPortal.vsix";
    $scope.error = "";

    $scope.upload = function () {
        if (!$scope.url || $scope.url.length == 0)
            return;

        dataService.upload($scope.url)
            .success(function (data) {
                $location.path('#/extension/' + data.ID);
            })
            .error(function (data, status, header, config) {
                switch (status) {
                    case 500:
                        $scope.error = "A problem occured reading your VSIX. Please make sure your VSIX is valid";
                        break;
                    default:
                        $scope.error = "Unknown error occured. Please make sure your VSIX is valid.";
                }
            });
    };


}]);
