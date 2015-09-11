var mongoose = require('mongoose'); 
var citizenBirth = mongoose.model('CitizenBirth');

var findAllCitizenBirths = function(req, res) {
	citizenBirth.find( function ( err , citizens ) {
		if (err) res.json(500, err);  
		res.status(200).json(citizens); 
	}); 	
}; 

module.exports = { births : findAllCitizenBirths };  
