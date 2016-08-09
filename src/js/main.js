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
    ViewModel();
    ko.applyBindings(new ViewModel());
};

var ViewModel = function() {
    locations = ko.observableArray(Model);
    locations().forEach(function(item) {
        var position = item.location;
        var title = item.title;

        marker = new google.maps.Marker({
            position: position,
            title: title,
            map: map
        });
        item.marker = marker;
    });
}
