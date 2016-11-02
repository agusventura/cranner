myApp.controller('AltaPortadaController',['$scope','$http', '$location', '$routeParams','fileUpload',function($scope, $http, $location, $routeParams,fileUpload){

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
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    //, position: 'absolute' // Element positioning
  }


  $scope.initSpinner = function(){
    jQuery($("#spinner")).spin(opts);
  }

  $scope.stopSpinner = function(){
    jQuery($("#spinner")).spin(false);
  }

  $scope.cancelar = function(){
    $location.path('/ListadoPortadas');
  }

  $scope.validarForm = function(){
    var valido = true;
    if($scope.altaBannerForm.bannerFile.$untouched){
      $scope.bannerFileError = "*Debe seleccionar una imagen."
      valido = false;
    }
    if($scope.bannerFile!=null){
      if($scope.bannerFile.type != "image/jpeg" && $scope.bannerFile.type != "image/png"){
        $scope.bannerFileError = "*La imagen debe ser JPG o PNG.";
        valido = false;
      }
    }
    return valido;
  }

  $scope.crearPortada = function(portada){
    //PRIMERO CREO LA PORTADA
    var validForm = $scope.validarForm();
    if(validForm){
      $scope.initSpinner();
      $http.post('/portada').success(function(portada, status){
        //SEGUNDO SUBO EL ARCHIVO
        var file = $scope.bannerFile;
        //console.log(file)
        var idPortada = portada._id;
        var fileName = file.name;
        var uploadUrl = "/bannerUpload?idPortada="+idPortada+"&fileName="+fileName;
        var fd = new FormData();
        fd.append('file', file);
        $http.put(uploadUrl, fd, {
           //Esto lo que hace es darle el poder a $http de decidir el content type correcto
           transformRequest: angular.identity,
           headers: {'Content-Type': undefined}
         }).success(function(){
           //console.log("Banner Portada Success");
           //TERCERO REDIRECCIONO AL LISTADO
           $location.path('/ListadoPortadas/');
        }).error(function(){
          console.log("Error de Upload Banner Portada");
        });
      }).error(function(data, status){
          alert("error : "+status);
      });;
    }
  }
}]);
