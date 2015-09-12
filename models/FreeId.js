var mongoose = require('mongoose'); 

var freeIdSchema = new mongoose.Schema({
	key: {type: String}
}); 

module.exports = mongoose.model( 'FreeId' , freeIdSchema ); 
