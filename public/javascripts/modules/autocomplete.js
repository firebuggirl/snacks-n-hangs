
//import googleMaps from './googleMaps'; //code from student on Node Slack

function autocomplete(input, latInput, lngInput) {
  if(!input) return; // skip this fn from running if there is not input on the page
  const dropdown = new google.maps.places.Autocomplete(input);//part of Google API

  dropdown.addListener('place_changed', () => {//addListener is a Google maps way to add an event listener
    const place = dropdown.getPlace();
    console.log(place);
   latInput.value = place.geometry.location.lat();//get geometry.location path from console.log in dev tools object
   lngInput.value = place.geometry.location.lng();

  });
  // if someone hits enter on the address field, don't submit the form
  input.on('keydown', (e) => {//use .on() instead of .addEventListener() because we're using 'bling' shortcode
    if (e.keyCode === 13) e.preventDefault();
  });
}

export default autocomplete;
