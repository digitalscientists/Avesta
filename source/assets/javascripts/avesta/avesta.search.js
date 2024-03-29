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
    if(document.documentElement.clientWidth > 600)
      Avesta.Map.addMarkers(results);
    else
      $('#map-canvas').html($('<img>',{
        src: Avesta.Map.staticMap(results,document.documentElement.clientWidth)
      }));

    this.paginate(results);
  },
  _parseQueryParams: function(){
    return _.map(window.location.search.split('&'), function(str){
      var match = str.match(/city=(.*)/);
      if(match) return match[1].replace('+',' ');
    });
  },
  paginate: function(results){
    if(results.length > 4){
      $('.pagination').addClass('visible');
      $('body').on('click','.pagination a', function(){
        window.scrollTo(0,556);
      });
      $('#search-results').pajinate({
        item_container_id: '.listings',
        items_per_page: 4, 
        nav_panel_id: '.pagination__pages',
        show_first_last: false
      })
    } else {
      $('.pagination').removeClass('visible');
    }
  }
};