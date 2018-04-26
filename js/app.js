var initialLocations = [
  {
    name: 'On The Border Mexican Grill & Cantina',
    address: '213 N Central Expy, Allen, TX 75013',
  },
  {
    name: 'Chipotle Mexican Grill',
    address: '103 N Central Expy, Allen, TX 75013',
  },
  {
    name: 'Dr E T Boon Elementary School',
    address: '1050 Comanche Dr, Allen, TX 75013',
  },
  {
    name: 'Tom Thumb',
    address: '900 W McDermott Dr, Allen, TX 75013',
  },
  {
    name: 'RaceTrac',
    address: '840 W Exchange Pkwy, Allen, TX 75013',
  },
  {
    name: 'Kwik Kar of Allen',
    address: '400 W McDermott Dr, Allen, TX 75013'
  }
];

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.id = ko.observable(data.id);
  this.visible = ko.observable(true);
  this.addMarker = function(marker) {
    this.marker = marker;
  }
}

var ViewModel = function() {
  var self = this;

  // Create the map variable and a new blank array for all the location markers.
  var map;

  // Create and fill the full locationsList
  self.locationsList = ko.observableArray([]);
  initialLocations.forEach((item, index) => {
    item.id = index;
    self.locationsList.push(new Location(item));
  });

  // Capture input for filter and filter the display list
  this.filterValue = ko.observable('');
  this.filterValue.subscribe(() => {
    self.locationsList().forEach((item,index) => {
      if (item.name().toUpperCase().includes(self.filterValue().toUpperCase())) {
        item.visible(true);
        item.marker.setMap(self.map);
      } else {
        item.visible(false);
        item.marker.setMap(null);
      }
    });
  })

  // These 2 functions are for opening and closing the sidebar when on a smaller screen
  this.w3_open_sidebar = function() {
    document.getElementById("mySidebar").style.display = "block";
  };
  this.w3_close_sidebar = function() {
    document.getElementById("mySidebar").style.display = "none";
  };

  // handle clicks in sidebar
  this.selectLocation = function() {
    console.log(this.name());
  }

  this.initMap = function() {
    // This style is the WY style from https://snazzymaps.com/style/8097/wy
    var styles = [
      {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "weight": "2.00"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#9c9c9c"
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#f2f2f2"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 45
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#7b7b7b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#46bcec"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#c8d7d4"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#070707"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      }
    ];
    // Constructor creates a new map - only center and zoom are required.
    self.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.1054826, lng: -96.6803112},
      zoom: 15,
      styles: styles,
      mapTypeControl: false
    });

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = self.makeMarkerIcon('0091ff');

    // Create a "highlisted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = self.makeMarkerIcon('FFFF24');

    var placesService = new google.maps.places.PlacesService(self.map);
    // The following group uses the location array to create an array of markers on initialize.
    for (let i = 0; i < self.locationsList().length; i++) {
      // Get the position from the location array.
      placesService.textSearch({
        query: self.locationsList()[i].address()
      }, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var position = results[0].geometry.location;
          // Create a marker per location, and put into Location array.
          var marker = new google.maps.Marker({
            map: self.map,
            position: position,
            title: initialLocations[i].name,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            id: self.locationsList()[i].id()
          });
          // Push the marker to our Location array.
          self.locationsList()[i].addMarker(marker);
          // Extend the boundaries of the map for each marker
          // bounds.extend(marker.position);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          // map.fitBounds(bounds);

          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
        } else {
          alert('Unable to find  a result for: ' + address);
        }
      });
    }
  }

  // This function takes in a COLOR, and then create a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34.
  this.makeMarkerIcon = function(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34)
    );
    return markerImage;
  }
}
let vm = new ViewModel();
ko.applyBindings(vm);
