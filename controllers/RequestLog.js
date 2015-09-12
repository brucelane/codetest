//****************
// Dependencies***
//**************** 

var mongoose = require('mongoose'); 
var requestLogModel = require('../models/RequestLog.js'); 
var requestLog = mongoose.model('RequestLog');

//************************** 
// Business Logic **********
//************************** 

var requestsFindAll = function( cb ) {
	requestLog.find( function ( err , requests ) {
		if (err) return cb(err, null); 
		cb(null, requests);   
	}); 	
}; 

var requestAdd = function(requestLogData, cb ) { 
	var requestLogDataModel = new requestLogModel({
		 request : requestLogData.request
		,type : requestLogData.type
		,ip : requestLogData.ip  
	}); 
	requestLogDataModel.save( function ( err , log ) {
		if (err) return cb(err, null); 
		cb(null, log); 	
	}); 
};


module.exports = { getLogs : requestsFindAll , addLog : requestAdd }; 

