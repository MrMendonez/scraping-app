$(document).ready(function(){

  function getScrapedData() {
    $('#scrape-results').empty();
    $.getJSON('/scrape', function(data) {
      for (var i = 0; i<data.length; i++){
        $('#scrape-results').prepend('<li class="collection-item dismissable" data-id=' + data[i]._id + '><div><a href="' + data[i].link + '"target="_blank">' + data[i].title + '</a>' + '<a href="#!" class="secondary-content"><i class="material-icons show-note">send</i></a></div></li>')
      }
    });
  }

  getScrapedData();

  function getNotes(id) {
    $.ajax({
      type: "POST",
      url: '/getNotes',
      dataType: 'json',
      data: {
        scrapeId: id
      }
    })
    .done(function(data){
      console.log(data.notes);
      var notes = data.notes;
      $('#note-results').empty();
      for (var i = 0; i<notes.length; i++){
        $('#note-results').prepend('<li class="collection-item dismissable" data-id=' + notes[i]._id + ' data-scrapeid=' + id + '><div>' + notes[i].note + '<a href="#"><i class="material-icons delete-note">not_interested</i></a></div></li>')
      }
    });
  }

  $('#new-note').on('click', function(e) {
    e.preventDefault();
    var scrapeId = $('#note-text').data('id');
    $.ajax({
      type: "POST",
      url: '/addNote',
      dataType: 'json',
      data: {
        note: $('#note-text').val(),
        createdAt: Date.now(),
        scrapeId: scrapeId
      }
    })
    .done(function(data) {
      console.log('got here');
      getNotes(scrapeId);
    });
  });

  $(document).on('click', '.show-note', function(e) {
    var objID = $(this).parents('li').data('id');
    $('#note-text').data('id', objID);
    //get.json notes for the scraped data entry
    getNotes(objID);
  });

  $(document).on('click', '.delete-note', function(e) {
    var objID = $(this).parents('li').data('id');
    var scrapeId = $(this).parents('li').data('scrapeid');
    var note = $(this).parents('li');
    //get.json notes for the scraped data entry
    $.ajax({
      type:'POST',
      url: '/delete/',
      dataType: 'json',
      data: {
        noteId: objID,
        scrapeId: scrapeId
      }
    })
    .done(function(data) {
      note.remove();
    });
  });






});