var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ScrapedData = require('./scrapedModel.js');

var NoteSchema = new Schema({
  note: {
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

var deleteNote = function(id) {
  return Note.findOne({
    _id: id
  }, function(err, theNote) {
    theNote.remove();
  })
}

NoteSchema.post('remove', function() {
  ScrapedData.ScrapedData.remove({ 'notes': this._id }).exec();
});

var Note = mongoose.model("Note", NoteSchema);
exports.Note = Note;
exports.deleteNote = deleteNote;