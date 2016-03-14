
// var renders = require('/controller/controller.js');

module.exports.routes = function(app) {

  var request = require('request'); // gives us the ability to make web requests
  var cheerio = require('cheerio'); // scrapes - allows us to use jquery syntax to parse a lot of data
  var mongoose = require('mongoose');
  var db = mongoose.connection;
  var mongojs = require('mongojs');
  var databaseUrl = "scraper";
  var collections = ["scrapedData"];
  var db = mongojs(databaseUrl, collections);
  db.on('error', function(err) {
    console.log('Database Error:', err);
  });

  app.get('/', function(req, res) {
    res.render('index');
  });

  //New Note Creation
  app.post('/submit', function(req, res) {
    var newNote = new Note(req.body);
    //Save the new note
    newNote.save(function(err, doc) {
      if (err) {
        res.send(err);
      } else {
        //Find our user and push the new note id into the User's notes array
        User.findOneAndUpdate({}, {$push: {'notes': doc._id}}, {new: true}, function(err, doc) {
          if (err) {
            res.send(err);
          } else {
            res.send(doc);
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
  db.scrapedData.find({}, function(err, found) {
    if (err) {
      console.log(err);
    } else {
      res.json(found);
    }
  });
});

app.get('/scrape', function(req, res) {
  request('https://news.ycombinator.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    $('.title').each(function(i, element) {
      var title = $(this).children('a').text();
      var link = $(this).children('a').attr('href');
      if (title && link) {
        db.scrapedData.save({
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
    });
  });
  res.send("Scrape Complete");
});



  
  app.post('/addNote/:id' , function(req, res) {
       
  });
  
  app.get('/delete/:id', function(req, res) {
      
  });
    
    
}