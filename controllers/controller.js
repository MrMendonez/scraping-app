//Require Schemas
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

var request = require('request'); // gives us the ability to make web requests
var cheerio = require('cheerio'); // scrapes - allows us to use jquery syntax to parse a lot of data
var mongoose = require('mongoose');
var db = mongoose.connection;
var databaseUrl = "scraping-app";
var collections = ["insertedArticle"];

exports.home = function(req, res, next) {
  request('https://news.ycombinator.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    $('.title').each(function(i, element) {
      var title = $(this).children('a').text();
      var link = $(this).children('a').attr('href');
      if (title && link) {
        db.insertedArticle.save({
          title: title,
          link: link
        }, function(err, saved) {
          if (err) {
            console.log(err);
          } else {
            console.log(saved);
          }
        });
      }
      var insertedArticle = new Article({
        title : title,
        link: link
      });
      // Save to Database
      insertedArticle.save(function(err, dbArticle) {
        if (err) {
          console.log(err);
        } else {
          // console.log(dbArticle);
        }
      });
    });
  });
  res.render('index');
};

exports.submit = function(req, res, next) {

  var newNote = new Note(req.body);

  newNote.save(function(err, dbNote) {
    if (err) {
      res.send("Error: " + err);
    } else {
      Article.findOneAndUpdate({
        Name: "Articles From YCombinator"
      }, {$push: {'notes': dbNote._id}}, {new: true}, function(err, dbArticle) {
        if (err) {
          res.send("An error has occured: " + err);
        } else {
          res.json(dbArticle);
        }
      });
    }
  });
};

exports.notes = function(req, res, next) {
  Note.find({}, function(err, doc) {
    if (err) {
      res.send("notes error: " + err);
    } else {
      res.send(doc);
    }
  });
};

exports.displayInfo = function(req, res, next) {
  Article.find({}, function(err, dbArticle) {
    if(err) {
      throw err;
    }
    res.json(dbArticle);
  }).limit(10);
};