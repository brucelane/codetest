module.exports = function( app ) {
	
	//*****************
	// Dependencies ***
	//***************** 	
	var logRequestModel = require('../models/RequestLog.js'); 
	var logRequestCtrl = require('../controllers/RequestLog.js');
 	
	//**************** 
	// Middleware **** 
	//**************** 
 	app.all('*', function( req , res , next ) {
		var logRequest = new logRequestModel({
			 request : req.toString()
			,type : req.method
			,ip : req.ip 
		}); 		
		logRequestCtrl.addLog(logRequest, function( err , log ) {
			if (err) console.log(err); 
			console.log(log); 
		}); 
		next();  
	});  

	//****************
	// Routes init ***
	//**************** 
	require('./default.js')( app ); 
	require('./api.js')( app ); 
}; 
