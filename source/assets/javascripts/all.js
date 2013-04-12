//= require lib/jquery-1.8.3.min
//= require lib/chosen.jquery.min
//= require lib/underscore-min
//= require lib/tabletop
//= require lib/serialize
//= require avesta/avesta
//= require avesta/avesta.search
//= require avesta/avesta.map
//= require avesta/avesta.news

$(document).ready(function() {
  
  $('body').on('click','#nav-find a',function(){
    $('.search').toggle();
  });

  $('body').on('click','.hide-map',function(){
    $(this).toggleClass('active');
    $('#map-canvas').toggle();
  });

  //init jquery chose
  $('.chzn-select').chosen().change(function(e){
    this.form.submit();
  }); 
  $('.chzn-select').val('').trigger("liszt:updated");

  //rwd - toggle main nav
  var $menu = $('#nav-main'),
  $menulink = $('.menu-link');
  
  $menulink.click(function() {
    $('.search').toggleClass('active');
    $menulink.toggleClass('active');
    $menu.toggleClass('active');
    return false;
  });

  //show refine search on mobile
  $('#show-refine-search').click(function() {
    $('.find-refine').show();
  });
  $('button.btn--cancel').click(function(e){
    $('.find-refine').hide();
    e.stopPropagation();
    return false;
  })

  //select styling for refine search form
  $('.refine-search select').each(function(){
    $(this).wrap('<div class="selectbox"/>');
    $(this).after("<span class='selecttext'></span>");
    var val = $(this).children("option:selected").text();
    $(this).next(".selecttext").text(val);
    $(this).change(function(){
      var val = $(this).children("option:selected").text();
      $(this).next(".selecttext").text(val);
    });
  });

  $('body').on('click','a[data-action="more-link"]',function(){
    $(this).prev().addClass('expanded');$(this).remove();
  })


  Avesta.initialize();

  if(document.body.id == 'find'){
    Tabletop.init({
      key: 'https://docs.google.com/spreadsheet/pub?key=0AuVlvDns_FoWdFJ3a3NzT2RENy01eHlta2tlcUdVM2c&',
      callback: function(data, tabletop) {
         if(document.documentElement.clientWidth > 600)
           Avesta.Map.initialize();
         Avesta.data = data;
         Avesta.prepareData();
         Avesta.Search.prepareForm();
         var cities = Avesta.Search._parseQueryParams();
         if(cities.length){
           Avesta.Search._filter({city:cities[0]});
           $('.refine-search select[name=city]').val(cities[0]);
           $('.refine-search select[name=city]').next('.selecttext').text(cities[0]);
         } else{
           Avesta.renderResults(Avesta.data);
         }
      },
      simpleSheet: true
    });

    Avesta.Search.initialize();
  }

  if(document.body.id == 'about-news-events')
    Avesta.News.fetch(Avesta.News.renderResults);

  if(document.body.id == 'home')
    Avesta.News.fetch(Avesta.News.renderHome);

});