var fse = require('fs-extra');
module.exports = function (db, utils) {
  return {
    crear: function (req, res) {
      console.log("Estoy en el crear Proyecto");
      //debugger;
      console.log(req.body);
      new db.CProyectos(req.body).save(function (err, proyecto) {
        if(err) return utils.error(res, 403, 'Error en la carga de proyecto')
        if(!proyecto) return utils.error(res, 403, 'No se creó el proyecto')
        res.status(201).json(proyecto);
      })
    },

    list: function (req, res) {
      db.CProyectos.find({  }).sort({"orden": 1}).exec(function (err, proyectos) {
        console.log("List. Proyectos:", proyectos);
        res.json(proyectos || [])
      })
    },

    listActivos: function (req, res) {
      db.CProyectos.find({ publicado: true }).sort({"orden": 1}).exec(function (err, proyectos) {
        console.log("List. Proyectos Activos:", proyectos);
        res.json(proyectos || [])
      })
    },

    findById: function(req,res){
      console.log(req.params.nombre);
      console.log("Proyecto.findById ==> ID: "+req.params.id);
      db.CProyectos.findOne({_id: req.params.id  }, function (err, proyecto) {
        console.log("Proyectos x ID:", proyecto);
        res.json(proyecto);
      })
    },

    edit: function(req,res){
      console.log("Proyecto.edit ID ==> "+req.body._id);
      console.log("Proyecto.edit NOM==> "+req.body.nombre);
      console.log("Proyecto.edit DESC==> "+req.body.descripcion);
      db.CProyectos.findOneAndUpdate({ _id: req.body._id }, { $set: { 'nombre': req.body.nombre, 'descripcion': req.body.descripcion, 'publicado': req.body.publicado }}, function(err,proyecto){
        res.json([]);
      });
    },

    uploadPortadaToProyecto: function (req,res){
      var path = req.files.file.path;
      var fileName = req.query.fileName;
      if (path!=''){
        var ext = "";
        if(req.files.file.type == "image/jpeg"){
          ext = ".jpg";
        }else if(req.files.file.type == "image/png"){
          ext = ".png";
        }
        fileName = "Port_"+req.query.idProyecto+ext;
      }
      db.CProyectos.findOneAndUpdate({ _id: req.query.idProyecto }, { $set: { 'foto_portada': fileName}}, function(err,proyecto){
        //res.json([]);
        var idProyecto = proyecto._id;
        var path = req.files.file.path;
        if (path!=''){
          var ext = "";
          if(req.files.file.type == "image/jpeg"){
            ext = ".jpg";
          }else if(req.files.file.type == "image/png"){
            ext = ".png";
          }
          var nomArch = "Port_"+idProyecto+ext;
          fse.copy(path, 'public/uploads/portadas/'+nomArch, function(err){
            console.log("Proyecto ID (fse.copy Portada): ",req.query.idProyecto)
            if (err){
              console.log("Err: ",err);
              return console.error(err);
            }
            console.log("Paso el error.")
            res.status(200).json([]);
          });
        }
      });
    },

    delete: function (req, res) {
      //console.log(req.params)
      db.CProyectos.remove({ _id: req.params.id }, function (err, proyecto) {
        if(err){
          return utils.error(res, 403, 'Error en la eliminacion de proyecto');
        }
        //PROYECTO ME DEVUELVE 1, SUPONGO QUE PORQ SE ELIMINO CORRECTAMENTE
        if(!proyecto){
          return utils.error(res, 403, 'No se creó el proyecto');
        }
        console.log("Proyecto ELIMINADO");


        res.status(200).json(proyecto);
      })
    },

    deleteImage: function(req,res,next){
      console.log("***********************************")
      console.log("PROYECTOS CONTROLLER - DELETE IMAGE")
      console.log("***********************************")
      /*
      db.CProyectos.findOneAndUpdate({ _id: req.query.idProyecto }, { $set: { 'images': {'filename': req.query.fileName} }}, function(err,proyecto){
        console.log("Proy: ",proyecto);
        console.log("Error: ",err);
        //res.status(200).json(proyecto);
        next();
      });
*/
      db.CProyectos.findOne({_id: req.query.idProyecto  }, function (err, proyecto) {

        proyecto.images.pull({_id: req.query.idImagen});
        proyecto.save(function (err, proyecto) {
          if(err){
            console.log("Error: ",err);
            return utils.error(res, 403, 'Error en la carga de proyecto');
          }
          if(!proyecto){
            return utils.error(res, 403, 'No se creó el proyecto');
          }
          console.log("Proyecto grabado. No hay errores");
          res.json(proyecto);
          //next();
        })


      })

    },

    definirPortada: function(req,res){
      console.log("EN PROYECTOS CONTROLLER");
      console.log("PROY: ",req.body.params.idProyecto);
      console.log("IMG: ",req.body.params.idImagen);
      /*db.CProyectos.findOneAndUpdate({ _id: req.body.params.idProyecto,"images._id":req.body.params.idImagen }, { $set: { 'portada': "1" }}, function(err,proyecto){
        console.log("Proy: ",proyecto);
        console.log("Error: ",err);
        //res.status(200).json(proyecto);
        res.json(proyecto);
      })
      */
      db.CProyectos.findOne({_id: req.body.params.idProyecto}, function (err, proyecto) {
          var idImagen = req.body.params.idImagen;
          var cant = proyecto.images.length;
          var images = proyecto.images;
          for(var i=0;i<cant;i++){
            //console.log("Image "+[i]+": ",images[i].filename);
            if(images[i]._id == idImagen){

              /*PRIMERO HACER UN PULL, TRAERME LOS DATOS, Y DPS HACER UN PUSH CON TODO*/
              //PROBAR EL PUSH SIN EL [i]


              //images[i].push({'portada': '1'});
              //console.log("Igual");
              images[i].portada = 1;
              console.log("AHORA:",proyecto);
            }else{
              //images[i].push({'portada': '0'});
              //console.log("No Igual");
              images[i].portada = 0;
            }

            //console.log("Nueva image:",image[i]);
          }

          proyecto.save(function (err, proyecto) {
            if(err){
              console.log("Error: ",err);
              return utils.error(res, 403, 'Error definiendo imagen como portada');
            }
            if(!proyecto){
              return utils.error(res, 403, 'No se encontró el proyecto');
            }
            console.log("Proyecto grabado. No hay errores");
            res.json(proyecto);
          })
      })

      res.json(proyecto)
    },

    incrementarOrden: function(req,res){
      console.log("Proyecto.incrementarOrden ID ==> "+req.body._id);
      console.log("Proyecto.incrementarOrden ORD ==> "+req.body.orden);
      db.CProyectos.findOneAndUpdate({ _id: req.body._id }, { $inc: { orden: +1} }, function(err,proyecto){
        res.json([]);
      });
    },

    disminuirOrden: function(req,res){
      console.log("Proyecto.disminuirOrden ID ==> "+req.body._id);
      console.log("Proyecto.disminuirOrden ORD ==> "+req.body.orden);
      db.CProyectos.findOneAndUpdate({ _id: req.body._id }, { $inc: { orden: -1} }, function(err,proyecto){
        res.json([]);
      });
    },

    findByOrden: function(req,res){
      console.log("BUSCAR ORDEN: ",req.params.orden)
      db.CProyectos.findOne({orden: req.params.orden  }, function (err, proyecto) {
        console.log("Proyecto x Orden:", proyecto);
        res.json(proyecto);
      })
    }

  }
}
