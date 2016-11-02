myApp.controller('MainController',['$scope', '$http', '$location','$rootScope', function($scope, $http, $location,$rootScope) {

  //console.log("rootScope",$rootScope.globals.currentUser)
  if($rootScope.globals.currentUser!=null){
    $scope.usuarioAutenticado = 1;
  }else{
    $scope.usuarioAutenticado = 0;
  }

  //console.log("uAut",$scope.usuarioAutenticado);

  $scope.refresh = function(){
    $http.get('/proyectos').success(function(response){
      $scope.proyectos = response;
      $scope.ordenProyectos = response.length-1;
    });
  };

  $scope.editProject = function(oProyecto){
    //con .search le paso parametros a la siguiente pantalla.
    $location.path('/Editar/').search({idProyecto: oProyecto._id});
  };

  $scope.deleteProject = function(oProyecto){
    //console.log("Objeto Proyecto:"+oProyecto);
    $http.delete('/proyectos/'+oProyecto._id).success(function(status){
        }).error(function(data, status){
          alert("error : "+status);
        });;
    $scope.refresh();
  }

  $scope.publicar = function(oProyecto){
    oProyecto.publicado = true;
    $http.put('/proyecto',oProyecto).success(function(data,status){
      $scope.refresh();
    }).error(function(data, status){
        alert("error : "+status);
    });;
  }

  $scope.despublicar = function(oProyecto){
    oProyecto.publicado = false;
    $http.put('/proyecto',oProyecto).success(function(data,status){
      $scope.refresh();
    }).error(function(data, status){
        alert("error : "+status);
    });;
  }

  $scope.crearProyecto = function(){
    $location.path('/Alta');
  }



  $scope.subirPosicion = function(oProyecto){
    var ord = oProyecto.orden;
    var ordAnt = ord-1;
    console.log(ord," - ",ordAnt);
    //PRIMERO BUSCO EL PROYECTO ANTERIOR POR SU NUMERO DE ORDEN
    $http.get('/proyectoByOrden/'+ordAnt).success(function(proyectoAnterior){
      console.log("ProyectoAnterior: ",proyectoAnterior);
      //SEGUNDO LE INCREMENTO EL ORDEN A ESE OBJETO
      $http.put('/proyectoIncrementarOrden',proyectoAnterior).success(function(data,status){
        console.log("Orden. Primera edicion OK.")
        //TERCERO LE DISMINUYO EL ORDEN AL OBJETO MARCADO ORIGINALMENTE
        $http.put('/proyectoDisminuirOrden',oProyecto).success(function(data,status){
          console.log("Orden. Segunda edicion OK.")
          $scope.refresh();
        }).error(function(data, status){
            alert("error : "+status);
        });
      }).error(function(data, status){
          alert("error : "+status);
      });
    });
  }

  $scope.bajarPosicion = function(oProyecto){
    var ord = oProyecto.orden;
    var ordSig = ord+1;
    console.log(ord," - ",ordSig);
    //PRIMERO BUSCO EL PROYECTO SIGUIENTE POR SU NUMERO DE ORDEN
    $http.get('/proyectoByOrden/'+ordSig).success(function(proyectoSiguiente){
      console.log("ProyectoSiguiente: ",proyectoSiguiente);
      //SEGUNDO LE DISMINUYO EL ORDEN A ESE OBJETO
      $http.put('/proyectoDisminuirOrden',proyectoSiguiente).success(function(data,status){
        console.log("Orden. Primera edicion OK.")
        //TERCERO LE INCREMENTO EL ORDEN AL OBJETO MARCADO ORIGINALMENTE
        $http.put('/proyectoIncrementarOrden',oProyecto).success(function(data,status){
          console.log("Orden. Segunda edicion OK.")
          $scope.refresh();
        }).error(function(data, status){
            alert("error : "+status);
        });
      }).error(function(data, status){
          alert("error : "+status);
      });
    });
  }
}]);
