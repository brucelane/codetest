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
	citizen.find({'isValid' : true}).lean().exec(function(err, docs){
		if(err) return cb(err, null); 
		cb(null, docs); 
	}); 	
}; 

var citizenFindByKey = function ( key ,  cb ) {
	if ( !key || key === "") return cb(new Error("No key defined"), null); 
	 citizen.findOne({'key' : key , 'isValid' : true}).lean().exec(function ( err , firstCitizenFinded ) {
		if (err) return cb(err, null); 
		cb(null, firstCitizenFinded);   
	}); 
}; 

//**************************************************************************
// Action: Add a new birth to db 					****
// Restrictions: 							****
// 	- Citizen key must be one of the existing keys			****
// 	- Until key is not deleted from collection, user is invalid	****
//**************************************************************************
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
			,isValid : false 
		}); 
		// check object before insert 
		citizenDataModel.save( function ( err , citizen ) {
			if (err) return cb(err, null); 
			freeIdCtrl.delFreeIdByKey(id.key, function(err, removedIds){
				if (err) return cb(err, null); 
				citizen.update( {'isValid' : true}, null,  function(err, updatedCitizen){
					if (err) cb(err, null); 
					cb(null, citizen.key); 
				}); 
			});	
		}); 
	}); 
};

var citizenDeleteByKey = function( key , cb ) {
	if ( !key || key === "" ) return cb(new Error("No key defined"), null); 
	citizen.findOne({'key' : key , 'isValid' : true }, function(err, findedCitizen) {
		if (err) return cb(err, null); 
		if (findedCitizen == null) return cb(new Error("Citizen not found"), null); 
		citizen.remove({ 'key' : key }, function(err , removedDocs) {
			if (err) cb(err, null);
			freeIdCtrl.enQueue(key, function(err, queuedId){
				if (err) return cb(err, null); 
				cb(null, removedDocs); 
			}); 
		}); 
	}); 
}; 

var citizenDeleteAll = function( cb ) {
	citizen.remove({}, function(err) {
		if (err) return cb(err, null);  
		cb(null, 1); 
	}); 
}; 

module.exports = { getCitizens : citizensFindAll , getCitizen : citizenFindByKey , addCitizen : citizenAdd , delCitizen : citizenDeleteByKey , deleteAll : citizenDeleteAll }; 
 
