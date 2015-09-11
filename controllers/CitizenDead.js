var mongoose = require('mongoose'); 
var citizenDeadModel = mongoose.model('CitizenDead');

var findAllCitizenDeads = function(req, res) {
	citizenDead.find( function ( err , citizens ) {
		if (err) res.json(500, err);  
		res.status(200).json(citizens); 
	}); 	
}; 

module.exports = { deads : findAllCitizenDeads };  
