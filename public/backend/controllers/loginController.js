myApp.controller('LoginController', ['$scope', '$http', '$location','AuthenticationService',function($scope, $http, $location,AuthenticationService) {
  $scope.refresh = function(){
    $scope.usuarioAutenticado = 0;
  }

  // reset login status
  AuthenticationService.ClearCredentials();

  $scope.login = function () {
      //console.log("uAut: ",$scope.usuarioAutenticado)
      $scope.dataLoading = true;
      AuthenticationService.Login($scope.username, $scope.password, function(response) {
          console.log("HAY RESPUESTA: ",response);
          if(response.success) {
              AuthenticationService.SetCredentials($scope.username, $scope.password);
              $scope.usuarioAutenticado = 1;
              //console.log("uAut: ",$scope.usuarioAutenticado)
              $location.path('/').search({usuarioAutenticado: $scope.usuarioAutenticado});;
          } else {
              $scope.dataLoading = false;
              $scope.error = response.error;

          }
      });
  };
}]);
