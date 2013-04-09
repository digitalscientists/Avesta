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
      this.getPanes().overlayMouseTarget.appendChild(this.div);
      var self = this;
      google.maps.event.addDomListener(this.div, 'click', function() {
        google.maps.event.trigger(self, 'click');
      });
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
      var marker = new self.Marker(bounds, self.map, ++i);
      place.infoWindow = new google.maps.InfoWindow({
        content: Avesta._render('map-info-window',place),
        position: pos,
        pixelOffset: new google.maps.Size(0,-30)
      });
      google.maps.event.addDomListener(marker, 'click', function() {
        place.infoWindow.open(self.map);
      });
      self.markers.push(marker);
      self.bounds.extend(pos);
    });
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