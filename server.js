var bodyParser = require('body-parser');
var cheerio = require('cheerio'); // scrapes - allows us to use jquery syntax to parse a lot of data
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var request = require('request'); // gives us the ability to make web requests
var logger = require('morgan'); // logs activity in the terminal

//Database configuration
mongoose.connect('mongodb://localhost/scraping-app');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var routes = require('./routes/routes.js')

const PORT = process.env.PORT || 8080

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

routes.routes(app);

app.listen(PORT, function(){
  console.log("Server listening at " + PORT);
});