var myFrontend = angular.module('myFrontend', ['ngRoute','ngAnimate','ui.bootstrap']);

myFrontend.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
      .when('/',{
        templateUrl : 'frontend/pages/proyectos.html',
        controller: "FrontController"
      })
      .when('/VerProyecto',{
        templateUrl : 'frontend/pages/verProyecto.html',
        controller: "VerProyectoController"
      })
}]);


myFrontend.animation('.proyectoImage',function(){
  return {
      enter : function(element, done) {
        element.css('opacity',0);
        jQuery(element).animate({
          opacity: 1
        }, done);
        return function(isCancelled) {
          if(isCancelled) {
            jQuery(element).stop();
          }
        }
      },
      move : function(element, done) {
        element.css('opacity', 0);
        jQuery(element).animate({
          opacity: 1
        }, done);

        // optional onDone or onCancel callback
        // function to handle any post-animation
        // cleanup operations
        return function(isCancelled) {
          if(isCancelled) {
            jQuery(element).stop();
          }
        }
      },
      // you can also capture these animation events
      addClass : function(element, className, done) {},
      removeClass : function(element, className, done) {}
    }
});
