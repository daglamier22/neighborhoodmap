var initialLocations = [
  {
    name: 'Tabby',
    address: 'img/434164568_fea0ad4013_z.jpg',
  },
  {
    name: 'Tiger',
    address: 'img/434164568_fea0ad4013_z.jpg',
  },
  {
    name: 'Scaredy',
    address: 'img/434164568_fea0ad4013_z.jpg',
  },
  {
    name: 'Shadow',
    address: 'img/434164568_fea0ad4013_z.jpg',
  },
  {
    name: 'Sleepy',
    address: 'img/434164568_fea0ad4013_z.jpg',
  },
];

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
}

var ViewModel = function() {
  var self = this;

  this.locationsList = ko.observableArray([]);
  initialLocations.forEach(function(item) {
    self.locationsList.push(new Location(item));
  });

  this.w3_open_sidebar = function() {
    document.getElementById("mySidebar").style.display = "block";
  };
  this.w3_close_sidebar = function() {
    document.getElementById("mySidebar").style.display = "none";
  };

  this.selectLocation = function() {
    console.log(this.name());
  }
}

ko.applyBindings(new ViewModel());
