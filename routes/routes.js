
// var renders = require('/controller/controller.js');

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

  app.get('/', function(req, res) {

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
  });

  //New Note Creation
  app.post("/submit", function(req, res){
    var newNote = new Note({
      noteBody: req.body.noteBody});
    newNote.save(function(err, doc) {
      if (err) {
        res.send(err);
      } else {
        Article.findOneAndUpdate({
          "_id": req.body.articleid},
          {$push: {'notes': doc._id}}, {new: true}, function(err, articleData) {
          if (err) {
            res.send(err);
          } else {
              res.json(articleData);
          }
        });
      }
    });
  });

  //Route to see notes we have added
  app.get('/notes', function(req, res) {
    Note.find({}, function(err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    });
  });

  //Route to see what user looks like without populating
  app.get('/user', function(req, res) {
    User.find({}, function(err, doc) {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    });
  });

  //Route to see what user looks like WITH populating
  app.get('/populateduser', function(req, res) {

  ////////////////////////////////////////////////
  //WRITE YOUR CODE IN HERE
  //RESPOND WITH THE POPULATED USER OBJECT
    User.find({})
      .populate('notes')
      .exec(function(err, dbUsers) {
        if(err) {
          res.send(err);
        }
        else {
          res.send(dbUsers);
        }
      })
  ///////////////////////////////////////////////
  });

  // Scraping
  //Get from DB
  app.get('/illegal', function(req, res) {
    db.insertedArticle.find({}, function(err, found) {
      if (err) {
        console.log(err);
      } else {
        res.json(found);
      }
    });
  });


// Moved scraper code to inside '/' route so it scrapes on page load
  // app.get('/scrape', function(req, res) {
    
  //   res.redirect('/');
  // });

  // Display scraped data
  app.get('/displayInfo', function(req, res) {
    Article.find({}, function(err, articleData) {
      if(err) {
        throw err;
      }
      res.json(articleData);
    }).limit(10);
  });



  
  app.post('/addNote/:id' , function(req, res) {
       
  });
  
  app.get('/delete/:id', function(req, res) {
      
  });
    
    
}