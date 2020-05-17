/**
 * This file is to get the requested data of Uploading information from the business
 * This file also generate barcode when business user input their discount
 * 
 * Contributors: Yue Jiao, Yunning Yang
 */

const express = require('express')
const Store = express.Router()
const cors = require('cors')
const store = require('../models/StoreModel.js')
const { Op } = require("sequelize");
Store.use(cors())

//print all locations of a business
Store.get('/printalllocation/:business_id', (req, res, next) => {
    store.findAll({
        where: {
            business_id: req.params.business_id,
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
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
                [Op.like]: '%'+req.params.address+'%'
            }
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
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
            res.json(rowsUpdated)
        })
        .catch(next)
})
//add location 
Store.post('/addlocation/:business_id/:address', (req, res, next) => {
    const userData = {
        address: req.params.address,
        business_id: req.params.business_id
    }
    store.findOne({
        where: {
            business_id: req.params.business_id,
            address: req.params.address,
        }
    })
        //it generate its own token after it created the user
        .then(user => {
            if (!user) {
                store.create(userData)
                res.json({ status:  'Added item to cart' })

            }
            res.json({ status:  'item already exists' })
        })
        .catch(err => {
            res.send('error: ' + err)
            res.status(400).jason({ error: err }) //Shawn
        })
})

//delete location
Store.delete('/deletelocation/:business_id/:address', (req, res, next) => {
    store.destroy({
        where: {
            business_id: req.params.business_id,
            address: req.params.address
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

module.exports = Store