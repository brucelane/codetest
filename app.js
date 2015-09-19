var express = require('express'); 
	app = express(), 
	bodyParser = require('body-parser'), 
	methodOverride = require('method-override');  
var mongoose = require('mongoose');
var morgan = require('morgan'); 
var jwt = require('jsonwebtoken'); 
var nodemon = require('nodemon'); 
var config = require('./config/config.js'); 

//******************
// Config ********** 
//******************
var port = process.env.port || 8080; 
mongoose.connect(config.db_connection);
app.use(bodyParser.urlencoded( {extended: false}));
app.use(bodyParser.json()); 
if(config.environment === "dev") app.use(morgan('dev'));

//************
// Routes ****  
//************

require('./routes/index.js')( app ); 

app.listen(port); 
console.log('app initialized'); 

