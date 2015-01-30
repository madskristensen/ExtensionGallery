
galleryApp.controller('uploadController', ['$scope', '$rootScope', '$location', 'dataService', function ($scope, $rootScope, $location, dataService) {

	$rootScope.pageTitle = "Upload an extension";

	$scope.error = "";
	$scope.repo = "";
	$scope.issuetracker = "";

	if (localStorage) {
		$scope.repo = localStorage["upload.repo"];
		$scope.issuetracker = localStorage["upload.issuetracker"];
	}

	$scope.upload = function () {
		var fileInput = document.getElementById("uploadfile");
		var reader = new FileReader();
		reader.onload = function (result) {

			var query = "?repo=" + encodeURIComponent($scope.repo) + "&issuetracker=" + encodeURIComponent($scope.issuetracker);
			dataService.upload(result.target.result, query, function (data) {

				if (!data.error)
					$location.path('/extension/' + data.ID);
				else
					$scope.error = data;
			});
		};

		reader.readAsArrayBuffer(fileInput.files[0]);

		if (localStorage && localStorage["upload.repo"])
			localStorage["upload.repo"] = $scope.repo;
		if (localStorage && localStorage["upload.issuetracker"])
			localStorage["upload.issuetracker"] = $scope.issuetracker;
	};

}]);
