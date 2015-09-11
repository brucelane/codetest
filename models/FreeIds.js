var mongoose = require('mongoose'); 
	Schema = mongooser.Schema; 

var freeIdSchema = new Schema({
	key: {type: String}
}); 

module.exports = mongoose.model( 'FreeId' , freeIdSchema ); 
