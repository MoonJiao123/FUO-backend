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
const Store = express.Router()
const cors = require('cors')
const store = require('../models/StoreModel.js')
const { Op } = require("sequelize");

var Sequelize = require('sequelize');

Store.use(cors())

/* separate functions : printalllocation and numoflocation */

//print all locations of a business
Store.get('/printalllocation/:business_id', (req, res, next) => {
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    store.findAll({
        attributes: ['store_name','address'],
        where: {
            business_id: req.params.business_id,
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//print number of locations of a business
Store.get('/numoflocations/:business_id', (req, res, next) => {
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    store.count({
        distinct: true,
        col: 'store_id',
        where: {
            business_id: req.params.business_id,
        }
    })
        .then(function (count) {
            res.status(200).json(count)
        })
        .catch(next)
})

//location search
Store.get('/searchlocation/:business_id/:address', (req, res, next) => {
    //Op = Sequelize.Op;
    store.findAll({
        where: {
            business_id: req.params.business_id,
            address: {
                [Op.like]: '%' + req.params.address + '%'
            }
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//select location 
Store.get('/selectlocation/:business_id/:address', (req, res, next) => {
    //Op = Sequelize.Op;
    store.findAll({
        where: {
            business_id: req.params.business_id,
            address: req.params.address
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//add location 
Store.post('/addlocation/:business_id/:address/:name', (req, res, next) => {
    const userData = {
        address: req.params.address,
        business_id: req.params.business_id,
        store_name: req.params.name
    }
    //The findOne method obtains the first entry it finds (that fulfills the optional query options, if provided
    store.findOne({
        //The where option is used to filter the query.
        where: {
            business_id: req.params.business_id,
            address: req.params.address,
        }
    })
        //it generate its own token after it created the user
        .then(user => {
            if (!user) {
                //The create method uilds a new model instance and calls save on it.
                //it generate its own token after it created the user
                store.create(userData)
                res.status(200).json({ status: 'Added item to business' })

            }
            res.status(400).json({ status: 'item already exists' })
        })
        .catch(err => {
            //res.send('error: ' + err)
            res.status(400).json({ error: err }) //Shawn
        })
})

//delete location
Store.delete('/deletelocation/:business_id/:address', (req, res, next) => {
    //The destroy method is use to delete selectec instance
    store.destroy({
        where: {
            business_id: req.params.business_id,
            address: req.params.address
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

module.exports = Store