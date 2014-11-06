var passport = require('passport');
//require('./passport')(passport);
var gcal = require('google-calendar');
//var google_calendar = new gcal.GoogleCalendar(accessToken);
var express = require('express');
var app = express();


exports.calendario = function(req, res){
	res.render('calendario')
}

//Agrega un nuevo evento al Calendario
//El sendNotification esta hardcodeado en GoogleCalendar.js 
//(/node_modules/google-calendar/GoogleCalendar.js)
exports.add= function(req, res){
	if(!req.session.access_token) 
		return res.redirect('/auth');
	
	var accessToken = req.session.access_token;
	var calendarId = 'diego.barrueta@gmail.com';
	
	var evento = {
			"summary": req.body.evento,
			"start": {
				"dateTime": req.body.fecha+"T"+req.body.horaInicio+":00",
				"timeZone": "America/Argentina/Buenos_Aires"
			  },
			  "end": {
			    "dateTime": req.body.fecha+"T"+req.body.horaFin+":00",
			    "timeZone": "America/Argentina/Buenos_Aires"
			  },
			  
			  "attendees": [
//					{
//						"email": "magaliseidem@gmail.com",
//						"displayName": "Magali Seidem",
//						"responseStatus":"needsAction"
//						},        
					{
					"email": "mjcallao@gmail.com",
					"displayName": "Marcelo Callao",
					"responseStatus":"needsAction"
					},
					{
						"email": "dariofacundodasilva@gmail.com",
						"displayName": "Facu",
						"responseStatus":"needsAction"
						},
//					{
//					"email": "francisco.ronconi@gmail.com",
//					"displayName": "Francisco Ronconi",
//					"responseStatus":"needsAction"
//					},
					
					],
					"reminders": {
					"useDefault": true
					},
					"htmlLink": "www.ole.com.ar"
	}
	
	gcal(accessToken).events.insert(calendarId, evento,function(err, data) {
	if(err) return res.send(500,err);
	//return res.redirect("https://www.google.com/calendar/embed?src=diego.barrueta%40gmail.com&ctz=America/Argentina/Buenos_Aires");
	return res.redirect("/calendario")
	});
}