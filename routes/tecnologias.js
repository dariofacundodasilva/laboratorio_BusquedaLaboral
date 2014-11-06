var Tecnologia;
exports.setModel = function(modelo){
	Tecnologia = modelo;
};
exports.verTodas = function(req, res){
	Tecnologia.find({}, function(error, tecnologias){
		if(error){
			res.send('Ha surgido un error.');
		}else{

			res.render('tecnologias/index', {
				tecnologias: tecnologias
			});
		}
	})
};

exports.store = function(req, res){

	var tecnologia= new Tecnologia({
		nombre: req.body.nombre
		
	});
	tecnologia.save(function(error, documento){
		if(error){
			res.send('Error al intentar guardar la tecnologia.');
		}else{	
			res.redirect('/tecnologias');
		}
	});
	
};
exports.edit = function(req, res){

	Tecnologia.find({}, function(error, documento){
		if(error){
			res.send('Error al intentar ver la tecnologia.');
		}else{
			res.render('tecnologias/indexEdit', {
				put: true,
				action: '/tecnologias/' + req.params.id,
				tecnologias:documento,
				tecnologiaEdit: req.params.id
			});
		}
	});
};
exports.destroy = function(req, res){
	Tecnologia.remove({_id: req.params.id}, function(error){
		if(error){
			res.send('Error al intentar eliminar el entrevistador.');
		}else{	
			res.redirect('/tecnologias');
		}
	});
};
exports.update = function(req, res){
	Tecnologia.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar modificar el entrevistador.');
		}else{
			var tecnologia = documento;
			tecnologia.nombre = req.body.nombre;
			

			tecnologia.save(function(error, documento){
				if(error){
					res.send('Error al intentar guardar la tecnologia.');
				}else{	
					res.redirect('/tecnologias');
				}
			});
		}
	});
};