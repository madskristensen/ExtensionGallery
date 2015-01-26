
galleryApp.controller('uploadController', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {

	$scope.error = "";



	$scope.upload = function () {
		var fileInput = document.getElementById("uploadfile");
		var reader = new FileReader();
		reader.onload = function (result) {

			dataService.upload(result.target.result)
			    .success(function (data) {
			    	$location.path('/extension/' + data.ID);
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

		reader.readAsArrayBuffer(fileInput.files[0]);
	};

}]);
