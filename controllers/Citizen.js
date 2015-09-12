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
		if (err) cb(err, null); 
		cb(null, citizens);   
	}); 	
}; 

var citizenAdd = function(citizenData, cb ) {
	var freeId = freeIdCtrl.getFreeId(function(err, id) {
		if (err) return cb(err, null); 
		var citizenDataModel = new citizenModel({
		 	name : citizenData.name 
			,secret : citizenData.secret
			,sex : citizenData.sex
			,birth : citizenData.birth
			,key : id
		}); 
		// check key before insert 
		citizenDataModel.save( function ( err , key ) {
			if (err) return cb(err, null); 
			freeIdCtrl.delFreeId(id, function(err, removedIds){
				if (err) return cb(err, null); 
				cb(null, key); 
			}); 	
		}); 
	}); 
};

var citizenDelete = function(citizenKey, cb ) {
	citizen.remove({ key : citizenKey }, function(err , removedDocs) {
		if (err) cb(err, null); 
		cb(null, removedDocs); 
	}); 
}; 

module.exports = { getCitizens : citizensFindAll , addCitizen : citizenAdd , delCitizen : citizenDelete }; 
 
