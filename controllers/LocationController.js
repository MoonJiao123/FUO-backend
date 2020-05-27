const express = require('express')
const Location = express.Router()
const cors = require('cors')
const location = require('../models/StoreModel.js')
const product = require('../models/ProductModel.js')
const customer = require('../models/CustomerModel.js')
var nodeGeocoder = require('node-geocoder');
var options = {provider: 'openstreetmap'};
var geoCoder = nodeGeocoder(options);

Location.use(cors())

//location of nearby store
Location.post('/getnearbystore/:customer_id/:address', (req, res) => {

    //convert address to long and lat
    geoCoder.geocode(req.params.address)
    .then((res)=> {
      console.log(res);
      //update customer long and lat
      var customerlat = res[res.length - 1].latitude
      var customerlong = res[res.length - 1].longitude
      console.log(customerlat);
      console.log(customerlong);
      console.log(typeof customerlat);
      customer.update(
        { customer_lat: customerlat,customer_long: customerlong },
        { where: { customer_id: req.params.customer_id } }
      ).then(result =>
        console.log("converted address to long and lat")
      )
      .error(err =>
        handleError(err)
      )

    })
    .catch((err)=> {
      console.log(err);
    });

    //save long and lat to database
    // location.findAll({
    //     where: {
    //         address: req.body.address
    //     }
    // })
    //     .then(function (rowsUpdated) {
    //         //console.log("in then");
    //         res.status(200).json(rowsUpdated)
    //     })
    //     .catch(next)
})

module.exports = Location