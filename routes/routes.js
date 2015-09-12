module.exports = function( app ) {
	
	//*****************
	// Dependencies ***
	//***************** 	
	var logRequestCtrl = require('../controllers/RequestLog.js');
 	
	//**************** 
	// Middleware **** 
	//**************** 
 	app.all('*', function( req , res , next ) {
		var logRequest = new Object({
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
	require('./freeid.js')( app );
}; 
