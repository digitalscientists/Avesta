//= require lib/jquery-1.8.3.min
//= require lib/chosen.jquery.min

$(document).ready(function() {
  
  //init jquery chose
  $(".chzn-select").chosen(); 
  $(".chzn-select-deselect").chosen({allow_single_deselect:true});

  //rwd - toggle main nav
  var $menu = $('#nav-main'),
  $menulink = $('.menu-link');
  
  $menulink.click(function() {
    $menulink.toggleClass('active');
    $menu.toggleClass('active');
    return false;
  });

  //show refine search on mobile
  $('#show-refine-search').click(function() {
    $('.find-refine').show();
    });

});