var myApp = angular.module('myApp', ['ngRoute','ngAnimate','ui.bootstrap','ngCookies']);

myApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/Login',{
          templateUrl : 'pages/login.html',
          controller  : "LoginController",
          hideMenus: true
        })
        .when('/',{
          templateUrl : 'pages/home.html',
          controller  : "MainController"
        })
        .when('/Listado',{
          templateUrl : 'pages/listProyecto.html',
          controller  : "MainController"
        })
        .when('/Alta',{
          templateUrl : 'pages/altaProyecto.html',
          controller  : "AltaController"
        })
        .when('/Editar/',{
          templateUrl : 'pages/editarProyecto.html',
          controller  : "EditController"
        })
        .when('/AltaPortada/',{
          templateUrl : 'pages/altaPortada.html',
          controller  : "AltaPortadaController"
        })
        .when('/ListadoPortadas/',{
          templateUrl : 'pages/listPortadas.html',
          controller  : "ListadoPortadasController"
        })

        .otherwise({ redirectTo: '/Login' });
}])

myApp.run(['$rootScope', '$location', '$cookieStore', '$http',function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/Login' && !$rootScope.globals.currentUser) {
            $location.path('/Login');
        }
    });
}]);

myApp.directive('fileModel', ['$parse', function ($parse) {
  return {
     restrict: 'A',
     link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
           scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
           });
        });
     }
  };
}])
