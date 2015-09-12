module.exports = function apiRouter( app ) {
	
	//****************
	// Dependecies ***
	//**************** 
	var express = require('express'); 
	var citizenCtrl = require('../controllers/Citizen.js');
	
	//************
	// Router App* 
	//************ 
	var defaultRouter = express.Router(); 

	//************
	// Routes ****
	//************  
	defaultRouter.route('/') 
		.get(function( req , res ) { res.json( {message : 'Welcome to our api!'} ) }); 

	defaultRouter.route('/citizens') 
		.get(function( req , res ) {
			citizenCtrl.getCitizens(function( err , citizens ) {
				if (err) return res.status(500).json( {error : err} ); 
				res.status(200).json( citizens );
			});    
		}); 
	defaultRouter.route('/citizen') 
		.get(function( req , res ) {
			citizenCtrl.getCitizen(req.param.key , function( err , citizen ) {
				if (err) return res.status(500).json( {error : err} ); 
				res.status(200).json( citizen );
			});    
		}); 
	defaultRouter.route('/citizen/birth')  
		.post(function( req , res ) {
			var citizenData = new Object({
				 name : req.body.name
				,secret : req.body.secret
				,sex : req.body.sex
				,birth : req.body.birth 
			}); 
			citizenCtrl.addCitizen( citizenData , function( err , newCitizen) { 
				if (err) return res.status(500).json( {error : err} );
				res.status(200).json( { result : newCitizen } );  
 
			}); 
		}); 
	defaultRouter.route('/citizen/death')    
		.delete(function ( req , res ) {
			citizenCtrl.delCitizen( req.body.key , function ( err , removedCitizens ) {
				if (err) return res.status(500).json( {error : err} ); 
				res.status(200).json( { result : removedCitizens } );  
			}); 
		});

	//************ 
	// Init ****** 
	//************ 
	app.use('/api', defaultRouter); 
}; 
