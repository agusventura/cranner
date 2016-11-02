myFrontend.controller('VerProyectoController', function ($scope, $http, $uibModalInstance, detProyecto) {
  //console.log("Dentro del controller del modal",detProyecto)
  $scope.detProyecto = detProyecto;
  $http.get('/gruposImagenes/'+detProyecto._id).success(function(response){
    $scope.gruposImagenes = response;
    console.log("grupos",response)
  });

  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  };

});
