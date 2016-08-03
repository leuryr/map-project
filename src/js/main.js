function initMap() {
    var map;
    var yankeeStadium = {lat: 40.829622, lng: -73.926173};
    var map = new google.maps.Map(document.getElementById('map'), {
        center: yankeeStadium,
        zoom: 15
    });

    var marker = new google.maps.Marker({
    position: yankeeStadium,
    map: map,
    title: 'Yankee Stadium'
    });

    map.addListener('bounds_changed', function() {
        map.panTo(marker.getPosition());
    });
};
