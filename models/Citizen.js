var mongoose = require('mongoose'); 

var citizenSchema = new mongoose.Schema({
	 name: {type: String}
	,key: {type: String}
	,secret: {type: String} 
	,sex: {type: String, enum: [0,1,2]}
	,birth: {type: Date}
	,isValid : {type: Boolean} 
});
 
module.exports = mongoose.model( 'Citizen' , citizenSchema ); 
