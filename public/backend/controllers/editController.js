myApp.controller('EditController',['$scope','$http', '$location', '$routeParams','fileUpload','$uibModal',function($scope, $http, $location, $routeParams,fileUpload,$uibModal){
  $scope.message = "En el Edit Controller";

  var opts = {
      lines: 9 // The number of lines to draw
    , length: 0 // The length of each line
    , width: 17 // The line thickness
    , radius: 27 // The radius of the inner circle
    , scale: 0.50 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#FFD250' // #rgb or #rrggbb or array of colors
    , opacity: 0.10 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 0.9 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '25%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    //, position: 'absolute' // Element positioning
  }

  $scope.spinnerActive = 0;

  $scope.stopSpinner = function(){
    $scope.spinnerActive = 0;
    jQuery($("#spinner")).spin(false);
  }

  $scope.initSpinner = function(){
    $scope.spinnerActive = 1;
    jQuery($("#spinner")).spin(opts);
  }

  $scope.refresh = function(){
    //console.log("ID Proyecto: "+$routeParams.idProyecto);
    $scope.idProyecto = $routeParams.idProyecto;
    $http.get('/proyecto/'+$routeParams.idProyecto).success(function(response){
      $scope.proyecto = response;
      $scope.publicado = response.publicado;
    });
    $http.get('/gruposImagenes/'+$routeParams.idProyecto).success(function(response){
      //console.log("Grupos",response)
      /*for(var i=0; i<response.length;i++){
        console.log(i+") ",response[i].orden);
      }*/
      $scope.gruposImagenes = response;
      $scope.contadorGrupos = response.length;
      $scope.ordenGrupos = response.length-1;
    });
    $scope.progressBarOn=false;

  }

  $scope.refresh();

  $scope.editProject = function(oProyecto){
    var validForm = $scope.validarForm(oProyecto);
    if(validForm){
      $scope.initSpinner();
      $http.put('/proyecto',$scope.proyecto).success(function(data,status){
        if($scope.portadaFile!=null){
          var file = $scope.portadaFile;
          var idProyecto = $scope.idProyecto;
          var fileName = file.name;
          var uploadUrl = "/portadaUpload?idProyecto="+idProyecto+"&fileName="+fileName;
          //fileUpload.uploadFileToUrl(file, uploadUrl,idProyecto);
          var fd = new FormData();
          fd.append('file', file);
          $http.put(uploadUrl, fd, {
             //Esto lo que hace es darle el poder a $http de decidir el content type correcto
             transformRequest: angular.identity,
             headers: {'Content-Type': undefined}
           }).success(function(){
             //console.log("Portada Success");
             $scope.volver();
          }).error(function(){
            console.log("Error de Upload");
          });
        }else{
          $scope.volver();
        }
      }).error(function(data, status){
          alert("error : "+status);
      });
    }
  }


  $scope.validarForm = function(oProyecto){
    var valido = true;
    if(oProyecto.foto_portada==null){
      if($scope.portadaFile!=null){
        if($scope.portadaFile.$untouched){
          $scope.portadaMessageError = "*Debe seleccionar una imagen."
          valido = false;
        }else if($scope.portadaFile.type != "image/jpeg" && $scope.portadaFile.type != "image/png"){
          $scope.portadaMessageError = "*La imagen debe ser JPG o PNG.";
          valido = false;
        }
      }else{
        valido = false;
      }
    }

    if($scope.editForm.nombreProyecto.$modelValue==null){
      $scope.nombreMessageError = "*Debe definir el nombre del proyecto."
      valido = false;
    }
    if($scope.editForm.descripcionProyecto.$modelValue==null){
      $scope.proyecto.descripcion = "";
    }
    return valido;
  }

  $scope.volver = function(){
    $location.path('/Listado');
  }

  $scope.deleteImage = function(oImagen){
    /*
    console.log("******************************")
    console.log("EDIT CONTROLLER - DELETE IMAGE")
    console.log("******************************")
    console.log("Eliminar Imagen: ",oImagen._id);
    console.log("Eliminar Imagen ID Proyecto: ",$scope.proyecto._id);
    */
    var idProyecto = $scope.proyecto._id;
    var idImagen = oImagen._id;
    $http.delete('/eliminarImagen', {params: {idImagen:idImagen,idProyecto:idProyecto}})
      .success(function(data,status){
        $scope.refresh();
      })
      .error(function(data,status){
        console.log("Error al eliminar");
      })
    }

    $scope.definirPortada = function(oImagen){
      /*
      console.log("*********************************")
      console.log("EDIT CONTROLLER - DEFINIR PORTADA")
      console.log("*********************************")
      */
      var idProyecto = $scope.proyecto._id;
      var idImagen = oImagen._id;
      $http.put('/definirPortada', {params: {idImagen:idImagen,idProyecto:idProyecto}})
        .success(function(data,status){
          $scope.refresh();
        })
        .error(function(data,status){
          console.log("Error al definir como portada");
        })

    }

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      console.log("DropDown abierto!")
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));

    $scope.publicar = function(){
      var  validForm = $scope.validarForm($scope.proyecto);
      if(validForm){
        $scope.proyecto.publicado = true;
        $http.put('/proyecto',$scope.proyecto).success(function(data,status){
          $location.path('/Listado');
        }).error(function(data, status){
            alert("error : "+status);
        });
      }
    }

    $scope.despublicar = function(){
      $scope.proyecto.publicado = false;
      $http.put('/proyecto',$scope.proyecto).success(function(data,status){
        $location.path('/Listado');
      }).error(function(data, status){
          alert("error : "+status);
      });;
    }

    $scope.modalDeleteImage = function(oImage){

    }

    $scope.crearGrupo = function(idGrupo){
      //$scope.openProgressModal();
      var template = "";
      var controller = "";
      var size = "md";
      if(idGrupo==1){
        template = "grupo1";
        controller = "ModalGrupo1ImagenesController";
      }else if(idGrupo==2){
        template = "grupo2";
        controller = "ModalGrupo2ImagenesController";
      }else if(idGrupo==3){
        template = "grupo3";
        controller = "ModalGrupo3ImagenesController";
        size = "lg";
      }
      var modalInstance = $uibModal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: template,
        controller: controller,
        size: size,
        resolve: {
          proyecto: function(){
            return $scope.proyecto;
          },
          contGrupos: function(){
            return $scope.contadorGrupos;
          }
        }
      });

        modalInstance.result.then(function () {
          $http.get('/gruposImagenes/'+$routeParams.idProyecto).success(function(response){
            $scope.gruposImagenes = response;
            $scope.contadorGrupos = response.length;
            $scope.ordenGrupos = response.length-1;
          });
        }, function () {

        });
    }

    $scope.deleteGrupo = function(oGrupo){
      //console.log("ID",oGrupo._id);
      $http.delete('/grupoImagenes/'+oGrupo._id).success(function(status){
          }).error(function(data, status){
            alert("error : "+status);
          });;
      $scope.refresh();
    }

    $scope.subirPosicion = function(oGrupo){
      var ord = oGrupo.orden;
      var ordAnt = ord-1;
      //console.log(ord," - ",ordAnt);
      //PRIMERO BUSCO EL GRUPO ANTERIOR POR SU NUMERO DE ORDEN
      $http.get('/grupoImagenesByOrden/'+ordAnt).success(function(grupoAnterior){
        //console.log("GrupoAnterior: ",grupoAnterior);
        //SEGUNDO LE INCREMENTO EL ORDEN A ESE OBJETO
        $http.put('/grupoImagenesIncrementarOrden',grupoAnterior).success(function(data,status){
          //console.log("Orden. Primera edicion OK.")
          //TERCERO LE DISMINUYO EL ORDEN AL OBJETO MARCADO ORIGINALMENTE
          $http.put('/grupoImagenesDisminuirOrden',oGrupo).success(function(data,status){
            //console.log("Orden. Segunda edicion OK.")
            $scope.refresh();
          }).error(function(data, status){
              alert("error : "+status);
          });
        }).error(function(data, status){
            alert("error : "+status);
        });
      });
    }

    $scope.bajarPosicion = function(oGrupo){
      var ord = oGrupo.orden;
      var ordSig = ord+1;
      //console.log(ord," - ",ordSig);
      //PRIMERO BUSCO EL GRUPO SIGUIENTE POR SU NUMERO DE ORDEN
      $http.get('/grupoImagenesByOrden/'+ordSig).success(function(grupoSiguiente){
        //console.log("GrupoSiguiente: ",grupoSiguiente);
        //SEGUNDO LE DISMINUYO EL ORDEN A ESE OBJETO
        $http.put('/grupoImagenesDisminuirOrden',grupoSiguiente).success(function(data,status){
          //console.log("Orden. Primera edicion OK.")
          //TERCERO LE INCREMENTO EL ORDEN AL OBJETO MARCADO ORIGINALMENTE
          $http.put('/grupoImagenesIncrementarOrden',oGrupo).success(function(data,status){
            //console.log("Orden. Segunda edicion OK.")
            $scope.refresh();
          }).error(function(data, status){
              alert("error : "+status);
          });
        }).error(function(data, status){
            alert("error : "+status);
        });
      });
    }

/*
    $scope.openProgressModal = function(){
      var modalProgressInstance = $uibModal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: 'modalProgressBar',
        controller: 'ProgressBarController',
        size: 'sm',
      });
    }
  */
}]);
