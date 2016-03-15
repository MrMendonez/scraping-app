var controller = require('../controllers/controller.js');

module.exports.routes = function(app) {

  app.get('/', controller.home);

  app.get('/scrape', controller.scrapeData);

  app.post('/getNotes', controller.getNotes);

  app.post('/addNote', controller.addNote);
  
  app.post('/delete', controller.deleteNote);
    
};