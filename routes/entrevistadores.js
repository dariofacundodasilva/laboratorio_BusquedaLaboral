var Entrevistador;
var Tecnologia;
var moment = require('moment');
exports.setModel = function(modelo){
	Entrevistador = modelo;
};
exports.setModelT = function(modelo){
	Tecnologia = modelo;
};
exports.subirCV = function(req,res){
	res.render('entrevistadores/upload.jade', {});
};
var fs = require('fs');
 
exports.Uploads = function(req, res) {
    //console.log(req.files);
    var tmp_path = req.files.photo.path;
    // Ruta donde colocaremos las imagenes
    
    var target_path = './public/images/' + req.files.photo.name;
   // Comprobamos que el fichero es de tipo imagen
    if (req.files.photo.type.indexOf('image')==-1){
                res.send('El fichero que deseas subir no es una imagen');
    } else {
         // Movemos el fichero temporal tmp_path al directorio que hemos elegido en target_path
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // Eliminamos el fichero temporal
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                res.render('entrevistadores/upload.jade',{message: '/images/' + req.files.photo.name,title: 'ejemplo de subida de imagen por HispaBigData'});
            });
         });
     }
};

exports.index = function(req, res){
  res.render('index', { title: 'Pagina principal' });
};
exports.verTodos = function(req, res){
	Entrevistador.find({}, function(error, entrevistadores){
		if(error){
			res.send('Ha surgido un error.');
		}else{

			res.render('entrevistadores/index', {
				entrevistadores: entrevistadores
			});
		}
	})
};
exports.buscarPorNombreYOApellido = function(req, res){
	var nombre;
	var apellido;
	var params={};
	if(req.body.nombre){
		nombre=req.body.nombre;
		params.nombre=nombre;
		
	}
	if(req.body.apellido){
		apellido=req.body.apellido;
		params.apellido=apellido;

	}

	Entrevistador.find(params, function(error, entrevistadores){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			res.render('entrevistadores/index', {
				entrevistadores: entrevistadores
			});
		}
	})
};
exports.create = function(req, res){

	res.render('entrevistadores/save.jade', {
		put: false,
		action: '/entrevistadores/',
		entrevistador: new Entrevistador({
			nombre: '',
			apellido: '',
			dni:0,
			nacimiento:new Date(),
			tecnologias:{},
			direccion:'',
			email:'',
			otros:''
			
		})
	});
};
exports.createT = function(req, res){
	Tecnologia.find({}, function(error, tecnologias){
		if(error){
			res.send('Ha surgido un error.');
		}else{

			res.render('entrevistadores/save.jade', {
				tecnologias: tecnologias,
				put: false,
				action: '/entrevistadores/',
				entrevistador: new Entrevistador({
					nombre: '',
					apellido: '',
					dni:0,
					nacimiento:new Date(),
					tecnologias:{},
					direccion:'',
					email:'',
					otros:''
				})
			});
		}
	})
};
exports.store = function(req, res){

	var entrevistador= new Entrevistador({
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		dni: req.body.dni,
		nacimiento:req.body.nacimiento,
		tecnologias:req.body.tecnologias,
		direccion:req.body.direccion,
		email:req.body.email,
		otros:req.body.otros
	});
	entrevistador.save(function(error, documento){
		if(error){
			res.send('Error al intentar guardar el entrevistador.');
			console.log(req.body);
			console.log(req.body.n);
			
			console.log(error);
		}else{	
			res.redirect('/entrevistadores');
		}
	});
	
};
exports.show = function(req, res){

	
	Entrevistador.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el entrevistador.');
		}else{
			
			
			res.render('entrevistadores/show', {
				entrevistador: documento,

				nacimiento:moment(documento.nacimiento).format("DD-MM-YYYY"),
				edad:parseInt((Date.now() - documento.nacimiento) / (31557600000))
			});
		}
	});
};
exports.edit = function(req, res){
	Entrevistador.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el entrevistador.');
		}else{
			res.render('entrevistadores/edit', {
				put: true,
				action: '/entrevistadores/' + req.params.id,
				tecnologias:documento.tecnologias,
				entrevistador: documento
			});
		}
	});
};


exports.edit2 = function(req, res){
	Tecnologia.find({}, function(error, tecnologias){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			
			Entrevistador.findById(req.params.id, function(error, documento){
					if(error){
						res.send('Error al intentar ver el entrevistador.');
					}else{
						res.render('entrevistadores/edit', {
							put: true,
							action: '/entrevistadores/' + req.params.id,
							tecnologias:documento.tecnologias,
							tecnologiasBD:tecnologias,
							entrevistador: documento
						});
					}
				});
			
			
		}
	});
};
exports.update = function(req, res){
	Entrevistador.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar modificar el entrevistador.');
		}else{
			var entrevistador = documento;
			entrevistador.nombre = req.body.nombre;
			entrevistador.apellido = req.body.apellido;
			entrevistador.dni = req.body.dni;
			entrevistador.nacimiento = req.body.nacimiento;
			entrevistador.tecnologias = req.body.tecnologias;

			entrevistador.direccion = req.body.direccion;
			entrevistador.email = req.body.email;
			entrevistador.otros = req.body.otros;

			entrevistador.save(function(error, documento){
				if(error){
					res.send('Error al intentar guardar el entrevistador.');
				}else{	
					res.redirect('/entrevistadores');
				}
			});
		}
	});
};
exports.destroy = function(req, res){
	Entrevistador.remove({_id: req.params.id}, function(error){
		if(error){
			res.send('Error al intentar eliminar el entrevistador.');
		}else{	
			res.redirect('/entrevistadores');
		}
	});
};
