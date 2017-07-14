
const initMap = (lat, lng, scrollwheel=true) => {
  const coordinates = {lat: lat, lng: lng};

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    scrollwheel: scrollwheel,
    zoom: 15
  });

  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    map: map,
    position: coordinates,
    title: 'Hello World!'
  });
};

export default initMap;
