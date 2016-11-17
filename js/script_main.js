var app = angular.module("wrapper", []);
app.controller("control", function ($scope, $timeout) {
    var map;
    var infowindow;
    var pyrmont;
    $scope.mapPlaces = [];
    var maptype = 'restaurant';
    $scope.maptype = maptype;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Not Supported");
    }

    $scope.changetype = function(val) {
      maptype = val;
      $scope.mapPlaces = [];
      $scope.maptype = maptype;
      initMap();
    }

    function showPosition(position) {
      //alert(position.coords.latitude + " " + position.coords.longitude);
      pyrmont = {lat: position.coords.latitude, lng: position.coords.longitude};
      initMap();
    }

    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 13
      });

      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: pyrmont,
        radius: 5000,
        type: [maptype]
      }, callback);
    }

    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }

    function createMarker(place) {
      $timeout(function() {
        $scope.mapPlaces.push(place.name);
      });
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        console.log(marker);
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    }
});