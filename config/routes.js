var multipart = require('connect-multiparty');
var fse = require('fs-extra');
var pathFile = require('path');
module.exports = function (app, http, db) {


var utils = require('../app/lib/utils')(db)

  function route(name, other) {
    return require('../app/controllers/'+name)(db, utils, other)
  }

  var proyecto = route('proyectos')
  var portada = route('portadas')
  var gruposImagenes = route('gruposImagenes')
  var auth = route('auth');

  app.get('/backend',function(req,res){
    res.render("backend");
  })

  app.get('/',function(req,res){
    res.render("index");
  })

  /*ROUTES DEL MODELO PROYECTO*/
  app.get('/proyectos', proyecto.list);
  app.get('/proyectosActivos', proyecto.listActivos);
  app.post('/proyectos', proyecto.crear);
  app.delete('/proyectos/:id',proyecto.delete);
  app.get('/proyecto/:id',proyecto.findById);
  app.put('/proyecto',proyecto.edit);
  app.delete('/eliminarImagen',proyecto.deleteImage);
  app.get('/proyectoByOrden/:orden',proyecto.findByOrden);
  app.put('/proyectoIncrementarOrden',proyecto.incrementarOrden);
  app.put('/proyectoDisminuirOrden',proyecto.disminuirOrden);
  /** Permissible loading a single file,
      the value of the attribute "name" in the form of "recfile". **/
  //var type = upload.single('recfile');

  /*app.post('/fileUpload',function(req,res){
    console.log("En Routes.js. Post de fileUpload");

  });
*/


  app.put('/portadaUpload',multipart(),proyecto.uploadPortadaToProyecto,function(req, resp) {
    console.log("Entro al post de routes.js")
    // don't forget to delete all req.files when done
  })

  app.put('/definirPortada',proyecto.definirPortada);


  /*ROUTES DEL MODELO PORTADA*/
  app.get('/portadas', portada.list);
  app.post('/portada', portada.crear);
  app.delete('/portada/:id',portada.delete);
  app.put('/bannerUpload',multipart(),portada.uploadBanner,function(req, resp) {
    console.log("Entro al post de routes.js")
    // don't forget to delete all req.files when done
  })

  /*ROUTES DEL MODELO DE GRUPOS IMAGENES*/
  app.post('/grupo',gruposImagenes.crear);
  app.put('/grupoFileUpload',multipart(),gruposImagenes.uploadImageToGrupo,function(req, resp) {
    console.log("Entro al post de routes.js")
    // don't forget to delete all req.files when done
  })
  app.get('/gruposImagenes/:id', gruposImagenes.listByProyectoOrderedByOrden);
  app.delete('/grupoImagenes/:id',gruposImagenes.delete);
  app.get('/grupoImagenesByOrden/:orden',gruposImagenes.findByOrden);
  app.put('/grupoImagenesIncrementarOrden',gruposImagenes.incrementarOrden);
  app.put('/grupoImagenesDisminuirOrden',gruposImagenes.disminuirOrden);

  app.post('/backend/authenticate',auth.authOK);

  // catch-all
  app.get('*', function (req, res) { res.status(404).json({ error:'Invalid GET request' }) })
  app.post('*', function (req, res) { res.status(404).json({ error:'Invalid POST request' }) })
  app.delete('*', function (req, res) { res.status(404).json({ error:'Invalid DELETE request' }) })
}


/*
Preguntas:
1) Por que si tengo otra collecion en la DB, y aca le cambio el nombre en el find, create, etc, no me lo toma?
ESTO SE CAMBIA EL NOMBRE EN EL MODELO DE LA COLECCION --> LO HICE Y NO FUNCIONO. NO SE PARA QUE ES EL RETURN DEL MODELO...
ESTO PASABA PORQUE LE DA BOLA AL NOMBRE DEL ARCHIVO. LO RENOMBRE COMO CProyectos y anduvo perffecto.

2) Entender bien porque si pongo localhost sin /proyectos, me toma bien el get y post de /proyectos como esta escrito en el controller.
ROUTES.JS Y EL CONTROLER DE ANGULAR ESTAN ESCUCHANDO TODO EL TIEMPO. CUANDO APRIETO EN AGREGAR PROYECTO, COMO YO LLAMO AL POST DE /PROYECTOS,  PRIMERO VA A CONSULTAR A ROUTES
Y COMO EN ROUTES ESTA DEFINIDO QUE DEVUELVE UN JSON (PORQUE LLAMA AL MIDDLEWARE DE CREAR), LE PASA LA SOLICITUD AL CONTROLER. EL CONTROLER RECIBE COMO PARAMETRO EL JSON DEVUELTO DEL MIDDLEWARE
Y LO SETEA EN $SCOPE.PROYECTOS PARA ACTUALIZAR EL LISTADO DE PROYECTOS EN EL HTML

DESPUES DE ESTO, COMO HACE PARA VOLVER A LLAMAR AL /GET??
COMO ANGULAR ES BIDIRECCIONAL, LO QUE CAMBIE DEL LADO DEL BACK VA A CAMBIAR EL FRONT, COMO CAMBIO LA LISTA PROYECTOS DE UN LADO, EL LISTADO AUTOMATICAMENTE REFRESCA EL LISTADO

3) Ver bien las dependencias. Borrar lo que posta no necesite.
4) Para que son los app.get post y delete con '*' (los que estan aca arriba). Si pongo cualquier cpsa y no la tengo definida en el routes, sale por este lado?
SI
5) Como edito y elimino de mongo

6) Que son Gruntgile.js y bower.js
GRUNTFILE SE USA PARA LA COMPRESION DE LOS JS PARA QUE SEAN MAS LIVIANOS Y SEGUROS. ES UN ARCHIVO QUE SE EJECUTA AL DESPLEGAR LA APLICACION Y LO QUE EJECUTA ES UNA FUNCION. EN ESA FUNCION VOS PODES
LLAMAR A LOS JS QUE QUIERAS PARA "MINIMIZARLOS" Y CREA EL NUEVO ARCHIVO xxx.MIN.JS (COMO QL JQUERY.MIN.JS).

BOWER ES UNA ESPECIE DE LINEA DE COMANDOS QUE SE USA PARA PODER DESCARGAR RAPIDA Y FACIL ALGUN PLUGIN QUE TE INTERESE. POR EJEMPLO TE BAJAS DESDE BOWER BOOTSTRAP Y ESO TE INSTALA LOS JS Y TODOS EL RESTO
DE LOS ARCHIVOS EN TU PROYECTO.

NINGUNA DE LAS DOS ES INDISPENSABLE.

NOTAS:

 - PARA ENTENDER BIEN COMO ESCRIBIR LOS REQUESTS EN EL ROUTES.JS Y SABER QUE RECIBEM, COMO SE ESXRIBEN, Y QUE DEVUELVEN, HAY QUE LEER SOBRE "REST"
*/
