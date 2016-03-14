var bodyParser = require('body-parser');
var cheerio = require('cheerio'); // scrapes - allows us to use jquery syntax to parse a lot of data
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var request = require('request'); // gives us the ability to make web requests
var logger = require('morgan'); // logs activity in the terminal

var routes = require('./routes/routes.js')

const PORT = process.env.PORT || 8080

var app = express();

//handlebars setup
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
//middleware init
app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));
app.use("/images", express.static("public/images"));
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

routes.routes(app);

//Database configuration
mongoose.connect('mongodb://localhost/scraping-app');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var mongojs = require('mongojs');
var databaseUrl = "scraper";
var collections = ["scrapedData"];
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

//Require Schemas
var Note = require('./models/Note.js');
var User = require('./models/User.js');
var Article = require('./models/Article.js');

//adding a user to use in the example
//"unique:true" in schema will prevent duplicates from restarting server
var exampleUser = new User({
  name: "Ernest Hemingway"
});
exampleUser.save(function(err, doc) {
  if (err) {
    console.log(err);
  } else {
    console.log(doc);
  }
});

app.listen(PORT, function(){
  console.log("Server listening at " + PORT);
});