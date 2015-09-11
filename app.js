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
app.use(morgan('dev'));

//************
// Models **** 
//************ 

var citizenBirthModel = require('./models/CitizenBirth.js'); 
var citizenDeadModel = require('./models/CitizenDead.js'); 

//**************
// Controllers **
//***************   

var citizenBirthCtrl = require('./controllers/CitizenBirth.js'); 
var citizenDeadCtrl = require('./controllers/CitizenDead.js'); 

//************
// Routes ****  
//************
var defaultRouter = express.Router(); 
var apiRouter = express.Router(); 

defaultRouter.route('/') 
	.get(function( req , res ) { res.json( {message : 'No api here, try /api instead'} )}); 

apiRouter.route('/') 
	.get(function( req, res ) {res.json( {message : 'Hi! api running on localhost: ' + port + '/'} ) });

app.use('/', defaultRouter);
app.use('/api', apiRouter); 

app.listen(port); 
console.log('app initialized'); 

