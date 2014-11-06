/**
 * New node file
 */
var mongoose = require('mongoose');

var PostulanteSchema = mongoose.Schema({
	nombre				: {type: String, required: true},
	apellido			: {type: String, required: true},
	dni					: {type: Number, required: true},
	nacimiento			: {type: Date, required: true},
	tecnologias			: {type: Array, required: true},
	direccion			: {type: String, required:true},
	email				: {type: String, required:true},
	remuneracion		: {type: Number, required:true},
	fechaPostulacion	: {type: Date, required:true},
	otros				: {type: String}
});



module.exports = PostulanteSchema;