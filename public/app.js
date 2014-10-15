var app = angular.module('gistable', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider) {
    'use strict';

    // $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'HomeController'
        });
});

app.controller('HomeController', function($routeParams, $cookies, ghApi, $scope) {
    'use strict';

    ghApi.initialize($cookies.access_token).then(function() {
        return ghApi.getAllGists();
    }).then(function(response) {
        $scope.gists = response.data;
    });
});

app.service('ghApi', function($http) {
    'use strict';

    var user = null;
    var headers = null;

    this.initialize = function(accessToken) {
        headers = {
            headers: {
                Authorization: 'token ' + accessToken
            }
        };

        return $http.get('https://api.github.com/user', headers).success(function(data) {
            user = data;
        });
    };

    this.getAllGists = function() {
        return $http.get('https://api.github.com/users/' + user.login + '/gists');
    };
});
