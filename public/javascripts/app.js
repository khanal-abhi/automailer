var app = angular.module('automailer', []);

app.controller('ListUsers', function($scope, $http){
  $http.get('users/emails')
  .then(function(response){
    $scope.users = response.data;
  });
});

app.controller('RegisterFrom', function($scope, $http){
  $scope.user = {};
  this.insert = function(){
    
  }
});
