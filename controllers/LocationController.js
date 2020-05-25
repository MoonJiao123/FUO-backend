const express = require('express')
const Location = express.Router()
const cors = require('cors')
const location = require('../models/StoreModel.js')
const customer = require('../models/CustomerModel.js')
const geolib = require('geolib');

Location.use(cors())

//location of nearby store
Location.post('/getnearbystore/:long/:lat', (req, res) => {
 
    location.findAll({
        where: {
            address: req.body.address
        }
    })
        .then(function (rowsUpdated) {
            //console.log("in then");
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

module.exports = Location