var mongoose = require('mongoose'); 
	Schema = mongoose.Schema; 

var citizenDeadSchema = new Schema({
	 name: {type: String}
	,key: {type: String}
	,secret: {type: String}
	,sex: {type: String}
	,birth: {type: Date}
	,defunction: {type: Date}
	 
}); 

module.exports = mongoose.model( 'CitizenDead' , citizenDeadSchema ); 
 
