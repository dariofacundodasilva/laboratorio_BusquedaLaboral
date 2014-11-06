// Archivo principal del Backend, configuración del servidor
// y otras opciones

var express = require('express'); // Express: Framework HTTP para Node.js
var routes = require('./routes'); // Dónde tenemos la configuración de las rutas
var path = require('path');

var mongoose = require('mongoose'); // Mongoose: Libreria para conectar con MongoDB
var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios

// Importamos el modelo usuario y la configuración de passport
require('./models/user');
require('./passport')(passport);

// Conexión a la base de datos de MongoDB que tenemos en local
mongoose.connect('mongodb://localhost:27017/laboratorio', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});

// Iniciamos la aplicación Express
var app = express();


app.configure(function(){
	// Configuración (Puerto de escucha, sistema de plantillas, directorio de vistas,...)
	app.set('port', process.env.PORT || 5000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	
	// Middlewares de Express que nos permiten enrutar y poder
	// realizar peticiones HTTP (GET, POST, PUT, DELETE)
	app.use(express.cookieParser());
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.methodOverride());
	
	// Ruta de los archivos estáticos (HTML estáticos, JS, CSS,...)
	app.use(express.static(path.join(__dirname, 'public')));
	// Indicamos que use sesiones, para almacenar el objeto usuario
	// y que lo recuerde aunque abandonemos la página
	app.use(express.session({ secret: 'coto' }));
	
	// Configuración de Passport. Lo inicializamos
	// y le indicamos que Passport maneje la Sesión
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

// Si estoy en local, le indicamos que maneje los errores
// y nos muestre un log más detallado
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//acá va a la pág. de inicio
app.get('/', function(req, res){
	  res.render('index', {user: req.user });  
});

//muestra el Calendario y el formulario para agregar eventos
app.get('/calendario', routes.calendario);


var cal = require('./routes/calendar.js')
//el post que agrega el evento al calendario
app.post('/add', cal.add);

//probando esto. No funciona
var dri = require('./routes/drive.js');
app.get('/pruebaDrive',dri.getDrive);


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
}

app.get('/auth/google',
		passport.authenticate('google', { 
			scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email',
            accessType: 'offline', approvalPrompt: 'force'
        }),
		function(req, res){
			//esta callback no hace nada
		});

app.get('/auth/google/return', 
		passport.authenticate('google', { failureRedirect: '/login' }),
		  function(req, res) {
			  req.session.access_token = req.user.accessToken;
			  req.session.usuario = req.user;
			  //req.session.access_token=req.user.accessToken;
			  console.log("imprime usuario");
			  console.log(req.user);
			  //global.usuario=req.user.name.displayName;
			  global.usuario=req.user;
			  global.foto=req.user._json['picture']
			  console.log("foto");
			  console.log(req.user._json['picture']);
			  console.log("usuario");
			  console.log(usuario);
			  console.log("termina usuario");
			  console.log(req.user.name.familyName);
			  console.log(req.user.name.givenName);
			  console.log(req.user.emails[0].value);
			  console.log(req.user._json.email);
			  console.log(req.user.emails[0].type);
			  //console.log(req.user.photos[0].value);
			  console.log(req.user.provider);
			  res.redirect('/');
		  });



app.get('/calendar', function(req, res){
	if(!req.session.access_token) return res.redirect('/auth');
	//Create an instance from accessToken
	var accessToken = req.session.access_token;
	var gcal = require('google-calendar');
	gcal(accessToken).calendarList.list(function(err, data) {
		if(err) return res.send(500,err);
		return res.send(data);
		});
	});






//########################################################################//
//##########################FACUNDO#######################################//
//########################################################################//
var postulantes = require('./routes/postulantes');
var PostulanteSchema = require('./models/postulante');
var PostulanteModel = mongoose.model('Postulante', PostulanteSchema);
postulantes.setModel(PostulanteModel);

app.get('/postulantes', postulantes.indexPostulante);
app.get('/postulantes/todos', postulantes.verTodos);
app.post('/postulantes/buscar', postulantes.buscarPorNombreYOApellido);
app.get('/postulantes/create', postulantes.createT);
app.post('/postulantes/store', postulantes.store);
app.get('/postulantes/:id', postulantes.show);
app.get('/postulantes/:id/edit', postulantes.edit2);
app.put('/postulantes/:id', postulantes.update);
app.delete('/postulantes/:id', postulantes.destroy);


// Inicio del servidor
app.listen(app.get('port'), function(){
  console.log('Aplicación Express escuchando en el puerto ' + app.get('port'));
});
