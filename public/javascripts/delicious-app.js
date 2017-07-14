import '../sass/style.scss';

import { $, $$ } from './modules/bling';
//import googleMaps from './modules/googleMaps';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';

autocomplete( $('#address'), $('#lat'), $('#lng') );//Google maps does lat and lng the right way & MongoDb does it opposite
//Not jQuery, this is bling.js shorthand for doc.querySelectorAll, etc....
//

typeAhead( $('.search') );

makeMap( $('#map') ); //use bling.js to makeMap an id of map

const heartForms = $$('form.heart'); //"$$" is 'bling' shorthand for 'querySelectorAll'
heartForms.on('submit', ajaxHeart);
