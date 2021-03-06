﻿var galleryApp = angular

    .module('galleryApp', ['ngRoute'])

	.filter('escape', function () {
	    return window.encodeURIComponent;
	})

    .filter('rawHtml', ['$sce', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    }])

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
            .when('/guide/dev/',
            {
                controller: 'devguideController',
                templateUrl: 'app/views/devguide.html'
            })
			.when('/guide/feed/',
            {
                controller: 'feedguideController',
                templateUrl: 'app/views/feedguide.html'
            })
            .otherwise(
            {
                redirectTo: '/'
            });
    }]);