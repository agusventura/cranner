module.exports = function (mongoose, config) {

  var Schema = mongoose.Schema
  	, ObjectId = Schema.ObjectId
    , salt_factor = config.salt || 10

  var ImagenesProyectoSchema = new Schema({
    filename: {type: String, required: true},
    principal: {type: Number, required: false}
  })

  var gruposImagenesSchema = new Schema({
  	idProyecto: { type: String, required: true },
  	tipoGrupo: { type: Number, required: true },
    orden: { type: Number, required: false },
    imagenes: {type: [ImagenesProyectoSchema], required: false}
  }, { versionKey: false });


   return mongoose.model('CGruposImagenes', gruposImagenesSchema)
}
