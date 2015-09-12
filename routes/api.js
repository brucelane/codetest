module.exports = function apiRouter( app ) {
	
	//************
	// Deps ****** 
	//************
	var express = require('express'); 
	var citizenModel = require('../models/Citizen.js'); 
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
				if (err) res.status( 500 , err ); 
				res.status(200).json( citizens );
			});  
		})
		.post(function( req , res ) {
			citizenCtrl.addCitizen(function( err , key) { 
			})
		})   
		.delete(function ( req , res ) {
			citizenCtrl.delCitizen(function ( err , key ) {
			}); 
		}); 

	//************ 
	// Init ****** 
	//************ 
	app.use('/api', defaultRouter); 
}; 
