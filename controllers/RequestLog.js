var mongoose = require('mongoose'); 
	Schema = mongoose.Schema; 

var requestLogSchema = new Schema({
	 request: {type: String}
	,type: {type: String}
	,ip: {type: String} 
});  

module.exports = mongoose.model( 'RequestLog' , requestLogSchema ); 
