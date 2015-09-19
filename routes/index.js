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
			 request : req.url 
			,params : req.body  
			,type : req.method
			,ip : req.ip 
		}); 		
		logRequestCtrl.addLog(logRequest, function( err , log ) {
			if (err) throw(err); 
			// console.dir(logRequest); 
		}); 
		next();  
	});  

	//****************
	// Routes init ***
	//**************** 
	require('./Default.js')( app ); 
	require('./Api.js')( app );
	require('./FreeId.js')( app );
}; 
