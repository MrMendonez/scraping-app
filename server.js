var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var request = require('request');

var routes = require('./routes/routes.js')

const PORT = precess.env.PORT || 8080

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

routes.routes(app);

app.listen(PORT, function(){
  console.log("Server listening at " + PORT);
});