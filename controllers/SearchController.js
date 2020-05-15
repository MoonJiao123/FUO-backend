/**
 * This file is to get the requested data of Search information from the customer users
 * 
 * Contributors: Yue Jiao, Yunning Yang
 */

const express = require('express')
const search = express.Router()
const cors = require('cors')
const query = require('../models/ProductModel.js')
search.use(cors())

 //search
search.get('/:category', (req, res, next) => {
    query.findAll({
        where: {
            category: req.params.category
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

module.exports = search
