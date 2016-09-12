var Model = [
    {
        name:"Yankee Stadium",
        location:{lat: 40.829622, lng: -73.926173},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: "1 E 161st St, Bronx NY"
    },
    {
        name:"The Bronx Museum of the Arts",
        location:{lat: 40.831011, lng: -73.919719},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: "1040 Grand Concourse, Bronx NY"
    },
    {
        name:"Concourse Plaza",
        location:{lat: 40.825227, lng: -73.920491},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: "220 E 161st St, Bronx NY"
    },
    {
        name:"Bronx County Family Court",
        location:{lat: 40.826746, lng: -73.920696},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: "900 Sheridan Ave, Bronx NY"
    },
    {
        name:"Bronx County Hall of Justice",
        location:{lat: 40.826102, lng: -73.919612},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: "265 E 161st St, Bronx NY"},
    {
        name:"Bronx Supreme Court",
        location:{lat: 40.826173, lng: -73.923834},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: "851 Grand Concourse #111, Bronx NY"
    },
    {
        name:"Heritage Field",
        location:{lat: 40.827023, lng: -73.927761},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: ", Bronx NY"
    },
    {
        name:"Joseph Yancey Track and Field",
        location:{lat: 40.828025, lng: -73.929016},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: ", Bronx NY"
    },
    {
        name:"Joyce Kilmer Park",
        location:{lat: 40.828522, lng: -73.922673},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: "Walton Ave, Bronx NY"
    },
    {
        name:"Mullaly Park",
        location:{lat: 40.833092, lng: -73.924046},
        visible: ko.observable(true),
        active: ko.observable(false),
        address: "Jerome Ave, Bronx NY"
    }
];
// This function initializes the Google map, and the Knockout bidings,
// running the ViewModel in the proccess.
var initApp = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.828522, lng: -73.922673},
        zoom: 16,
        mapTypeControl: false
    });
    ko.applyBindings(new ViewModel());
};
// When the Google Maps call returns an error, this function runs,
// and alerts the user.
var mapFail = function() {
    alert('Google Maps could not load at this time. Please try again later.');
};
var ViewModel = function() {
    var self = this;
    // Create an observable array, and store hardcoded Model locations.
    self.locations = ko.observableArray(Model);
    // Create an onservable for the selected filter text value.
    self.listFilter = ko.observable();
    // Using Knockout's .subscribe, we're able to watch the user changes to
    // listFilter, and perform actions when a change occurs.
    self.listFilter.subscribe(function(newValue) {
        // Create a variable of lowercase characters from user input,
        // to be compared to the each of the locations names.
        var simpleValue = newValue.toLowerCase();
        self.locations().forEach(function(item) {
            // For each location item, if the characters the user enters matches
            // its name, we keep the marker and list item visible.
            if(item.name.toLowerCase().indexOf(simpleValue) >= 0) {
                item.visible(true);
                item.marker.setVisible(true);
            } else {
                // If not, we make disappear the list item and marker.
                item.visible(false);
                item.marker.setVisible(false);
                // Additionally if the infoWindow is currently open for a location item
                // that disappears, we also close its infoWindow, and remove its list item's
                // "active" class.
                if((item.marker == infoWindowService.marker) && (item.marker.visible === false)){
                    infoWindowService.close();
                    infoWindowService.marker = null;
                    self.removeActiveStatus(item);
                }
            }
        });
    });
    // Set up variable for call to Google's infoWindow service.
    var infoWindowService = new google.maps.InfoWindow();
    // Create a function that fills in and opens the infoWindow
    // using the location properties. The item parameter represents
    // a specific location object.
    self.fillInfoWindow = function(item, infoWindow) {
        // Check to see if there is an infoWindow currently open on
        // this item's marker.
        if(infoWindow.marker != item.marker) {
            var firstLine, secondLine;
            infoWindow.marker = item.marker;
            // If the item has an id property, it means that it has been
            // filled with Foursquare data, and we can proceed to use that data
            // to set the infoWindow content.
            if(item.hasOwnProperty('id')) {
                firstLine = item.location.formattedAddress[0];
                secondLine = item.location.formattedAddress[1];
                infoWindow.setContent('<div>' + '<h3 class="infoWindow-title">' + item.name + '</h3>' + '<hr>' + '<br>' + firstLine + '<br>' + secondLine);
                // Some locations do not have phone data, so we check to see if
                // that data is available inside the item object before adding it to
                //the infoWindow.
                if (item.contact.hasOwnProperty('formattedPhone')){
                    var phone = item.contact.formattedPhone;
                    infoWindow.setContent(infoWindow.content + '<br>' + '<br>' + phone);
                }
                // Use the attribution image provided by Foursquare to give them credit
                // for the data received.
                infoWindow.setContent(infoWindow.content + '<img class="foursquare-attrib" src="img/powered-by-foursquare.svg" alt="Powered by Foursquare"/>' + '</div>');
            } else {
                // If the id property is not present, Foursquare data could not be
                // fetched, and we instead fill the infoWindow with the harcoded location data.
                var address = item.address;
                firstLine = address.substring(0,address.indexOf(","));
                secondLine = "Bronx, NY";
                infoWindow.setContent('<div>' + item.name + '<hr>' + '<br>' + firstLine + '<br>' + secondLine + '</div>');
            }
            // After the content has been set, we open the infoWindow to display
            // the information to the user.
            infoWindow.open(map, item.marker);
            // Add a listener to the closeclick event, so that when an infoWindow
            // is closed, it loses its affiliation with the item's marker. Also assure
            // the item is no longer displayed as active in the list view.
            infoWindow.addListener('closeclick', function() {
              infoWindow.marker = null;
              self.removeActiveStatus(item);
            });
        }
    };
    // This function creates map markers from an observable array of locations.
    self.createMarkers = function(array) {
        array().forEach(function(item) {
            // Check to see if location item already has a marker.
            if (!(item.hasOwnProperty('marker'))) {
                var position = item.location;
                var title = item.name;

                var marker = new google.maps.Marker({
                    position: position,
                    title: title,
                    map: map,
                    animation: google.maps.Animation.DROP
                });
                // Add a click listener to the marker, so that it animates the
                // marker, and fills and opens an infoWindow with its location item's
                // data.
                marker.addListener('click', function() {
                    self.animateMarker(this);
                    self.fillInfoWindow(item, infoWindowService);
                });
                // Sets this item's marker equal to marker we just created.
                item.marker = marker;
            }
        });
    };
    // This function sets the initial value of the visible property
    // for a location to true.
    self.initVisibility = function(item) {
        item.visible = ko.observable(true);
    };
    // This function sets the initial value of the active property
    // for a location to false.
    self.initStatus = function(item) {
        item.active = ko.observable(false);
    };
    // Create variables for use with Foursquare request URLs.
    var fsClientID = "HKK50PCWV51XRJQUJAF4UEQGULLAFOWIOVWOBYLJZFTP4FTF";
    var fsClientSecret = "LUCLK3BPYXTO3Q25GBSH0FSH3RSIKL0HS1O2BMALNYII2VMD";
    var fsVersion = 20160909;
    var fsSearchCenter = 40.828522 + "," + -73.922673;
    var fsRadius = 500;
    //This function iterates through the harcoded locations, and uses the Foursquare search feature
    // to find additional data.
    self.findInfoLocation = function() {
        self.locations().forEach(function(item) {
            // This variable allows us to use each item's specific coordinates in each search request.
            var fsSearchCenter = item.location.lat + "," + item.location.lng;
            var fsURL = "https://api.foursquare.com/v2/venues/search?client_id="+fsClientID+"&client_secret="+fsClientSecret+"&v="+fsVersion+"&ll="+fsSearchCenter+"&query="+item.name+"&address="+item.address+"&limit=1";
            $.getJSON(fsURL,function(results){
                var venues = results.response.venues[0];
                // After getting the results of the request, we take each property in the venues
                // object, and add it to it's corresponding harcoded location object.
                for (var property in venues) {
                    if(venues.hasOwnProperty(property)) {
                        item[property] = results.response.venues[0][property];
                    }
                }
            })
            // Whether we're able to retreive the Foursquare data or not, we want to be sure that
            // the markers for our hardcoded locations get created.
            .always(function() {
                self.createMarkers(self.locations);
            });
        });
    };
    self.findInfoLocation();
    var fsSection = "food";
    var fsURL = "https://api.foursquare.com/v2/venues/explore?client_id="+fsClientID+"&client_secret="+fsClientSecret+"&v="+fsVersion+"&ll="+fsSearchCenter+"&radius="+fsRadius+"&section="+fsSection+"&limit=20";
    $.ajax({
        url: fsURL,
        dataType: "json",
        success: function(results) {
            // Our success callback takes each of the venue properties from our request response, and
            // pushes them to our locations observable, after setting their initial visible and active
            // properties.
            results.response.groups[0].items.forEach(function(item) {
                self.initVisibility(item.venue);
                self.initStatus(item.venue);
                self.locations.push(item.venue);
            });
            // After the data has been pushed, we iterate through the new data with this function,
            // and create markers for them.
            self.createMarkers(self.locations);
        },
        error: function(result) {
            // In order to properly notify the user of what error they're experiecing,
            // we check the errorType sent in the response against the possible error messages
            // from Foursquare's Responses & Errors page (https://developer.foursquare.com/overview/responses),
            // and display a corresponding description in the alert.
            var errorType = result.responseJSON.meta.errorType;
            var description;
            if(errorType == 'invalid_auth' || 'param_error' || 'endpoint_error') {
                description = 'Something wrong with request. Please contact site administrator.';
            } else if(errorType == 'rate_limit_exceeded') {
                description = 'Number of requests has exceeded limit. Please try again later.';
            } else if(errorType == 'server_error') {
                description = 'Foursquare server is experiencing issues. Please try again later.';
            } else {
                description = 'Some error has occurred. Please contact site administrator.';
            }
            alert('Could not retrieve Foursquare data.\n' + description);
        }
    });
    // This function gets the marker from the location object
    // and passes it into the animateMarker function.
    self.getMarker = function(object) {
        var marker = object.marker;
        self.animateMarker(marker);
    };
    // This function gets the infoWindow for the location object
    // by passing in the location to the fillInfoWindow function.
    self.getInfoWindow = function(object) {
        self.fillInfoWindow(object, infoWindowService);
    };
    // This function runs when a list item is clicked in order to trigger
    // Knockout to add the "active" CSS class to it.
    self.activate = function(object) {
        object.active(true);
        self.locations().forEach(function(item) {
            if(item != object) {
                self.removeActiveStatus(item);
            }
        });
    };
    // This function sets the location object's active property
    // to false, triggering Knockout to remove its list item's
    // "active" CSS class.
    self.removeActiveStatus = function(object) {
        object.active(false);
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
    var menuIcon = $('.menu-icon');
    // This shows and hides the list menu.
    self.toggleMenu = function() {
        listContainer.toggleClass("open-menu");
        menuIcon.toggleClass("slide-icon");
    };
};
