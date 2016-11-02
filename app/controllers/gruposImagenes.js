var fse = require('fs-extra');
module.exports = function (db, utils) {
  return {
    crear: function (req, res) {
      console.log("Estoy en el crear Grupo");
      //debugger;
      console.log(req.body);
      new db.CGruposImagenes(req.body).save(function (err, grupo) {
        if(err) return utils.error(res, 403, 'Error en la carga del grupo')
        if(!grupo) return utils.error(res, 403, 'No se creó el grupo')
        res.status(201).json(grupo);
      })
    },

    listByProyecto: function (req, res) {
      db.CGruposImagenes.find({ idProyecto: req.params.id }, function (err, grupos) {
        console.log("List. Grupos:", grupos);
        res.json(grupos || [])
      })
    },

    listByProyectoOrderedByOrden: function (req, res) {
      db.CGruposImagenes.find({ idProyecto: req.params.id }).sort({"orden": 1}).exec(function (err, grupos) {
        console.log("List. Grupos:", grupos);
        res.json(grupos || [])
      })
    },

    uploadImageToGrupo: function(req,res,next){
      console.log("uploadImageToGrupo",req.query.idGrupo)
      db.CGruposImagenes.findOne({_id: req.query.idGrupo  }, function (err, grupo) {
        var principal = 0;
        if(req.query.tipoGrupo == 1){
          principal = 1;
        }
        grupo.imagenes.push({'filename': req.query.fileName, 'principal': req.query.principal});
        grupo.save(function (err, grupo) {
          if(err){
            console.log("Error: ",err);
            return utils.error(res, 403, 'Error en la carga de la imagen en el grupo');
          }
          if(!grupo){
            return utils.error(res, 403, 'No se creó la imagen en el grupo');
          }

          var contImgs = grupo.imagenes.length;
          var idImg = grupo.imagenes[contImgs-1]._id;
          console.log("ID IMG:",idImg);
          var path = req.files.file.path;
          if (path!=''){
            var ext = "";
            if(req.files.file.type == "image/jpeg"){
              ext = ".jpg";
            }else if(req.files.file.type == "image/png"){
              ext = ".png";
            }
            var nomArch = "Img_"+idImg+ext;
            grupo.imagenes[contImgs-1].filename = nomArch;
            grupo.save(function (err, grupo) {});
            fse.copy(path, 'public/uploads/'+nomArch/*req.files.file.name*//*+pathFile.extname(path)*/, function(err){
              console.log("Grupo ID (fse.copy): ",req.query.idGrupo)
              if (err){
                console.log("Err: ",err);
                return console.error(err);
              }
              console.log("Paso el error.")
              res.status(200).json([]);
            });
          }
        })
      })

    },

    findById: function(req,res){
      console.log("Grupo Imagenes.findById ==> ID: "+req.params.id);
      db.CGruposImagenes.findOne({_id: req.params.id  }, function (err, grupo) {
        console.log("Grupo x ID:", grupo);
        res.json(grupo);
      })
    },

    incrementarOrden: function(req,res){
      console.log("Grupo.incrementarOrden ID ==> "+req.body._id);
      console.log("Grupo.incrementarOrden ORD ==> "+req.body.orden);
      db.CGruposImagenes.findOneAndUpdate({ _id: req.body._id }, { $inc: { orden: +1} }, function(err,proyecto){
        res.json([]);
      });
    },

    disminuirOrden: function(req,res){
      console.log("Grupo.disminuirOrden ID ==> "+req.body._id);
      console.log("Grupo.disminuirOrden ORD ==> "+req.body.orden);
      db.CGruposImagenes.findOneAndUpdate({ _id: req.body._id }, { $inc: { orden: -1} }, function(err,proyecto){
        res.json([]);
      });
    },

    findByOrden: function(req,res){
      console.log("Grupo.bajarOrden ORD ==> "+req.params.orden);
      db.CGruposImagenes.findOne({orden: req.params.orden  }, function (err, grupo) {
        console.log("Grupo x ID:", grupo);
        res.json(grupo);
      })
    },

    delete: function (req, res) {
      //console.log(req.params)
      db.CGruposImagenes.remove({ _id: req.params.id }, function (err, grupo) {
        if(err){
          return utils.error(res, 403, 'Error en la eliminacion del grupo');
        }
        //PROYECTO ME DEVUELVE 1, SUPONGO QUE PORQ SE ELIMINO CORRECTAMENTE
        if(!grupo){
          return utils.error(res, 403, 'No se eliminó el grupo');
        }
        console.log("Grupo ELIMINADO");


        res.status(200).json(grupo);
      })
    }


  }
}
