//****************
// Dependencies***
//**************** 

var mongoose = require('mongoose'); 
var freeId = mongoose.model('FreeId');

//************************** 
// Business Logic **********
//************************** 

var freeIdsFindAll = function( cb ) {
	freeId.find( function ( err , freeIds ) {
		if (err) cb(err, null); 
		cb(null, freeIds);   
	}); 	
}; 


var freeIdDelete = function(freeId, cb ) {
	freeId.remove({ key : freeId }, function(err , removedDocs) {
		if (err) cb(err, null); 
		cb(null, removedDocs); 
	}); 
}; 

var freeIdGetOne = function(cb) {
	freeId.findOne({}, function(err , returnedFreeId) {
		if (err) cb(err, null); 
		cb(null, returnedFreeId); 
	}); 
}; 

module.exports = { getIds : freeIdsFindAll , delFreeId : freeIdDelete , getFreeId : freeIdGetOne }; 
 
