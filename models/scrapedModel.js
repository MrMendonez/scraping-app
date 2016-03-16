var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScrapedDataSchema = new Schema({
  title:{
    type:String,
    unique: true
  },
  link:{
    type:String
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

var scraper = function() {
  request('https://news.ycombinator.com/', function (error, response, html) {
    var $ = cheerio.load(html);
    $('td.title:nth-child(3)>a').each(function(i, element){

      var scraped = new ScrapedData({
        title: $(element).text(),
        link: $(element).attr('href')
      });

      scraped.save(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        };
      });
    });
  });
}

var getScrapedData = function() {
  return ScrapedData.find({});
}

var updateScrapeNote = function(scrapeId, newNote) {
  console.log("updateScrapeNote is running...")
  ScrapedData.findOneAndUpdate({
    _id: scrapeId
  },
  {
    $push: {
      'notes': newNote._id
    }
  },
  {
    new: true
  }, function(err, updated) {
    if(err) {
      throw err;
    }
  })
};

var getAllNotes = function(scrapeId) {
  console.log(scrapeId);
  return ScrapedData
    .findOne({_id: scrapeId})
    .populate('notes')
    .exec(function(err, scrapeWithNotes) {
      if(err) return handleError(err);
    })
}

var ScrapedData = mongoose.model('ScrapedData', ScrapedDataSchema);
exports.ScrapedDataSchema = ScrapedDataSchema;
exports.ScrapedData = ScrapedData;
exports.scraper = scraper;
exports.getScrapedData = getScrapedData;
exports.updateScrapeNote = updateScrapeNote;
exports.getAllNotes = getAllNotes;