var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('./models/keySecrets');
var gcal = require('google-calendar');

// Estrategia de autenticación con Twitter

//var GoogleStrategy = require('passport-google').Strategy;
// Fichero de configuración donde se encuentran las API keys
// Este archivo no debe subirse a GitHub ya que contiene datos
// que pueden comprometer la seguridad de la aplicación.
//var config = require('./config');

// se puede borrar
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


//console.log(clientID);

// Exportamos como módulo las funciones de passport, de manera que
// podamos utilizarlas en otras partes de la aplicación.
// De esta manera, mantenemos el código separado en varios archivos
// logrando que sea más manejable.
module.exports = function(passport) {

	// Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// Deserializa el objeto usuario almacenado en la sesión para
	// poder utilizarlo
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});
	
	passport.use(new GoogleStrategy({
		clientID: config.google.clientID,
		clientSecret: config.google.clientSecret,
		callbackURL: 'http://localhost:5000/auth/google/return'
		},
		
		function(accessToken, refreshToken, profile, done) {
			 profile.accessToken = accessToken;
			console.log("ahora busca en la db");
			User.findOne({perfilId: profile.id}, function(err, user) {
	            if(err) throw(err);
	            if(!err && user!= null)return done(null, user);
	            
	            console.log("crea el usuario");
	            var user = new User({
	            	perfilId	: profile.id,
	                name		: profile.displayName,
	                email		: profile.emails[0].value,
	                photo		: profile._json['picture']
	            });
	            
	            console.log("a punto de entrar en save");
	            user.save(function(err) {
	            	console.log("salvo al usuario");
	                if(err) throw err;
	                done(null, user);
	            });
	        });
			
			
				console.log("ClienteID");
				console.log(config.google.clientID);
				console.log("AccesToken");
				console.log(accessToken);
				console.log("RefreshToken");
				console.log(refreshToken);
				return done(null, profile);
				// asynchronous verification, for effect...
				//process.nextTick(function () {
				// To keep the example simple, the user's Google profile is returned to
				// represent the logged-in user. In a typical application, you would want
				// to associate the Google account with a user record in your database,
				// and return that user instead.
				//return done(null, profile);
			//});
		}));
	
//esto funciona
//	passport.use(new GoogleStrategy({
//	    returnURL: 'http://localhost:5000/auth/google/return',
//	    realm: 'http://localhost:5000/'
//	  },
//	  function(identifier, profile, done) {
//	    // asynchronous verification, for effect...
//		  console.log("#####################################");
//		  console.log(identifier);
//		  console.log("#####################################");
//		  
//		  User.findOne({provider_id: profile.id}, function(err, user) {
//			  if(err) throw(err);
//			  // Si existe en la Base de Datos, lo devuelve
//			  if(!err && user!= null) return done(null, user);
//			  // Si no existe crea un nuevo objecto usuario
//			  var user = new User({
//				  name	: profile.displayName,
//				  perfilId	: profile.id,	  
//				  email: profile.emails.value,
//				  photo	: profile.photos[0].value
//			  });
//			  //...y lo almacena en la base de datos
//			  user.save(function(err) {
//			  if(err) throw err;
//			  done(null, user);
//			  });
//			  });


	    process.nextTick(function () {
	      
	      // To keep the example simple, the user's Google profile is returned to
	      // represent the logged-in user.  In a typical application, you would want
	      // to associate the Google account with a user record in your database,
	      // and return that user instead.
//	      profile.identifier = identifier;
//	      return done(null, profile);
	    });
	  }
	
	
	
	
	
	


