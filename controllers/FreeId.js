//****************
// Dependencies***
//**************** 

var mongoose = require('mongoose'); 
var freeIdModel = require('../models/FreeId.js'); 
var freeId = mongoose.model('FreeId');

//************************** 
// Business Logic **********
//************************** 

var freeIdsFindAll = function( cb ) {
	freeId.find( function ( err , freeIds ) {
		if (err) return cb(err, null); 
		cb(null, freeIds);   
	}); 	
}; 


var freeIdDelete = function(id, cb ) {
	freeId.remove({ key : id }, function(err , removedDocs) {
		if (err) return cb(err, null); 
		cb(null, removedDocs); 
	}); 
}; 

var freeIdGetOne = function(cb) {
	freeId.findOne({}, function(err , returnedFreeId) {
		if (err || returnedFreeId == null || returnedFreeId === '' || returnedFreeId === []) return cb(err || "No id available", null); 
		cb(null, returnedFreeId); 
	}); 
}; 

module.exports = { getIds : freeIdsFindAll , delFreeId : freeIdDelete , getFreeId : freeIdGetOne }; 
 
