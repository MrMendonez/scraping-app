var controller = require('../controllers/controller.js');

module.exports.routes = function(app) {

  var request = require('request'); // gives us the ability to make web requests
  var cheerio = require('cheerio'); // scrapes - allows us to use jquery syntax to parse a lot of data
  var mongoose = require('mongoose');
  var db = mongoose.connection;
  var mongojs = require('mongojs');
  var databaseUrl = "scraper";
  var collections = ["insertedArticle"];
  var db = mongojs(databaseUrl, collections);
  db.on('error', function(err) {
    console.log('Database Error:', err);
  });

  var Note = require('../models/Note.js');
  var Article = require('../models/Article.js');

  app.get('/', controller.home);

  //New Note Creation
  app.post("/submit", controller.submit);

  //Route to see notes we have added
  app.get('/notes', controller.notes);

  // Display scraped data
  app.get('/displayInfo', controller.displayInfo);
  
  // app.post('/addNote/:id' , function(req, res) {
       
  // });
  
  // app.get('/delete/:id', function(req, res) {
      
  // });
    
};