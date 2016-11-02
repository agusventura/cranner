module.exports = function (mongoose, config) {

  var Schema = mongoose.Schema
  	, ObjectId = Schema.ObjectId
    , salt_factor = config.salt || 10

  var proyectoSchema = new Schema({
  	nombre: { type: String, required: true },
  	descripcion: { type: String, required: false },
    publicado: {type: Boolean, required: true},
    foto_portada: {type: String, required: false},
    orden: { type: Number, required: false }
  }, { versionKey: false });


   return mongoose.model('Cproyectos', proyectoSchema)
}
