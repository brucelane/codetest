module.exports = function defaultRouter( app ) {
	
	//************
	// Deps ****** 
	//************
	var express = require('express'); 
	
	//************
	// Router App* 
	//************ 
	var defaultRouter = express.Router(); 

	//************
	// Routes ****
	//************  
	defaultRouter.route('/') 
		.get(function( req , res ) { res.json( {message : 'No api here, try \'/api\' instead'} ) }); 

	//************ 
	// Init ****** 
	//************ 
	app.use('/', defaultRouter);  
}; 
