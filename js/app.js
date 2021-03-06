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
    address: '400 W McDermott Dr, Allen, TX 75013',
  }
];

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.id = ko.observable(data.id);
  this.visible = ko.observable(false);
  this.addMarker = function(marker) {
    this.marker = marker;
  }
  this.selected = false;
  this.toggleSelected = function() {
    this.selected = !this.selected;
  }
}

var ViewModel = function() {
  var self = this;

  // Create the map variable and a new blank array for all the location markers.
  this.map;
  this.largeInfowindow;

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
    // console.log(this.name());
    self.selectMarker(this);
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

    // Make all locations visible now that google maps has loaded
    self.locationsList().forEach((item) => item.visible(true));

    self.largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    this.defaultIcon = self.makeMarkerIcon('0091ff');

    // Style the markers a bit. This will be our listing marker icon.
    this.selectedIcon = self.makeMarkerIcon('ff0000');

    // Create a "highlisted location" marker color for when the user
    // mouses over the marker.
    this.highlightedIcon = self.makeMarkerIcon('FFFF24');

    var placesService = new google.maps.places.PlacesService(self.map);
    // The following group uses the location array to create an array of markers on initialize.
    for (let i = 0; i < self.locationsList().length; i++) {
      // Get the position from the location array.
      placesService.textSearch({
        query: self.locationsList()[i].address()
      }, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var position = results[0].geometry.location;
          self.locationsList()[i].location = position;
          // Create a marker per location, and put into Location array.
          var marker = new google.maps.Marker({
            map: self.map,
            position: position,
            title: initialLocations[i].name,
            icon: self.defaultIcon,
            animation: google.maps.Animation.DROP,
            id: self.locationsList()[i].id()
          });
          // Push the marker to our Location array.
          self.locationsList()[i].addMarker(marker);

          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            self.selectMarker(self.locationsList()[i]);
          });

          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            self.mouseoverMarker(self.locationsList()[i]);
          });
          marker.addListener('mouseout', function() {
            self.mouseoutMarker(self.locationsList()[i]);
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

  // This function handles mouseover of a marker
  this.mouseoverMarker = function(location) {
    if (location.marker != undefined) {
      location.marker.setIcon(self.highlightedIcon);
    }
  }
  // This function handles mouseout of a marker
  this.mouseoutMarker = function(location) {
    if (location.marker != undefined) {
      // Put marker back to the way it was before mouseover
      if (location.selected) {
        location.marker.setIcon(self.selectedIcon);
      } else {
        location.marker.setIcon(self.defaultIcon);
      }
    }
  }
  // This function handles selecting of a marker
  this.selectMarker = function(location) {
    if (location.marker != undefined) {
      // Unselect all markers
      self.locationsList().forEach((item) => {
        item.selected = false;
        item.marker.setIcon(self.defaultIcon);
      });
      location.marker.setIcon(location.selectedIcon);
      location.toggleSelected();
      self.populateInfoWindow(location, self.largeInfowindow);
    }
  }

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  this.populateInfoWindow = function(location, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != location.marker) {
      infowindow.marker = location.marker;
      infowindow.setContent('');
      infowindow.open(self.map, location.marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.setMarker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, location.marker.position);
          infowindow.setContent(infowindow.getContent() + '<div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 0
            }
          };
          var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent(infowindow.getContent() + '<div>No Street View Found</div>');
        }
      }

      // Retrieve FourSquare info
      fetch(`https://api.foursquare.com/v2/venues/explore?client_id=H3JQBA0NQC1TBMNOU4BXK45FNHRMZEOFN5HV3WHQUEA1COXN&client_secret=YO3IZO5KNRDXPAVOYJWUUORL4WIGVM5FQ42J34ZYSA5BMY4Y&ll=${location.location.lat()},${location.location.lng()}&query=${location.name()}&v=20180323&limit=1`)
      .then(response => response.json())
      .then((results) => {
        infowindow.setContent(infowindow.getContent() + '<div><center><strong>' + location.marker.title + '</strong></center></div>' +
        '<br><div><img style="background-color: #0091ff; float: left" src="' + results.response.groups[0].items[0].venue.categories[0].icon.prefix + '32' + results.response.groups[0].items[0].venue.categories[0].icon.suffix + '">' +
        '<div>' + results.response.groups[0].items[0].venue.categories[0].name +
        '<br>' + results.response.groups[0].items[0].venue.location.formattedAddress[0] + ' ' +
        results.response.groups[0].items[0].venue.location.formattedAddress[1] + '</div></div>' +
        '<img src="./img/Powered-by-Foursquare-full-color-300.png" alt="' + location.marker.title + '" width="250"><hr>');

      })
      .catch(e => {
        infowindow.setContent(infowindow.getContent() + '<div><center><strong>' + location.marker.title + '</strong></center></div>' +
          '<div>No Foursquare Details Found</div><hr>');
      })
      .then(() => {
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(location.marker.position, radius, getStreetView);
      });

      // Open the infowindow on the correct marker.
      infowindow.open(map, location.marker);
    }
  }
}
let vm = new ViewModel();
ko.applyBindings(vm);
