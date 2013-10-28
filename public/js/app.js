'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',

  // 3rd party dependencies
  'btford.socket-io'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/chat', {
      templateUrl: 'partials/chat',
      controller: 'ChatCtrl'
    }).
    otherwise({
      redirectTo: '/chat'
    });

  $locationProvider.html5Mode(true);
});

var twSocket = io.connect('http://localhost:3000');
