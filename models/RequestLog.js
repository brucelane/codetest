var mongoose = require('mongoose'); 

var requestLogSchema = new mongoose.Schema({
	 request: {type: String}
	,params : {type: String} 
	,type: {type: String}
	,ip: {type: String} 
});  

module.exports = mongoose.model( 'RequestLog' , requestLogSchema ); 
