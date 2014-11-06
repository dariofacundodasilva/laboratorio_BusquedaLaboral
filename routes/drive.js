/**
 * New node file
 */
var passport = require('passport');
var express = require('express');
var app = express();
var googleDrive = require('google-drive')

//exports.drive = function(req, res){
//	res.render('drive.jade')
//}



exports.getDrive=function(req,res){
	var accessToken = req.session.access_token;
	
	
	
		console.log('AntesdentroListFile');
		  googleDrive(accessToken).files().get(function(err, response, body) {
			  if (err) return console.log('err', err)
			  console.log('response', response)
			  console.log('body', JSON.parse(body))
			});
		  console.log('dentroListFile');
		
	
	
}




