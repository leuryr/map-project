var Model = [
    {name:"Yankee Stadium", geometry: {location:{lat: 40.829622, lng: -73.926173}}, typeEnabled: ko.observable(true), types:["stadium"], vicinity: "1 E 161st St, Bronx"},
    {name:"The Bronx Museum of the Arts", geometry: {location:{lat: 40.831011, lng: -73.919719}}, typeEnabled: ko.observable(true), types:["museum"], vicinity: "1040 Grand Concourse, Bronx"},
    {name:"Concourse Plaza", geometry: {location:{lat: 40.825227, lng: -73.920491}}, typeEnabled: ko.observable(true), types:["shopping_mall"], vicinity: "220 E 161st St, Bronx"},
    {name:"Bronx County Hall of Justice", geometry: {location:{lat: 40.826258, lng: -73.919298}}, typeEnabled: ko.observable(true), types:["courthouse"], vicinity: "265 E 161st St, Bronx"},
    {name:"Bronx Supreme Court", geometry: {location:{lat: 40.826173, lng: -73.923834}}, typeEnabled: ko.observable(true), types:["courthouse"], vicinity: "851 Grand Concourse #111, Bronx"},
    {name:"Heritage Field", geometry: {location:{lat: 40.827023, lng: -73.927761}}, typeEnabled: ko.observable(true), types:["park"], vicinity: ", Bronx"},
    {name:"Joseph Yancey Track and Field", geometry: {location:{lat: 40.828006, lng: -73.929043}}, typeEnabled: ko.observable(true), types:["park"], vicinity: ", Bronx"},
    {name:"Joyce Kilmer Park", geometry: {location:{lat: 40.828522, lng: -73.922673}}, typeEnabled: ko.observable(true), types:["park"], vicinity: "Walton Ave, Bronx"}
];

var initApp = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: Model[7].geometry.location,
        zoom: 16,
        mapTypeControl: false
    });
    ko.applyBindings(new ViewModel());
};
var mapFail = function() {
    console.log('Maps did not load!');
};
var ViewModel = function() {
    var self = this;
    // Create an observable array, and store hardcoded Model locations.
    self.locations = ko.observableArray(Model);
    // Create an onservable for the selected filter value.
    self.selectedValue = ko.observable();
    self.selectedValue.subscribe(function(newValue) {
        console.log(newValue);
        self.locations().forEach(function(item) {
            if(item.types.includes(newValue) || (newValue == "Choose a type")) {
                item.typeEnabled(true);
                item.marker.setVisible(true);
            } else {
                    item.typeEnabled(false);
                    item.marker.setVisible(false);
                    infoWindowService.close();
                };
        });
    });
    self.resetFilter = function() {
        self.selectedValue("Choose a type");
    };
    var infoWindowService = new google.maps.InfoWindow();
    self.fillInfoWindow = function(location, infoWindow) {
        if(infoWindow.marker != location.marker) {
            infoWindow.marker = location.marker;
            var address = location.vicinity;
            var firstLine = address.substring(0,address.indexOf(","));
            infoWindow.setContent('<div>' + location.name + '<hr>' + '<br>' + firstLine + '<br>Bronx, NY</div>');
            infoWindow.open(map, location.marker);
        };
    };
    // This function creates map markers from an observable array of locations.
    self.createMarkers = function(array) {
        array().forEach(function(item) {
            if (!(item.hasOwnProperty('marker'))) {
                var position = item.geometry.location;
                var title = item.name;

                var marker = new google.maps.Marker({
                    position: position,
                    title: title,
                    map: map,
                    animation: google.maps.Animation.DROP
                });
                marker.addListener('click', function() {
                    self.animateMarker(this);
                    self.fillInfoWindow(item, infoWindowService);
                });
                item.marker = marker;
            }
        });
    };
    // Calling createMarkers function for the data that is already inside
    // self.locations.
    self.createMarkers(self.locations);
    // This function sets the initial value of the typeEnabled property
    // for a location to true.
    self.initType = function(item) {
        item.typeEnabled = ko.observable(true);
    };
    // This calls the Maps API Places service.
    var places = new google.maps.places.PlacesService(map);
    // Creating an object with fields required for our future nearbySearch method.
    var searchRequest = {
        location: Model[7].geometry.location,
        radius: 500,
        types: ['bank','bar', 'gym','movie_theater','restaurant',]
    };
    // This callback function will be used to handle the results of the
    // Places nearbySearch method.
    var requestCallback = function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            results.forEach(function(result) {
                self.initType(result);
                // Pushing results to our observable array.
                self.locations.push(result);
            });
            // Iterating through array after push to create markers for all locations.
            self.createMarkers(self.locations);
        } else {
            console.log('Could not complete search!');
            // Creates markers for hardcoded locations if Places service doesn't work.
            };
    };
    // Call to nearbySearch method for Places.
    places.nearbySearch(searchRequest, requestCallback);
    // This function gets the marker from the location object
    // and passes it into the animateMarker function.
    self.getMarker = function(object) {
        var marker = object.marker;
        self.animateMarker(marker);
    };
    self.getInfoWindow = function(object) {
        self.fillInfoWindow(object, infoWindowService);
    };
    // This function passes in a marker
    // and gives it a boucing animantion.
    self.animateMarker = function(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        // setTimeout lets the marker bouce about three
        // times before stopping the animation.
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2150);
    };
    // Create variables to facilitate toggling classes.
    var listContainer = $('.list-container');
    var menuIcon = $('.menu-icon')
    // This shows and hides the list menu.
    self.toggleMenu = function() {
        listContainer.toggleClass("open-menu");
        menuIcon.toggleClass("slide-icon");
    };
}
