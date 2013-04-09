//= require lib/jquery-1.8.3.min
//= require lib/chosen.jquery.min
//= require lib/underscore-min
//= require lib/tabletop

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

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
    if($('#search-results').length){
      $('#search-results').html(
        this._render('search-results',{
          city: (results[0] || {}).city, state: 'FL',results: results
        })
      )
    }
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
      self._filter($(this.form).serializeObject());
    });
  },
  prepareForm: function(){
    $('select[name=city]').append(
      Avesta._render('city-options',{cities: Avesta.cities}));
  },
  _filter: function(options){
    var results = _.filter(Avesta.data, function(place){
      var beds = true, baths = true, rent = true, city = true;

      if(options.beds)  beds = _.contains(place.numBeds,options.beds);
      if(options.baths) baths = _.contains(place.numBaths,options.baths);
      if(options.city)  city = place.city == options.city;
      if(options.rent){
        var range = _.map(options.rent.split('-'),function(r){return parseInt(r)}),
            minRent = parseInt(place.minRent[0]);
            maxRent = parseInt(place.maxRent[place.maxRent.length - 1]);
        rent = (minRent >= range[0] && minRent <= range[1]) ||
               (maxRent >= range[0] && maxRent <= range[1]);
      }

      return beds && baths && rent && city;
    });

    Avesta.renderResults(results);
    Avesta.Map.addMarkers(results);
  },
  _parseQueryParams: function(){
    return _.map(window.location.search.split('&'), function(str){
      var match = str.match(/city=(.*)/);
      if(match) return match[1];
    });
  }
};

Avesta.Map = {
  initialize: function(){
    var mapOptions = {
      center: new google.maps.LatLng(28.62219,-81.415708),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    this.map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
    this.bounds = new google.maps.LatLngBounds();

    this.Marker.prototype = new google.maps.OverlayView();
    this.Marker.prototype.onAdd = function() {
      this.div = document.createElement('div');
      this.div.className = "marker";
      this.div.innerHTML = this.number;
      this.getPanes().overlayLayer.appendChild(this.div);
    };

    this.Marker.prototype.draw = function() {
      var overlayProjection = this.getProjection();
      var point = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
      this.div.style.left = point.x - 19 + 'px';
      this.div.style.top = point.y - 27 + 'px';
    };

    this.Marker.prototype.onRemove = function() {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    }

  },
  markers: [],
  addMarkers: function(places){
    this.clearMarkers();
    var self = this, i = 0;
    _.each(places, function(place){
      var latlng = place.latlng.split(','),
          pos = new google.maps.LatLng(parseFloat(latlng[0]),parseFloat(latlng[1]));
      var bounds = new google.maps.LatLngBounds(pos,pos);   
      self.markers.push(new self.Marker(bounds, self.map, ++i));
      self.bounds.extend(pos);
    })
    self.map.fitBounds(self.bounds);
  },
  clearMarkers: function(){
    this.bounds = new google.maps.LatLngBounds();
    _.each(this.markers,function(m){
      m.setMap(null)
      m = null;
    })
  }
}

Avesta.Map.Marker = function(bounds,map,number){
  this.bounds = bounds;
  this.number = number;
  this.setMap(map);
}

$(document).ready(function() {
  
  $('body').on('click','#nav-find a',function(){
    $('.search').show();
  });

  //init jquery chose
  $('.chzn-select').chosen().change(function(e){
    this.form.submit();
  }); 
  $('.chzn-select-deselect').chosen();

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


  if(document.body.id == 'find'){
    Tabletop.init({
      key: 'https://docs.google.com/spreadsheet/pub?key=0AuVlvDns_FoWdFJ3a3NzT2RENy01eHlta2tlcUdVM2c&',
      callback: function(data, tabletop) {
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

    Avesta.initialize();
    Avesta.Search.initialize();
  }

});