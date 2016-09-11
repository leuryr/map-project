var Model = [
    {
        name:"Yankee Stadium",
        location:{lat: 40.829622, lng: -73.926173},
        typeEnabled: ko.observable(true),
        address: "1 E 161st St, Bronx NY"
    },
    {
        name:"The Bronx Museum of the Arts",
        location:{lat: 40.831011, lng: -73.919719},
        typeEnabled: ko.observable(true),
        address: "1040 Grand Concourse, Bronx NY"
    },
    {
        name:"Concourse Plaza",
        location:{lat: 40.825227, lng: -73.920491},
        typeEnabled: ko.observable(true),
        address: "220 E 161st St, Bronx NY"
    },
    {
        name:"Bronx County Family Court",
        location:{lat: 40.826746, lng: -73.920696},
        typeEnabled: ko.observable(true),
        address: "900 Sheridan Ave, Bronx NY"
    },
    {
        name:"Bronx County Hall of Justice",
        location:{lat: 40.826102, lng: -73.919612},
        typeEnabled: ko.observable(true),
        address: "265 E 161st St, Bronx NY"},
    {
        name:"Bronx Supreme Court",
        location:{lat: 40.826173, lng: -73.923834},
        typeEnabled: ko.observable(true),
        address: "851 Grand Concourse #111, Bronx NY"
    },
    {
        name:"Heritage Field",
        location:{lat: 40.827023, lng: -73.927761},
        typeEnabled: ko.observable(true),
        address: ", Bronx NY"
    },
    {
        name:"Joseph Yancey Track and Field",
        location:{lat: 40.828025, lng: -73.929016},
        typeEnabled: ko.observable(true),
        address: ", Bronx NY"
    },
    {
        name:"Joyce Kilmer Park",
        location:{lat: 40.828522, lng: -73.922673},
        typeEnabled: ko.observable(true),
        address: "Walton Ave, Bronx NY"
    },
    {
        name:"Mullaly Park",
        location:{lat: 40.833092, lng: -73.924046},
        typeEnabled: ko.observable(true),
        address: "Jerome Ave, Bronx NY"
    }
];

var initApp = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.828522, lng: -73.922673},
        zoom: 16,
        mapTypeControl: false
    });
    ko.applyBindings(new ViewModel());
};
var mapFail = function() {
    alert('Google Maps could not load at this time. Please try again later.');
};
var ViewModel = function() {
    var self = this;
    // Create an observable array, and store hardcoded Model locations.
    self.locations = ko.observableArray(Model);
    // Create an onservable for the selected filter text value.
    self.listFilter = ko.observable();
    self.listFilter.subscribe(function(newValue) {
        var simpleValue = newValue.toLowerCase();
        self.locations().forEach(function(item) {
            if(item.name.toLowerCase().indexOf(simpleValue) >= 0) {
                item.typeEnabled(true);
                item.marker.setVisible(true);
            } else {
                item.typeEnabled(false);
                item.marker.setVisible(false);
                if((item.marker == infoWindowService.marker) && (item.marker.visible == false)){
                    infoWindowService.close();
                    infoWindowService.marker = null;
                };
            };
        });
    });
    var infoWindowService = new google.maps.InfoWindow();
    self.fillInfoWindow = function(item, infoWindow) {
        if(infoWindow.marker != item.marker) {
            infoWindow.marker = item.marker;
            if(item.hasOwnProperty('id')) {
                var firstLine = item.location.formattedAddress[0];
                var secondLine = item.location.formattedAddress[1];
                infoWindow.setContent('<div>' + '<h3 class="infoWindow-title">' + item.name + '</h3>' + '<hr>' + '<br>' + firstLine + '<br>' + secondLine);
                if (item.contact.hasOwnProperty('formattedPhone')){
                    var phone = item.contact.formattedPhone;
                    infoWindow.setContent(infoWindow.content + '<br>' + '<br>' + phone + '</div>');
                }
            } else {
                var address = item.address;
                var firstLine = address.substring(0,address.indexOf(","));
                var secondLine = "Bronx, NY";
                infoWindow.setContent('<div>' + item.name + '<hr>' + '<br>' + firstLine + '<br>' + secondLine + '</div>');
            };
            infoWindow.open(map, item.marker);

            infoWindow.addListener('closeclick', function() {
              infoWindow.marker = null;
            });
        };
    };
    // This function creates map markers from an observable array of locations.
    self.createMarkers = function(array) {
        array().forEach(function(item) {
            if (!(item.hasOwnProperty('marker'))) {
                var position = item.location;
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
    // // Calling createMarkers function for the data that is already inside
    // // self.locations.
    // self.createMarkers(self.locations);
    // This function sets the initial value of the typeEnabled property
    // for a location to true.
    self.initType = function(item) {
        item.typeEnabled = ko.observable(true);
    };
    var fsClientID = "HKK50PCWV51XRJQUJAF4UEQGULLAFOWIOVWOBYLJZFTP4FTF";
    var fsClientSecret = "LUCLK3BPYXTO3Q25GBSH0FSH3RSIKL0HS1O2BMALNYII2VMD";
    var fsVersion = 20160909;
    var fsSearchCenter = 40.828522 + "," + -73.922673;
    var fsRadius = 500;
    self.findInfoLocation = function() {
        self.locations().forEach(function(item) {
            var fsSearchCenter = item.location.lat + "," + item.location.lng;
            var fsURL = "https://api.foursquare.com/v2/venues/search?client_id="+fsClientID+"&client_secret="+fsClientSecret+"&v="+fsVersion+"&ll="+fsSearchCenter+"&query="+item.name+"&address="+item.address+"&limit=1";
            $.getJSON(fsURL,function(results){
                for (var property in results.response.venues[0]) {
                    item[property] = results.response.venues[0][property];
                };
            })
            .always(function() {
                self.createMarkers(self.locations);
            });
        });
    };
    self.findInfoLocation();
    var fsSection = "food";
    var fsURL = "https://api.foursquare.com/v2/venues/explore?client_id="+fsClientID+"&client_secret="+fsClientSecret+"&v="+fsVersion+"&ll="+fsSearchCenter+"&radius="+fsRadius+"&section="+fsSection+"&limit=50";
    $.ajax({
        url: fsURL,
        dataType: "json",
        success: function(results) {
            results.response.groups[0].items.forEach(function(item) {
                self.initType(item.venue);
                self.locations.push(item.venue);
            });
            self.createMarkers(self.locations);
        },
        error: function(result) {
            var errorType = result.responseJSON.meta.errorType;
            var description;
            if(errorType == 'invalid_auth' || 'param_error' || 'endpoint_error') {
                description = 'Something wrong with request. Please contact site administrator.'
            } else if(errorType == 'rate_limit_exceeded') {
                description = 'Number of requests has exceeded limit. Please try again later.'
            } else if(errorType == 'server_error') {
                description = 'Foursquare server is experiencing issues. Please try again later.'
            } else {
                description = 'Some error has occurred. Please contact site administrator.'
            };
            alert('Could not retrieve Foursquare data.\n' + description);
        }
    });
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
