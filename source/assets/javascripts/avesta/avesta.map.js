Avesta.Map = {
  initialize: function(){
    var mapOptions = {
      mapTypeControlOptions: {
        mapTypeIds: [ 'Styled']
      },
      mapTypeId: 'Styled',
      center: new google.maps.LatLng(28.62219,-81.415708),
      zoom: 8,
      mapTypeControl: false
    };
    this.map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
    this.bounds = new google.maps.LatLngBounds();

    var styledMapType = new google.maps.StyledMapType(this.mapStyles, { name: 'Styled' });
    this.map.mapTypes.set('Styled', styledMapType);

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
        if(self.openInfoWindow) self.openInfoWindow.close();
        place.infoWindow.open(self.map);
        self.openInfoWindow = place.infoWindow;
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
  },
  staticMap: function(places,width){
    var url = 'http://maps.googleapis.com/maps/api/staticmap?size='+width+'x'+width+'&sensor=false&maptype=terrain'
      , i = 1;
    _.each(places, function(place){
      url += '&markers=color:blue%7Clabel:'+ i++ +'%7C' + place.latlng
    })
    return url;
  },
  mapStyles: [
    {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [
        { hue: '#F9E453' },
        { saturation: -7 },
        { lightness: 3 },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#191919' },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#FFF' },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels',
      stylers: [
        { hue: '#191919' },
        { saturation: -100 },
        { lightness: 32 },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.highway.controlled_access',
      elementType: 'labels.icon',
      stylers: [
        { hue: '#AAA' },
        { saturation: -100 },
        { lightness: 32 },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'landscape',
      elementType: 'all',
      stylers: [
        { hue: '#ECECEC' },
        { saturation: -100 },
        { lightness: 32 },
        { visibility: 'on' }
      ]
    },{
      featureType: 'poi',
      elementType: 'all',
      stylers: [
        { hue: '#E2E2E2' },
        { saturation: -100 },
        { lightness: 100 },
        { visibility: 'simplified' }
      ]
    },{
      featureType: 'road.arterial',
      elementType: 'all',
      stylers: [
        { hue: '#FCFCFC' },
        { saturation: -100 },
        { lightness: 95 },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.arterial',
      elementType: 'labels.text.fill',
      stylers: [
        { hue: '#AAA' },
        { saturation: -100 },
        { lightness: 32 },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.arterial',
      elementType: 'labels.text.stroke',
      stylers: [
        { hue: '#AAA' },
        { saturation: -100 },
        { lightness: 32 },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.arterial',
      elementType: 'geometry.stroke',
      stylers: [
        { hue: '#F4E2B7' },
        { saturation: -100 },
        { lightness: 32 },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.arterial',
      elementType: 'geometry.fill',
      stylers: [
        { hue: '#FFF' },
        { saturation: -100 },
        { lightness: 32 },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.local',
      elementType: 'labels',
      stylers: [
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.local',
      elementType: 'all',
      stylers: [
        { hue: '#DCDCDC' },
        { saturation: -100 },
        { lightness: 100 },
        { visibility: 'simplified' }
      ]
    },{
      featureType: 'road.local',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#FAFAFA' },
        { visibility: 'on' }
      ]
    },{
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#CCCCCC' },
        { visibility: 'on' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [
        { hue: '#ECECEC' },
        { saturation: -100 },
        { lightness: 32 },
        { visibility: 'off' }
      ]
    },{
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'landscape.man_made',
      elementType: 'geometry.stroke',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ]
}

Avesta.Map.Marker = function(bounds,map,number){
  this.bounds = bounds;
  this.number = number;
  this.setMap(map);
}