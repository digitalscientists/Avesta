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