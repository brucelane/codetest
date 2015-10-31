//******************
// Dependencies ****
//****************** 

var jsonwtk = require('jsonwebtoken'); 
var config = require('../config/config.js'); 
var citizenCtrl = require('./Citizen.js'); 

//********************
// Business Logic ****
//******************** 

var authenticateUser = function(user , passwd , cb) {
	citizenCtrl.getCitizenBy({ name  : user, secret : passwd}, function(err, citizen) {
		if(err) return cb(err, null);
		if(citizen == null) return cb(new Error('User not found'), null); 
		var token = jsonwtk.sign(citizen, config.authkey, {expiresInMinutes : 1440}); 
		cb(null, {result : 'success' , 'token' : token}); 	
	}); 
}; 

var validateToken = function (token, cb) {
	jsonwtk.verify(token, config.authkey, function(err, decodedToken) {
		if (err) return cb(err, null);
		cb(null, (decodedToken === config.authkey)); 
	}); 
}; 

module.exports = { tryToSignUser : authenticateUser , validateUserToken : validateToken }; 
