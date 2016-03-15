//Require Schemas
var scrape = require('../models/scrapedModel.js');
var Note = require('../models/noteModel.js');

exports.home = function(req, res, next) {
  scrape.scraper();
  res.render('home');
};

exports.addNote = function(req, res, next) {
  var newNote = new Note.Note({
    note: req.body.note,
    createdAt: req.body.createdAt
  })
  newNote.save(function(err, newNote) {
    if(err) {
      throw err;
    }
    scrape.updateScrapeNote(req.body.scrapeId, newNote);
    res.send({});
  })
};

exports.getNotes = function(req, res, next) {
  scrape.getAllNotes(req.body.scrapeId).then(function(scrapeWithNotes) {
    res.json(scrapeWithNotes);
  })
};

exports.scrapeData = function(req, res, next) {
  scrape.getScrapedData().then(function(data) {
    res.json(data);
  })
};

exports.deleteNote = function(req, res, next) {
  Note.deleteNote(req.body.noteId).then(function() {
    res.send({});
  })
};