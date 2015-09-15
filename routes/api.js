module.exports = function apiRouter( app ) {
	
	//****************
	// Dependecies ***
	//**************** 
	var express = require('express'); 
	var citizenCtrl = require('../controllers/Citizen.js');
	var authCtrl = require('../controllers/Auth.js'); 
	
	//************
	// Router App* 
	//************ 
	var defaultRouter = express.Router(); 

	//************
	// Routes ****
	//************  
	defaultRouter.route('/') 
		.get(function( req , res ) { res.json( {message : 'Welcome to our api!'} ) }); 
	defaultRouter.route('/authenticate')
		.post(function( req , res) {
			var user = req.body.user ||req.params.user || req.query.user; 
			var passwd = req.body.passwd || req.params.passwd || req.query.passwd;
			if (!user || !passwd) 
				res.status(403).json({
					success : false 
					,message : 'No user data provided' 
				}); 
			else 
				authCtrl.tryToSignUser(user, passwd, function(err, token) {
					if (err) return res.status(500).json( err.message ); 
					res.status(200).json(token); 	
				}); 
		 }); 
	 defaultRouter.use(function(req, res, next) {
		var token = req.body.token || req.params.token || req.query.token || req.header('x-access-token'); 
		if (token) {
			authCtrl.validateUserToken(token, function(err, token) {
				if (err) return res.status(500).json( err ); 
				next();  
			});  
		} else {
			res.status(403).json({
				success : false 
				,message : 'No token provided' 
			}); 
		}	
	});  
	defaultRouter.route('/citizens') 
		.get(function( req , res ) {
			citizenCtrl.getCitizens(function( err , citizens ) {
				if (err) return res.status(500).json( err ); 
				res.status(200).json( citizens );
			});    
		}); 
	defaultRouter.route('/citizen') 
		.get(function( req , res ) {
			citizenCtrl.getCitizen(req.body.key , function( err , citizen ) {
				if (err) return res.status(500).json( err ); 
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
				if (err) return res.status(500).json( err );
				res.status(200).json( { result : newCitizen } );  
 
			}); 
		}); 
	defaultRouter.route('/citizen/death')    
		.delete(function ( req , res ) {
			citizenCtrl.delCitizen( req.body.key , function ( err , removedCitizens ) {
				if (err) return res.status(500).json( err ); 
				res.status(200).json( { result : removedCitizens } );  
			}); 
		});

	//************ 
	// Init ****** 
	//************ 
	app.use('/api', defaultRouter); 
}; 
