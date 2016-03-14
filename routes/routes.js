
// var renders = require('/controller/controller.js');

module.exports.routes = function(app) {

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








    
  app.get('/scrape', function(req, res) {
       
  });
  
  app.post('/addNote/:id' , function(req, res) {
       
  });
  
  app.get('/delete/:id', function(req, res) {
      
  });
    
    
}