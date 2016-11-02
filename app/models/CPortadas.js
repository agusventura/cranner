module.exports = function (mongoose, config) {

  var Schema = mongoose.Schema
  	, ObjectId = Schema.ObjectId
    , salt_factor = config.salt || 10

  var portadasSchema = new Schema({
  	/*descripcion: { type: String, required: false },*/
    imagen: {type: String, required: false},
  }, { versionKey: false });

   return mongoose.model('Cportadas', portadasSchema)
}
