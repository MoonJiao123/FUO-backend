/**
 * This file is to get the requested data of Uploading information from the business
 * This file also generate barcode when business user input their discount
 * 
 * Contributors: Yue Jiao, Yunning Yang
 */
const express = require('express')
const product = express.Router()
const cors = require('cors')
const item = require('../models/ProductModel.js')
product.use(cors())
product.post('/upload', (req, res) => {
    console.log(req.body.coupon);
    const userData = {
        product_name: req.body.product_name,
        product_img: req.body.product_img,
        category: req.body.category,
        price: req.body.price,
        expire_date: req.body.expire_date,
        stock_amount: req.body.stock_amount,
        coupon: req.body.coupon,
        store_id: req.body.store_id
    }
    //it generate its own token after it created the user
    item.create(userData)
        .then(user => {
            res.json({ status: user.product_name + 'Added coupon to db' })
        })
        .catch(err => {
            res.send('error: ' + err)
            res.status(400).jason({error: err}) //Shawn
        })
})

//update
product.put('/update', (req, res, next) => {
    item.update(
        {
            product_name: req.body.product_name,
            product_img: req.body.product_img,
            category: req.body.category,
            price: req.body.price,
            expire_date: req.body.expire_date,
            stock_amount: req.body.stock_amount,
            coupon: req.body.coupon,
            store_id: req.body.store_id
        },
        {
            where: {
                product_name: req.body.product_name,
                store_id: req.body.store_id,
                //make sure the string we store are as correct date form since we are using string now
                expire_date: req.body.expire_date
            }
        })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

//search
product.get('/search/{:category}', (req, res, next) => {
    item.findAll({
        where: {
            category: req.body.category
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})
module.exports = product
