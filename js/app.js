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
  this.visible = ko.observable(true);
}

var ViewModel = function() {
  var self = this;

  // Create and fill the full locationsList
  this.locationsList = ko.observableArray([]);
  initialLocations.forEach((item) => {
    self.locationsList.push(new Location(item));
  });

  // Capture input for filter and filter the display list
  this.filterValue = ko.observable('');
  this.filterValue.subscribe(() => {
    self.locationsList().forEach((item => {
      if (item.name().toUpperCase().includes(self.filterValue().toUpperCase())) {
        item.visible(true);
      } else {
        item.visible(false);
      }
    }));
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
}
ko.applyBindings(new ViewModel());

///////////////////////////////////////////////////////////////////////
// Google Maps functionality                                         //
///////////////////////////////////////////////////////////////////////
var map;

function errorMap() {
  alert("Unable to reach Google Maps");
}

function initMap() {
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
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.1054826, lng: -96.6803112},
    zoom: 15,
    styles: styles,
    mapTypeControl: false
  });
}
