let nodeGeocoder = require('node-geocoder');
 
let options = {
  provider: 'openstreetmap'
};
 
let geoCoder = nodeGeocoder(options);
geoCoder.geocode('Luray Caverns')
  .then((res)=> {
    console.log(res);
  })
  .catch((err)=> {
    console.log(err);
  });
  
// class Locator {
//     constructor() {

//     }
    
//     funtion addressToLatLong(address) {
//         var geocoder = new google.maps.Geocoder();
//         var address = "new york";

//         geocoder.geocode({ 'address': address }, function (results, status) {

//             if (status == google.maps.GeocoderStatus.OK) {
//                 var latitude = results[0].geometry.location.lat();
//                 var longitude = results[0].geometry.location.lng();
//                 alert(latitude);
//             }
//         });
//     }
// }

module.exports = new Locator(); 