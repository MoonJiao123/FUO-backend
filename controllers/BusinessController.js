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
//location search
Store.get('/:address', (req, res, next) => {
    console.log(req.params.address);
    //Op = Sequelize.Op;
    store.findAll({
        where: {
            address: { 
                [Op.like]: req.params.address+'%'
            }
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})
module.exports = Store