module.exports = function apiRouter( app ) {
	
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
		.get(function( req , res ) { res.json( {message : 'Welcome to our api!'} ) }); 

	//************ 
	// Init ****** 
	//************ 
	app.use('/api', defaultRouter); 
}; 
