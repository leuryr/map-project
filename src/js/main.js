var Model = [
    {title:'Yankee Stadium', location:{lat: 40.829622, lng: -73.926173}},
    {title:'The Bronx Museum of the Arts', location:{lat: 40.831011, lng: -73.919719}},
    {title:'Concourse Plaza', location:{lat: 40.825227, lng: -73.920491}},
    {title:'Bronx County Hall of Justice', location:{lat: 40.826258, lng: -73.919298}},
    {title:'Bronx Supreme Court', location:{lat: 40.826173, lng: -73.923834}},
    {title:'Heritage Field', location:{lat: 40.827023, lng: -73.927761}},
    {title:'Joseph Yancey Track and Field', location:{lat: 40.828006, lng: -73.929043}},
    {title:'Joyce Kilmer Park', location:{lat: 40.828522, lng: -73.922673}}
];

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: Model[0].location,
        zoom: 16,
        mapTypeControl: false
    });
    ko.applyBindings(new ViewModel());
};

var ViewModel = function() {
    var self = this;
    //Create an observable array to store locations.
    self.locations = ko.observableArray(Model);
    //Function for creating map markers from an array of locations.
    self.createMarkers = function(array) {
        array().forEach(function(item) {
            if (!(item.hasOwnProperty('marker'))) {
                var position = item.location;
                var title = item.title;

                var marker = new google.maps.Marker({
                    position: position,
                    title: title,
                    map: map
                });
                item.marker = marker;
            }
        });
    };
    self.createMarkers(self.locations);
    //Create variables to facilitate toggling classes.
    var listContainer = $('.list-container');
    var menuIcon = $('.menu-icon')
    //Function for showing hiding the list menu.
    self.toggleMenu = function() {
        listContainer.toggleClass("open-menu");
        menuIcon.toggleClass("slide-icon");
    };
}
