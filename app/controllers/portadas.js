var fse = require('fs-extra');
module.exports = function (db, utils) {
  return {
    crear: function (req, res) {
      console.log("Estoy en el crear Portada");
      //debugger;
      console.log(req.body);
      //new db.CPortadas(req.body).save(function (err, portada) {
      new db.CPortadas().save(function (err, portada) {
        if(err) return utils.error(res, 403, 'Error en la carga de portada')
        if(!portada) return utils.error(res, 403, 'No se creó la portada')
        res.status(201).json(portada);
      })
    },

    list: function (req, res) {
      db.CPortadas.find({  }, function (err, portadas) {
        console.log("List. Portadas:", portadas);
        res.json(portadas || [])
      })
    },

    delete: function (req, res) {
      //console.log(req.params)
      db.CPortadas.remove({ _id: req.params.id }, function (err, portada) {
        if(err){
          return utils.error(res, 403, 'Error en la eliminacion de portada');
        }
        //PORTADA ME DEVUELVE 1, SUPONGO QUE PORQ SE ELIMINO CORRECTAMENTE
        if(!portada){
          return utils.error(res, 403, 'No se eliminó la portada');
        }
        console.log("Portada ELIMINADA");
        res.status(200).json(portada);
      })
    },

    uploadBanner: function (req,res){
      db.CPortadas.findOneAndUpdate({ _id: req.query.idPortada }, { $set: { 'imagen': req.query.fileName}}, function(err,proyecto){
        //res.json([]);
        var path = req.files.file.path;
        if (path!=''){
          fse.copy(path, 'public/uploads/banners/'+req.files.file.name, function(err){
            console.log("Portada ID (fse.copy Banner): ",req.query.idPortada)
            if (err){
              console.log("Err: ",err);
              return console.error(err);
            }
            console.log("Paso el error.")
            res.status(200).json([]);
          });
        }
      });
    }

  }
}
