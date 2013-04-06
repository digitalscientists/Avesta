//= require lib/jquery-1.8.3.min
//= require lib/chosen.jquery.min
//= require lib/underscore-min
//= require lib/tabletop

var Avesta = {
  cities: [],
  templates: {},
  collectTemplates: function(){
    var self = this;
    $("script[type='text/template']").each(function(index,item){
      self.templates[item.getAttribute('name')] = _.template(item.innerHTML);
    });
  },
  prepareData: function(){
    var self = this;
    this.data.forEach(function(item){
      self.cities.push(item.city)
      item.amenities = []; item.features = []; item.numBeds = [];
      item.numBaths = [];  item.minRent = [];  item.maxRent = [];
      for(var i = 1; i <= 23; i++){
        if(item['features' + i]) item.features.push(item['features' + i]);
        if(item['amenities' + i]) item.amenities.push(item['amenities' + i]);
      }
      for(var key in item){
        if(key.match(/^bed/) && item[key]){
          var types = key.split('-');
          item.numBeds.push(types[1]);
          item.numBaths.push(types[3]);
          item[types[4] + 'Rent'].push(item[key]);
        }
      }
      item.numBeds = _.uniq(item.numBeds.sort(),true)
      item.numBaths = _.uniq(item.numBaths.sort(),true)
      item.minRent = _.uniq(item.minRent.sort(),true)
      item.maxRent = _.uniq(item.maxRent.sort(),true)
    })
    self.cities = _.uniq(self.cities.sort(),true)
  },
  renderResults: function(results){
    $('#search-results').html(
      this._render('search-results',{
        city: 'Alph',state: 'FL',results: results
      })
    )
    $('select[name=city]').append(
      this._render('city-options',{cities: this.cities}));
  },
  _render: function(template, object){
    return this.templates[template](object);
  },
  initialize: function(){
    this.collectTemplates();
  }
};

Avesta.Search = {
  initialize: function(){
    var self = this;
    $('.refine-search').find('input,select').on('change',function(e){
      var option = this.getAttribute('name'),
          value = $('option:selected', this).attr('value')
      self._filter(option,value);
    });
  },
  _filter: function(option,value){
    var search = {}; search[option] = value;
    Avesta.renderResults(_.where(Avesta.data,search))
  }
};

$(document).ready(function() {
  
  //init jquery chose
  $('.chzn-select').chosen(); 
  $('.chzn-select-deselect').chosen({allow_single_deselect:true});

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


  Tabletop.init({
    key: 'https://docs.google.com/spreadsheet/pub?key=0AuVlvDns_FoWdFJ3a3NzT2RENy01eHlta2tlcUdVM2c&',
    callback: function(data, tabletop) {
       Avesta.data = data;
       Avesta.prepareData();
       Avesta.renderResults(Avesta.data);
     },
     simpleSheet: true
  })

  Avesta.initialize();
  Avesta.Search.initialize();
});