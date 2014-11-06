/**
 * New node file
 */

exports.getSesion = function(req, res){
	req.session.nombre=usuario.displayName;
	res.send(req.session.nombre);
	res.send("wwwwwwwwwww");
}