myFrontend.controller('FrontController',['$scope', '$http', '$location','$anchorScroll','$timeout','anchorSmoothScroll','$window','$uibModal',function($scope, $http, $location, $anchorScroll,$timeout,anchorSmoothScroll,$window,$uibModal) {
  $scope.refresh = function(){
    $scope.scrolleando = 0;
    $http.get('/portadas').success(function(portadas){
      $scope.banners = portadas;
      $scope.myInterval = 3000;
      $scope.noWrapSlides = false;
      $scope.active = portadas[0]._id;
    });
    $http.get('/proyectosActivos').success(function(response){
      $scope.proyectos = response;
    });
  };



  $scope.gotoAbout = function(){
    var id = $location.hash();
    $location.hash('about');
    /*
      anchorSmoothScroll es un servicio que defini en el app.js del frontend para hacer un scroll animado.
      Si no quiero el scroll animado, uso directamente el llamado a $anchorScroll y eso me lleva directamente, sin animacion, al id definido en location
    */
    anchorSmoothScroll.scrollTo('about');
    //$anchorScroll();
    $location.hash(id);
  }

  $scope.gotoProyectos = function(){
     var id = $location.hash();
     $location.hash('sProyectos');
      /*
        anchorSmoothScroll es un servicio que defini en el app.js del frontend para hacer un scroll animado.
        Si no quiero el scroll animado, uso directamente el llamado a $anchorScroll y eso me lleva directamente, sin animacion, al id definido en location
      */
      anchorSmoothScroll.scrollTo('sProyectos');
      //$anchorScroll();
      $location.hash(id);
  }

  $scope.gotoContacto = function(){
    var id = $location.hash();
    $location.hash('contacto');
    /*
      anchorSmoothScroll es un servicio que defini en el app.js del frontend para hacer un scroll animado.
      Si no quiero el scroll animado, uso directamente el llamado a $anchorScroll y eso me lleva directamente, sin animacion, al id definido en location
    */
    anchorSmoothScroll.scrollTo('contacto');
    //$anchorScroll();
    $location.hash(id);
  }

  $scope.openProyect = function(idProyecto){
    console.log("ABRIR MODAL");
    $http.get('/proyecto/'+idProyecto).success(function(detProyecto){
      console.log("Proyecto",detProyecto);
      $scope.detProyecto = detProyecto;
      var modalInstance = $uibModal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: 'detalleProyectoModal',
        controller: 'VerProyectoController',
        size: 'lg',
        resolve: {
          detProyecto: function(){
            return $scope.detProyecto;
          }
        }
      });
    });
  }

  $scope.openLinkedinDiego = function(){
    $window.open('https://ar.linkedin.com/in/diego-vidili-3a96a4a4', '_blank');
  }

  $scope.openLinkedinFran = function(){
    $window.open('https://ar.linkedin.com/in/francisco-chiesa-b3707043', '_blank');
  }

  $scope.efectoIn = function(id){
    jQuery($("#"+id)).css("opacity","0.5");
    jQuery($("#"+id)).animate({
      opacity: 0.5
    },1);

    jQuery($("#span"+id)).animate({
      opacity: 1
    },"slow");
  }

  $scope.efectoOut = function(id){
    jQuery($("#"+id)).animate({
      opacity: 1
    },1);
    jQuery($("#span"+id)).animate({
      opacity: 0
    },1);
  }

  angular.element(document).ready(function () {
    $(".right.carousel-control").remove();
    $(".left.carousel-control").remove();
  });

  this.$onInit = function(){
    console.log("Loaded!");
    $scope.refresh();
  }
}]);
