var Model = [
    {name:'Yankee Stadium', geometry: {location:{lat: 40.829622, lng: -73.926173}}, typeEnabled: true, types:[]},
    {name:'The Bronx Museum of the Arts', geometry: {location:{lat: 40.831011, lng: -73.919719}}, typeEnabled: true, types:[]},
    {name:'Concourse Plaza', geometry: {location:{lat: 40.825227, lng: -73.920491}}, typeEnabled: true, types:[]},
    {name:'Bronx County Hall of Justice', geometry: {location:{lat: 40.826258, lng: -73.919298}}, typeEnabled: true, types:[]},
    {name:'Bronx Supreme Court', geometry: {location:{lat: 40.826173, lng: -73.923834}}, typeEnabled: true, types:[]},
    {name:'Heritage Field', geometry: {location:{lat: 40.827023, lng: -73.927761}}, typeEnabled: true, types:[]},
    {name:'Joseph Yancey Track and Field', geometry: {location:{lat: 40.828006, lng: -73.929043}}, typeEnabled: true, types:[]},
    {name:'Joyce Kilmer Park', geometry: {location:{lat: 40.828522, lng: -73.922673}}, typeEnabled: true, types:[]}
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
            if(item.types.includes(newValue)) {
                item.typeEnabled = true;
            } else {
                item.typeEnabled = false;
            };
        });
    });
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
                });
                item.marker = marker;
            }
        });
    };
    // This function sets the initial value of the typeEnabled property
    // for a location to true.
    self.initType = function(item) {
        item.typeEnabled = true;
    };
    // This calls the Maps API Places service.
    var service = new google.maps.places.PlacesService(map);
    // Creating an object with fields required for our future nearbySearch method.
    var searchRequest = {
        location: Model[7].geometry.location,
        radius: 500,
        types: ['bakery','bank','bar','cafe','gym','movie_theater','restaurant',]
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
            self.createMarkers(self.locations);
            };
    };
    // Call to nearbySearch method for Places.
    service.nearbySearch(searchRequest, requestCallback);
    // This function gets the marker from the location object
    // and passes it into the animateMarker function.
    self.getMarker = function(object) {
        var marker = object.marker;
        self.animateMarker(marker);
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
