import axios from 'axios'; //library for fetching AJAX
import { $ } from './bling'; //JS shortcuts

const mapOptions = {//see Gooogle Maps docs for more options
  center: { lat: 43.2, lng: -79.8 },
  zoom: 10
};

//instead of default coordinates can use navigator.geolocation.getCurrentPosition instead tutorial @ javascript30.com ...day 21 tutorial
function loadPlaces(map, lat = 43.2, lng = -79.8) { //default coordinates
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`) //hitting our own api and bringing back data
    .then(res => {
      const places = res.data;
      //console.log(places);
      if (!places.length) {
        alert('no places found!');
        return;
      }
      // create a bounds
      const bounds = new google.maps.LatLngBounds();//zoom in to where markers are
      const infoWindow = new google.maps.InfoWindow();//create Google info window

      const markers = places.map(place => {//map over places array and return a makrker for each
        const [placeLng, placeLat] = place.location.coordinates;// MongoDB is lng/lat
        console.log(placeLng, placeLat);
        const position = { lat: placeLat, lng: placeLng };//Google maps is lat/long
        bounds.extend(position);//zoom in to where markers are and zoom in as far as we can go and extend 'bounds'/area to include allall markers
        const marker = new google.maps.Marker({ map, position });//create marker
        marker.place = place;//attach place data to marker
        return marker;
      });
       //console.log(markers);
      // when someone clicks on a marker, show the details of that place
      markers.forEach(marker => marker.addListener('click', function() {//'addListener' = GoogleMaps version of addEventListener
        console.log(this.place);
        const html = `
          <div class="popup">
            <a href="/store/${this.place.slug}">
              <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}" />
              <p>${this.place.name} - ${this.place.location.address}</p>
            </a>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));

      // then zoom the map to fit all the markers perfectly
      map.setCenter(bounds.getCenter());//bounds is like a rectangle around all of our markers
      map.fitBounds(bounds);
    });

}

function makeMap(mapDiv) {//run makeMap on page load
  if (!mapDiv) return;
  // make our map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);//then run loadPlaces

  const input = $('[name="geolocate"]');//"$" is JS shorthand syntax imported from 'bling'
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => { //load new locations when user types diff location
    const place = autocomplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  });
}

export default makeMap;
