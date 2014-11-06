// Rutas de la aplicación

exports.index = function(req, res){
  // Renderiza la plantilla 'index' cuando en el navegador
  // nos encontremos en la raiz '/' --> http://localhost:puerto/
  res.render('index', {
    // Enviamos como variables un título
    // y objeto 'user' que contiene toda
    // la información del usuario y viaja en el 'request'
    title: 'Ejemplo de Passport JS',
    usuario: req.session.usuario
  });
};

exports.coto = function(req, res){
	res.render('coto', {
		nombre: 'eqeqeqeqeqeeqeqeqe',
		txt:"hola cotein"
		});
}

exports.cuenta= function(req, res){
	res.render('cuenta', {usuario:usuario},{foto:foto})
}

exports.calendario=function(req, res){
	res.render('calendario', {usuario:usuario});
};