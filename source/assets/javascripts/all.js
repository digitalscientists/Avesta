//= require lib/jquery-1.8.3.min
//= require lib/chosen.jquery.min

$(document).ready(function() {
  
  //init jquery chose
  $(".chzn-select").chosen(); 
  $(".chzn-select-deselect").chosen({allow_single_deselect:true});

});