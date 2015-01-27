
galleryApp.controller('uploadController', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {

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

			dataService.upload(result.target.result, "?repo=" + encodeURIComponent($scope.repo) + "&issuetracker=" + encodeURIComponent($scope.issuetracker))
			    .success(function (data) {
			    	$location.path('/extension/' + data.ID);
			    })
			    .error(function (data, status, header, config) {
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
