var galleryApp = angular

    .module('galleryApp', ['ngRoute'])

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        //$locationProvider.html5Mode(true);

        $routeProvider
            .when('/',
            {
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