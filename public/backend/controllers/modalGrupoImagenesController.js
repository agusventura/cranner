myApp.controller('ModalGrupo1ImagenesController', function ($scope,$http, $uibModalInstance,proyecto,contGrupos) {
  console.log("Dentro del controller del modal",proyecto)

  $scope.uploadMessage = "";
  $scope.uploadMessageError = "";

  $scope.proyecto = proyecto;
  $scope.contGrupos = contGrupos;

  $scope.spinnerActive = 0;
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

  $scope.stopSpinner = function(){
    $scope.spinnerActive = 0;
    jQuery($("#spinner")).spin(false);
  }

  $scope.initSpinner = function(){
    $scope.spinnerActive = 1;
    jQuery($("#spinner")).spin(opts);
  }


  console.log("Cont Grupos: ",$scope.contGrupos);

  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cancelar = function () {
    $uibModalInstance.dismiss('cancel');
  };



  $scope.grabarGrupo = function(){
    $scope.initSpinner();
    $scope.progressBarOn=true;
    console.log("File G1F1",$scope.imagenG1File);
    console.log("File G1F1",$scope.fGrupo1.imagenG1File);
    if($scope.fGrupo1.imagenG1File.$untouched){
      $scope.uploadMessageError = "*Debe seleccionar una imagen."
    }else{
      if($scope.imagenG1File.type != "image/jpeg" && $scope.imagenG1File.type != "image/png"){
        $scope.uploadMessageError = "*La imagen debe ser JPG o PNG."
      }else{
        console.log("objeto",$scope.imagenG1File);
        var oGrupo = {'tipoGrupo': 1, 'idProyecto': $scope.proyecto._id, 'orden': $scope.contGrupos};
        console.log("Grupo",oGrupo);
        $http.post('/grupo', oGrupo).success(function(grupo, status){
          var file = $scope.imagenG1File;
          var idGrupo = grupo._id;
          console.log("El ID Grupo es: ", idGrupo)

          console.log('file is ' );
          console.dir(file);
          var fileName = file.name;
          var principal = 0;
          var uploadUrl = "/grupoFileUpload?idGrupo="+idGrupo+"&fileName="+fileName+"&principal="+principal;
          var fd = new FormData();
          fd.append('file', file);
          $http.put(uploadUrl, fd, {
             //Esto lo que hace es darle el poder a $http de decidir el content type correcto
             transformRequest: angular.identity,
             headers: {'Content-Type': undefined}
           }).success(function(){
             console.log("Por hacer el location path con el id "+$scope.idProyecto);
             $scope.uploadMessage = "Imagen subida con éxito!"
             $scope.stopSpinner();
             $uibModalInstance.close();
          }).error(function(){
            console.log("Error de Upload");
            $scope.uploadMessageError = "No se pudo subir la imágen!"
          });
        });
      }
    }
  };
});

myApp.controller('ModalGrupo2ImagenesController', function ($scope,$http, $uibModalInstance,proyecto,contGrupos) {
  $scope.spinnerActive = 0;
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


  $scope.stopSpinner = function(){
    $scope.spinnerActive = 0;
    jQuery($("#spinner")).spin(false);
  }

  $scope.initSpinner = function(){
    $scope.spinnerActive = 1;
    jQuery($("#spinner")).spin(opts);
  }

  console.log("Dentro del controller del modal",proyecto)

  $scope.uploadMessage = "";
  $scope.uploadMessageError = "";

  $scope.proyecto = proyecto;
  $scope.contGrupos = contGrupos;

  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cancelar = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.grabarGrupo = function(){
    $scope.initSpinner();
    var img1Habilitada = false;
    var img2Habilitada = false;
    if($scope.fGrupo2.imagen1G2File.$untouched){
      $scope.uploadMessageG2F1Error = "*Debe seleccionar una imagen."
    }else{
      if($scope.fGrupo2.imagen1G2File.$modelValue.type != "image/jpeg" && $scope.fGrupo2.imagen1G2File.$modelValue.type != "image/png"){
        $scope.uploadMessageG2F1Error = "*La imagen debe ser JPG o PNG."
      }else{
        img1Habilitada = true;
        $scope.uploadMessageG2F1Error = ""
      }
    }

    if($scope.fGrupo2.imagen2G2File.$untouched){
      $scope.uploadMessageG2F2Error = "*Debe seleccionar una imagen."
    }else{
      if($scope.fGrupo2.imagen2G2File.$modelValue.type != "image/jpeg" && $scope.fGrupo2.imagen2G2File.$modelValue.type != "image/png"){
        $scope.uploadMessageG2F2Error = "*La imagen debe ser JPG o PNG."
      }else{
        img2Habilitada = true;
        $scope.uploadMessageG2F2Error = ""
      }
    }

    if(img1Habilitada && img2Habilitada){
        var oGrupo = {'tipoGrupo': 2, 'idProyecto': $scope.proyecto._id, 'orden': $scope.contGrupos};
        console.log("Grupo",oGrupo);
        $http.post('/grupo', oGrupo).success(function(grupo, status){
          var file = $scope.imagen1G2File;
          var idGrupo = grupo._id;
          console.log("El ID Grupo es: ", idGrupo)
          console.log('file is ' );
          console.dir(file);
          var fileName = file.name;
          var principal = 0;
          var uploadUrl = "/grupoFileUpload?idGrupo="+idGrupo+"&fileName="+fileName+"&principal="+principal;
          var fd = new FormData();
          fd.append('file', file);
          $http.put(uploadUrl, fd, {
             //Esto lo que hace es darle el poder a $http de decidir el content type correcto
             transformRequest: angular.identity,
             headers: {'Content-Type': undefined}
           }).success(function(){

           var file = $scope.imagen2G2File;
           var idGrupo = grupo._id;
           console.log("El ID Grupo es: ", idGrupo)
           console.log('file is ' );
           console.dir(file);
           var fileName = file.name;
           var principal = 0;
           var uploadUrl = "/grupoFileUpload?idGrupo="+idGrupo+"&fileName="+fileName+"&principal="+principal;
           var fd = new FormData();
           fd.append('file', file);
           $http.put(uploadUrl, fd, {
              //Esto lo que hace es darle el poder a $http de decidir el content type correcto
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(){
              //$scope.refresh();
              $scope.uploadMessage = "Imagenes subidas con éxito!"
              $scope.stopSpinner();
              $uibModalInstance.close();
           }).error(function(){
             console.log("Error de Upload");
             $scope.uploadMessageError = "No se pudieron subir las imágenes!"
           });
        }).error(function(){
          console.log("Error de Upload");
          $scope.uploadMessageError = "Imagen subida con éxito!"
        });

      });
    }
  }

});

myApp.controller('ModalGrupo3ImagenesController', function ($scope,$http, $uibModalInstance,proyecto,contGrupos) {
  $scope.spinnerActive = 0;
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


  $scope.stopSpinner = function(){
    $scope.spinnerActive = 0;
    jQuery($("#spinner")).spin(false);
  }

  $scope.initSpinner = function(){
    $scope.spinnerActive = 1;
    jQuery($("#spinner")).spin(opts);
  }

  console.log("Dentro del controller del modal",proyecto)

  $scope.uploadMessage = "";
  $scope.uploadMessageError = "";

  $scope.proyecto = proyecto;
  $scope.contGrupos = contGrupos;

  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cancelar = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.grabarGrupo = function(){
    $scope.initSpinner();
    var img1Habilitada = false;
    var img2Habilitada = false;
    var img3Habilitada = false;
    if($scope.fGrupo3.imagen1G3File.$untouched){
      $scope.uploadMessageG3F1Error = "*Debe seleccionar una imagen."
    }else{
      if($scope.fGrupo3.imagen1G3File.$modelValue.type != "image/jpeg" && $scope.fGrupo3.imagen1G3File.$modelValue.type != "image/png"){
        $scope.uploadMessageG3F1Error = "*La imagen debe ser JPG o PNG."
      }else{
        img1Habilitada = true;
        $scope.uploadMessageG3F1Error = ""
      }
    }

    if($scope.fGrupo3.imagen2G3File.$untouched){
      $scope.uploadMessageG3F2Error = "*Debe seleccionar una imagen."
    }else{
      if($scope.fGrupo3.imagen2G3File.$modelValue.type != "image/jpeg" && $scope.fGrupo3.imagen2G3File.$modelValue.type != "image/png"){
        $scope.uploadMessageG3F2Error = "*La imagen debe ser JPG o PNG."
      }else{
        img2Habilitada = true;
        $scope.uploadMessageG3F2Error = ""
      }
    }

    if($scope.fGrupo3.imagen3G3File.$untouched){
      $scope.uploadMessageG3F3Error = "*Debe seleccionar una imagen."
    }else{
      if($scope.fGrupo3.imagen3G3File.$modelValue.type != "image/jpeg" && $scope.fGrupo3.imagen3G3File.$modelValue.type != "image/png"){
        $scope.uploadMessageG3F3Error = "*La imagen debe ser JPG o PNG."
      }else{
        img3Habilitada = true;
        $scope.uploadMessageG3F3Error = ""
      }
    }

    if(img1Habilitada && img2Habilitada && img3Habilitada){
      var oGrupo = {'tipoGrupo': 3, 'idProyecto': $scope.proyecto._id, 'orden': $scope.contGrupos};
      console.log("Grupo",oGrupo);
      $http.post('/grupo', oGrupo).success(function(grupo, status){
        var file = $scope.imagen1G3File;
        var idGrupo = grupo._id;
        console.log("El ID Grupo es: ", idGrupo)
        console.log('file is ' );
        console.dir(file);
        var fileName = file.name;
        var principal = 1;
        var uploadUrl = "/grupoFileUpload?idGrupo="+idGrupo+"&fileName="+fileName+"&principal="+principal;
        var fd = new FormData();
        fd.append('file', file);
        $http.put(uploadUrl, fd, {
           //Esto lo que hace es darle el poder a $http de decidir el content type correcto
           transformRequest: angular.identity,
           headers: {'Content-Type': undefined}
         }).success(function(){

           var file = $scope.imagen2G3File;
           var idGrupo = grupo._id;
           console.log("El ID Grupo es: ", idGrupo)
           console.log('file is ' );
           console.dir(file);
           var fileName = file.name;
           var principal = 0;
           var uploadUrl = "/grupoFileUpload?idGrupo="+idGrupo+"&fileName="+fileName+"&principal="+principal;

           //fileUpload.uploadFileToUrl(file, uploadUrl,idProyecto);
           var fd = new FormData();
           fd.append('file', file);
           $http.put(uploadUrl, fd, {
              //Esto lo que hace es darle el poder a $http de decidir el content type correcto
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(){
              //$scope.refresh();
              var file = $scope.imagen3G3File;
              var idGrupo = grupo._id;
              console.log("El ID Grupo es: ", idGrupo)
              console.log('file is ' );
              console.dir(file);
              var fileName = file.name;
              var principal = 0;
              var uploadUrl = "/grupoFileUpload?idGrupo="+idGrupo+"&fileName="+fileName+"&principal="+principal;
              var fd = new FormData();
              fd.append('file', file);
              $http.put(uploadUrl, fd, {
                 //Esto lo que hace es darle el poder a $http de decidir el content type correcto
                 transformRequest: angular.identity,
                 headers: {'Content-Type': undefined}
               }).success(function(){
                 $scope.uploadMessage = "Imagenes subidas con éxito!"
                 $scope.stopSpinner();
                 $uibModalInstance.close();
              }).error(function(){
                console.log("Error de Upload");
                $scope.uploadMessageError = "No se pudieron subir las imágenes!"
              });

           }).error(function(){
             console.log("Error de Upload");
             $scope.uploadMessageError = "No se pudieron subir las imágenes!"
           });
        }).error(function(){
          console.log("Error de Upload");
          $scope.uploadMessageError = "Imagen subida con éxito!"
        });

      });
    }
  }

});
