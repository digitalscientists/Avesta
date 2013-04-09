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
