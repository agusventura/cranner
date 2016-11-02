myApp.controller('AltaController', ['$scope', '$http', '$location',function($scope, $http, $location) {

  $scope.validarForm = function(){
    var valido = true;
    console.log("nom: ",$scope.altaProyectoForm.nombreProyecto.$modelValue);
    if($scope.altaProyectoForm.nombreProyecto.$modelValue==null){
      $scope.nombreMessageError = "*Debe definir el nombre del proyecto."
      valido = false;
    }
    return valido;
  }


  $scope.createProyect = function(){
    var  validForm = $scope.validarForm();
    if(validForm){
      $scope.proyecto.publicado = false;
      $scope.proyecto.orden = $scope.contadorProyectos;
      $http.post('/proyectos', $scope.proyecto).success(function(data, status){
        $scope.proyecto.nombre = '';
        $scope.proyecto.descripcion = '';
        $location.path('/Editar/').search({idProyecto: data._id});
      }).error(function(data, status){
              alert("error : "+status);
      });;
    }
  }

  $scope.cancelar = function(){
    $location.path('/Listado');
  }

  this.$onInit = function(){
    console.log("Alta Controller");
    $http.get('/proyectos').success(function(response){
      $scope.contadorProyectos = response.length;
      $scope.ordenProyectos = response.length-1;
      console.log($scope.cantProy)
    });
  }
}]);
