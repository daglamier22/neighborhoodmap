var ViewModel = function() {
  var self = this;

  this.w3_open_sidebar = function() {
    document.getElementById("mySidebar").style.display = "block";
  };
  this.w3_close_sidebar = function() {
    document.getElementById("mySidebar").style.display = "none";
  };
}

ko.applyBindings(new ViewModel());
