var app = angular.module('gistable', ['ngRoute']);

app.config(function($routeProvider) {
    'use strict';

    // $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
        	templateUrl: 'home.html',
        	controller: 'HomeController'
        });
});

app.controller('HomeController', function($routeParams) {
    'use strict';

    console.log('Horton hears a hoo!');
});