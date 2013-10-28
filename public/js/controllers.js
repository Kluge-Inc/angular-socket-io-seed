'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
  }).
  controller('ChatCtrl', function ($scope, socket) {
    function message(obj){
      var el = document.createElement('p');
      el.innerHTML = '<em>' +  esc(obj.text) + '</em>'
      document.getElementById('chat').appendChild(el);
      document.getElementById('chat').scrollTop = 1000000;
    }

    function esc(msg){
      return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    twSocket.on('message', function(obj){
      message(obj);
    });
  }).

  controller('DeliveryCtrl', function ($scope, socket) {
    $scope.submit = function() {
      if (this.text) {
        twSocket.send(this.text);
      }
    };
  });