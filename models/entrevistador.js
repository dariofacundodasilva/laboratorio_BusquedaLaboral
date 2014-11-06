/**
 * New node file
 */

var mongoose = require('mongoose');
var EntrevistadorSchema = mongoose.Schema({
	nombre: {type: String, required: true},
	apellido: {type: String, required: true},
	dni: {type: Number, required: true},
	nacimiento: {type: Date, required: true},
	tecnologias: {type: Array, required: true},
	direccion:{type: String, required:true},
	email:{type: String, required:true},
	otros:{type:String}
});

module.exports=EntrevistadorSchema