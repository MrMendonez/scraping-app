$(document).ready(function(){

  // Toast
  $('.tooltipped').tooltip({delay: 50});

  // Load updated msg
  var $toastContent = $('<span>Article List Updated</span>');
  Materialize.toast($toastContent, 2000);
});