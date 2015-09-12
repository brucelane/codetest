module.exports = function( app ) {
	require('./default.js')( app ); 
	require('./api.js')( app ); 
}; 
