//****************
// Dependencies***
//**************** 

var mongoose = require('mongoose'); 
var citizenModel = require('../models/Citizen.js'); 
var citizen = mongoose.model('Citizen');
var freeIdCtrl = require('../controllers/FreeId.js'); 

//************************** 
// Business Logic **********
//************************** 

var citizensFindAll = function( cb ) {
	citizen.find( function ( err , citizens ) {
		if (err) return cb(err, null); 
		cb(null, citizens);   
	}); 	
}; 

var citizenFindByKey = function ( key ,  cb ) {
	if ( !key || key === "") return cb("No key defined", null); 
	citizen.find( { 'key' : key } ,  function ( err , citizens ) {
		if (err) return cb(err, null); 
		cb(null, citizens);   
	}); 
}; 

var citizenAdd = function( citizenData , cb ) { 
	if ( !citizenData || citizenData === {} ) return cb("No data defined"); 
	var freeId = freeIdCtrl.deQueue(function(err, id) {
		if (err) return cb(err, null); 
		var citizenDataModel = new citizenModel({
		 	name : citizenData.name 
			,secret : citizenData.secret
			,sex : citizenData.sex
			,birth : citizenData.birth
			,key : id.key
		}); 
		// check object before insert 
		citizenDataModel.save( function ( err , citizen ) {
			if (err) return cb(err, null); 
			freeIdCtrl.delFreeIdByKey(id.key, function(err, removedIds){
				if (err) return cb(err, null); 
				cb(null, citizen); 
			}); 	
		}); 
	}); 
};

var citizenDeleteByKey = function( key , cb ) {
	if ( !key || key === "" ) return cb("No key defined"); 
	citizen.find({ 'key' : key }, function(err, findedCitizen) {
		if (err) return cb(err, null); 
		console.dir(findedCitizen); 
		if (findedCitizen.length === 0) return cb("Citizen not found", null); 
		citizen.remove({ 'key' : key }, function(err , removedDocs) {
			if (err) cb(err, null);
			freeIdCtrl.enQueue(key, function(err, queuedId){
				if (err) return cb(err, null); 
				cb(null, removedDocs); 
			}); 
		}); 
	}); 
}; 

module.exports = { getCitizens : citizensFindAll , getCitizen : citizenFindByKey , addCitizen : citizenAdd , delCitizen : citizenDeleteByKey }; 
 
