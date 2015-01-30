var galleryApp = angular

    .module('galleryApp', ['ngRoute'])

	.filter('escape', function () {
		return window.encodeURIComponent;
	})


    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    	$locationProvider.html5Mode(true);

    	$routeProvider
            .when('/',
            {
            	title: 'Visual Studio Extension Gallery',
            	controller: 'homeController',
            	templateUrl: 'app/views/home.html'
            })
			.when('/author/:name',
            {
            	controller: 'authorController',
            	templateUrl: 'app/views/home.html'
            })
            .when('/extension/:id/',
            {
            	controller: 'extensionController',
            	templateUrl: 'app/views/extension.html'
            })
            .when('/upload',
            {
            	controller: 'uploadController',
            	templateUrl: 'app/views/upload.html'
            })
            .otherwise(
            {
            	redirectTo: '/'
            });
    }]);