module.exports = function apiRouter( app ) {
	
	//****************
	// Dependecies ***
	//**************** 
	var express = require('express'); 
 	var freeIdCtrl = require('../controllers/FreeId.js'); 
	
	//************
	// Router App* 
	//************ 
	var defaultRouter = express.Router(); 

	//************
	// Routes ****
	//************  
	defaultRouter.route('/add') 
		.post(function( req , res ) {
			freeIdCtrl.addId( function( err , newId) { 
				if (err) return res.status(500).json( {error : err} );
				res.status(200).json( { result : newId } );  
 
			}); 
		});   
	
	defaultRouter.route('/getids') 
		.get(function( req , res ) {
			freeIdCtrl.getIds( function( err , ids) { 
				if (err) return res.status(500).json( {error : err} );
				res.status(200).json( { result : ids } );  
 
			}); 
		}); 
 
	//************ 
	// Init ****** 
	//************ 
	app.use('/api/id', defaultRouter); 
}; 
