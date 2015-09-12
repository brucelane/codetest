var mongoose = require('mongoose'); 
var citizen = mongoose.model('Citizen');

var findAllCitizens = function(req, res) {
	citizenBirth.find( function ( err , citizens ) {
		if (err) res.json(500, err);  
		res.status(200).json(citizens); 
	}); 	
}; 

module.exports = { getCitizens : findAllCitizens };  
