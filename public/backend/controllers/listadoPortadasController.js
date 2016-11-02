myApp.controller('ListadoPortadasController',['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.refresh = function(){
    $http.get('/portadas').success(function(portadas){
      $scope.portadas = portadas;
    });
  };

  $scope.deletePortada = function(oPortada){
    $http.delete('/portada/'+oPortada._id).success(function(status){
        }).error(function(data, status){
          alert("error : "+status);
        });;
    $scope.refresh();
  }

  $scope.crearPortada = function(){
    $location.path('/AltaPortada');
  }

}]);
