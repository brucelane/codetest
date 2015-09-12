//****************
// Dependencies***
//**************** 

var mongoose = require('mongoose'); 
var requestLog = mongoose.model('RequestLog');

//************************** 
// Business Logic **********
//************************** 

var requestsFindAll = function( cb ) {
	requestLog.find( function ( err , requests ) {
		if (err) cb(err, null); 
		cb(null, requests);   
	}); 	
}; 

var requestAdd = function(requestLogData, cb ) {
	requestLogData.save( function ( err , log ) {
		if (err) cb(err, null); 
		cb(null, log); 	
	}); 
};


module.exports = { getLogs : requestsFindAll , addLog : requestAdd }; 

