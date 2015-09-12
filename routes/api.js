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
			var citizenData = new citizenModel({
				 name : req.body.name
				,key : req.body.key
				,secret : req.body.secret
				,sex : req.body.sex
				,birth : req.body.birth 
			}); 
			citizenCtrl.addCitizen( citizenData , function( err , key) { 
				if (err) res.status( 500 , err ); 
				res.status(200).json( key );  
			})
		})   
		.delete(function ( req , res ) {
			citizenCtrl.delCitizen( req.body.key , function ( err , removedCitizens ) {
				if (err) res.status( 500 , err ); 
				res.status(200).json( { result : removedCitizens } );  
			}); 
		}); 

	//************ 
	// Init ****** 
	//************ 
	app.use('/api', defaultRouter); 
}; 
