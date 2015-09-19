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

var citizenFindOneByParams = function ( params ,  cb ) {
	if ( !params || params === "") return cb(new Error("No key defined"), null); 
	 citizen.findOne(params).lean().exec(function ( err , firstCitizenFinded ) {
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
var citizenAdd = function( name, secret, sex, birth , cb ) { 
	if (["0","1","2"].indexOf(sex)===-1) return cb(new Error("Invalid sex, valid data [0,1,2]"), null); 
	if (!isValidDate(birth)) return cb(new Error("Invalid date, format: MM-DD-YYYY"), null); 
	var freeId = freeIdCtrl.deQueue(function(err, id) {
		if (err) return cb(err, null);
		var citizenDataModel = new citizen({
		 	name : name 
			,secret : secret
			,sex : sex
			,birth : birth
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
	citizen.findOne({'key' : key , 'isValid' : true}).lean().exec(function ( err , findedCitizen ) {
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

var isValidDate = function (d) {
	var datePattern = /((0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])-(19[0-9][0-9]|2[0-9][0-9][0-9]))/g;
	if (Object.prototype.toString.call(d) !== '[object Date]') return false;
	var dStr = ((d.getMonth()+1)<10?'0'+(d.getMonth()+1):(d.getMonth()+1)) + '-' + (d.getDate()<10?'0'+d.getDate():d.getDate()) + '-' + d.getFullYear(); 
	return datePattern.test(dStr);  
}

module.exports = { 
	getCitizens : citizensFindAll 
	,getCitizen : citizenFindByKey 
	,getCitizenBy : citizenFindOneByParams 
	,addCitizen : citizenAdd 
	,delCitizen : citizenDeleteByKey 
	,deleteAll : citizenDeleteAll 
	,checkDate : isValidDate
}; 
 
