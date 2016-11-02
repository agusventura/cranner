myApp.service('fileUpload', ['$http','$location','$routeParams','$rootScope', function ($http,$location,$routeParams,$rootScope) {
 this.uploadFileToUrl = function(file, uploadUrl,iIdProyecto){
   console.log("FileUpload Service");
    console.log("ID Proyecto:",iIdProyecto)
    //console.log("File: ",file)
    //console.log("Route Params:",$routeParams)
    var fd = new FormData();
    fd.append('file', file);

    console.log("FD: ",fd);
   }
}])
