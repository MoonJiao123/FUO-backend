/**
 * Description:
 * This file is to GET the requested data of print/search/select locations from the business user.
 * This file is to POST the requested data of adding locations from the business user.
 * This file is to DELETE the requested data of deleting locations from the business user.
 * 
 * Endpoints and Params:
 *   On page load - (GET) /business/printalllocation/:business_id
 *   On location search - (POST) /business/searchlocation/:business_id/:address
 *   On location select - (GET) /business/selectlocation/:business_id/:address
 *   On location add - (POST) /business/addlocation/:business_id/:address
 *   On location delete - (DELETE) /business/deletelocation/:business_id/:address
 * 
 * Parameters:
 *  -req: the request received via the POST request
 *  -res: the response the server will send back
 * 
 * Return Values:
 *  -200 - OK
 *   The 200 status code  means that the request was received and understood and is being processed.
 *  -400 - Bad Request 
 *   A status code of 400 indicates that the server did not understand the request due to bad syntax.
 * 
 * Contributors: Yue Jiao, Yunning Yang
 */

const express = require('express')
const sessions = require('express-session')
const Store = express.Router()
const cors = require('cors')
const store = require('../models/StoreModel.js')
const business = require('../models/BusinessModel')
const { Op } = require("sequelize");
var Sequelize = require('sequelize');
let nodeGeocoder = require('node-geocoder');
let options = { provider: 'openstreetmap' };
let geoCoder = nodeGeocoder(options);
var request = require('request');
Store.use(cors())

/* separate functions : printalllocation and numoflocation */
//01-endpoint for business name to be displayed in the dashboard
Store.get('/getbusinessname', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "business"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    business.findOne({
        attributes: ['name'],
        where: {
            business_id: req.session.userId,
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})
//02-print all locations of a business
Store.get('/printalllocation', (req, res, next) => {
    if(req.session.userType == null){
        res.status(400).json({error:'Session Is NULL!'});
        return;
    }
    if(req.session.userType != "business"){
        res.status(401).json({error:'Not equal to business'});
        console.log('printalllocation() - userType: ' + req.session.userType); 
        return;
    }

    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    store.findAll({
        attributes: ['store_name', 'address', 'store_id'],
        where: {
            business_id: req.session.userId,
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//03-print number of locations of a business
Store.get('/numoflocations', (req, res, next) => {
     //Verify that we have created a session previously
     if(req.session.userType == null || req.session.userType != "business"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    store.count({
        distinct: true,
        col: 'store_id',
        where: {
            business_id: req.session.userId,
        }
    })
        .then(function (count) {
            res.status(200).json(count)
        })
        .catch(next)
})

//04-location search
Store.get('/searchlocation/:address', (req, res, next) => {
    //Verify that we have created a session previously
    if(req.session.userType == null || req.session.userType != "business"){
        res.status(400).json({error:'Session was never created'});
        return;
    }

    store.findAll({
        where: {
            business_id: req.session.userId,
            address: {
                [Op.like]: '%' + req.params.address + '%'
            }
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
    /*TODO - No handling of case when there are no stores for a business id*/
})

//05-select location 
Store.get('/selectlocation/:address', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "business"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
     //Verify that we have created a session previously
    //Op = Sequelize.Op;
    store.findAll({
        where: {
            business_id: req.session.userId,
            address: req.params.address
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})


//06-add location with latitude and longitude
Store.post('/addlocation/:address/:name', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "business"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
    // var storelat;
    // var storelong;
    var reqaddress = req.params.address
    // //convert address to lat and long
    // geoCoder.geocode(reqaddress)
    //     .then((res) => {
    //         console.log(res);
    //         storelat = res[res.length - 1].latitude;
    //         storelong = res[res.length - 1].longitude
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    const userData = {
        address: req.params.address,
        business_id: req.session.userId,
        store_name: req.params.name
    }
    // console.log(storelat);
    // console.log(storelong);
    //The findOne method obtains the first entry it finds (that fulfills the optional query options, if provided
    store.findOne({
        //The where option is used to filter the query.
        where: {
            business_id: req.session.userId,
            address: req.params.address,
        }
    })
        //it generate its own token after it created the user
        .then(user => {
            if (!user) {
                //The create method uilds a new model instance and calls save on it.
                //it generate its own token after it created the user
                store.create(userData)
                geoCoder.geocode(reqaddress)
                    .then((res) => {
                        console.log(res);
                        store.update(
                            { store_lat: res[res.length - 1].latitude, store_long: res[res.length - 1].longitude },
                            {
                                where: {
                                    business_id: req.session.userId,
                                    address: req.params.address,
                                }
                            }
                        ).then(result =>
                            console.log("converted address to long and lat")
                        )
                            .error(err =>
                                handleError(err)
                            )
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                res.status(200).json({ status: 'Added item to business' })

            }
            else {
                res.status(400).json({ status: 'item already exists' })
            }
        })
        .catch(err => {
            //res.send('error: ' + err)
            res.status(400).json({ error: err }) //Shawn
        })
})

//07-delete location
Store.delete('/deletelocation/:store_id', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "business"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
    //The destroy method is use to delete selectec instance
    store.destroy({
        where: {
            business_id: req.session.userId,
            store_id: req.params.store_id
        }
    })
        .then(function (rowsUpdated) {
            // //delete product when delete the store
            // request('https://fuo-backend.herokuapp.com/deleteallproduct/req.params.store_id', function (error) {
            //     if (!error && response.statusCode == 200) {
            //         console.log("deleted all prodcut of store_id" + req.params.store_id)
            //     }
            // })
            res.status(200).json(rowsUpdated)
        })
        .catch(next)




})



module.exports = Store