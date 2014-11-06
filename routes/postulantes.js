var Postulante;
var Tecnologia;
var moment = require('moment');
exports.setModel = function(modelo){
	Postulante = modelo;
};
exports.setModelT = function(modelo){
	Tecnologia = modelo;
};
exports.subirCV = function(req,res){
	res.render('postulantes/upload.jade', {});
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
                res.render('postulantes/upload.jade',{message: '/images/' + req.files.photo.name,title: 'ejemplo de subida de imagen por HispaBigData'});
            });
         });
     }
};

exports.indexPostulante = function(req, res){
  res.render('./postulantes/index.jade', { title: 'Pagina principal' });
};
exports.verTodos = function(req, res){
	Postulante.find({}, function(error, postulantes){
		if(error){
			res.send('Ha surgido un error.');
		}else{

			res.render('postulantes/index', {
				postulantes: postulantes
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

	Postulante.find(params, function(error, postulantes){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			res.render('postulantes/index', {
				postulantes: postulantes
			});
		}
	})
};
exports.buscarPorT = function(req, res){
	Tecnologia.find({}, function(error, tecnologias){
		if(error){
			res.send('Ha surgido un error2.');
		}else{

			res.render('postulantes/busqueda', {
				tecnologias:tecnologias,
				postulantes:{}
				
			});
		}
	})
};

exports.buscarPorTecnologiaInclusiva2 = function(req, res){
	var params=req.body.tecnologias;
	Tecnologia.find({}, function(error, tecnologiasd){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			console.log(params);
			Postulante.find({tecnologias:{"$in":params}}, function(error, documento){
					if(error){

						res.send('Error al intentar ver el postulante.');
					}else{
						console.log(documento);
						res.render('postulantes/busqueda', {
							tecnob:params,
							postulantes: documento,
							tecnologias:tecnologiasd
						});
					}
				});
			
			
		}
	});
};
exports.create = function(req, res){

	res.render('postulantes/save.jade', {
		put: false,
		action: '/postulantes/',
		postulante: new Postulante({
			nombre: '',
			apellido: '',
			dni:0,
			nacimiento:new Date(),
			tecnologias:{},
			direccion:'',
			email:'',
			remuneracion:0,
			otros:''
			
		})
	});
};
exports.createT = function(req, res){
	Tecnologia.find({}, function(error, tecnologias){
		if(error){
			res.send('Ha surgido un error.');
		}else{

			res.render('postulantes/save.jade', {
				tecnologias: tecnologias,
				put: false,
				action: '/postulantes/',
				postulante: new Postulante({
					nombre: '',
					apellido: '',
					dni:0,
					nacimiento:new Date(),
					tecnologias:{},
					direccion:'',
					email:'',
					remuneracion:0,
					otros:''
				})
			});
		}
	})
};
exports.store = function(req, res){

	var postulante= new Postulante({
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		dni: req.body.dni,
		nacimiento:req.body.nacimiento,
		tecnologias:req.body.tecnologias,
		direccion:req.body.direccion,
		email:req.body.email,
		remuneracion:req.body.remuneracion,
		otros:req.body.otros,
		fechaPostulacion:moment()
	});
	postulante.save(function(error, documento){
		if(error){
			res.send('Error al intentar guardar el postulante.');
			console.log(req.body);
			console.log(req.body.n);
			
			console.log(error);
		}else{	
			res.redirect('/postulantes');
		}
	});
	
};
exports.show = function(req, res){

	
	Postulante.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el postulante2.');
		}else{
			
			
			res.render('postulantes/show', {
				postulante: documento,

				nacimiento:moment(documento.nacimiento).format("DD-MM-YYYY"),
				edad:parseInt((Date.now() - documento.nacimiento) / (31557600000))
			});
		}
	});
};
exports.show2 = function(req, res){

	
	Postulante.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el postulante2.');
		}else{
			
			
			res.render('postulantes/show2', {
				postulante: documento,

				nacimiento:moment(documento.nacimiento).format("DD-MM-YYYY"),
				edad:parseInt((Date.now() - documento.nacimiento) / (31557600000))
			});
		}
	});
};
exports.edit = function(req, res){
	Postulante.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el postulante.');
		}else{
			res.render('postulantes/edit', {
				put: true,
				action: '/postulantes/' + req.params.id,
				tecnologias:documento.tecnologias,
				postulante: documento
			});
		}
	});
};


exports.edit2 = function(req, res){
	Tecnologia.find({}, function(error, tecnologias){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			
			Postulante.findById(req.params.id, function(error, documento){
					if(error){
						res.send('Error al intentar ver el postulante.');
					}else{
						res.render('postulantes/edit', {
							put: true,
							action: '/postulantes/' + req.params.id,
							tecnologias:documento.tecnologias,
							tecnologiasBD:tecnologias,
							postulante: documento
						});
					}
				});
			
			
		}
	});
};
exports.update = function(req, res){
	Postulante.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar modificar el postulante.');
		}else{
			var postulante = documento;
			postulante.nombre = req.body.nombre;
			postulante.apellido = req.body.apellido;
			postulante.dni = req.body.dni;
			postulante.nacimiento = req.body.nacimiento;
			postulante.tecnologias = req.body.tecnologias;

			postulante.direccion = req.body.direccion;
			postulante.email = req.body.email;
			postulante.remuneracion = req.body.remuneracion;
			postulante.otros = req.body.otros;

			postulante.save(function(error, documento){
				if(error){
					res.send('Error al intentar guardar el postulante.');
				}else{	
					res.redirect('/postulantes');
				}
			});
		}
	});
};
exports.destroy = function(req, res){
	Postulante.remove({_id: req.params.id}, function(error){
		if(error){
			res.send('Error al intentar eliminar el postulante.');
		}else{	
			res.redirect('/postulantes');
		}
	});
};
