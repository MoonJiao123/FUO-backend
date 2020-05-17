/**
 * Description:
 * This file is to GET the requested data of searching from the business user by the following sorting.
 *  -price: from high to low
 *  -price: from low to high
 *  -expiration date: from close to far
 *  -expiration date: from far to close
 * This file is to POST the requested data of uploading items from the business user.
 * This file is to PUT the requested data of updating items from the business user.
 * This file is to DELETE the requested data of deleting locations from the business user.
 * 
 * Endpoints and Params:
 *  On products upload - (POST) /product/upload/:store_id
 *  On products update - (PUT) /product/update/:store_id
 *  On products delete - (DELETE) /product/delete/:store_id/:item_id
 *  On item search - (GET) /product/category
 *                 - (GET) /product/:name/price/asc
 *                 - (GET) /product/:name/price/desc
 *                 - (GET) /product/:name/expire/asc
 *                 - (GET) /product/:name/expire/desc
 * 
 * Parameters:
 *  -req: the request received via the POST request
 *  -res: the response the server will send back
 * 
 * Contributors: Yue Jiao, Yunning Yang
 */

const express = require('express')
const product = express.Router()
const cors = require('cors')
const item = require('../models/ProductModel.js')
const { Op } = require("sequelize");
product.use(cors())


//product upload
product.post('/upload/:store_id', (req, res) => {
    const userData = {
        product_name: req.body.product_name,
        product_img: req.body.product_img,
        category: req.body.category,
        price: req.body.price,
        expire_date: req.body.expire_date,
        stock_amount: req.body.stock_amount,
        coupon: req.body.coupon,
        store_id: req.params.store_id
    }
    //The create method uilds a new model instance and calls save on it.
    //it generate its own token after it created the user
    item.create(userData)
        .then(user => {
            res.json({ status: user.product_name + 'Added coupon to db' })
        })
        .catch(err => {
            res.send('error: ' + err)
            res.status(400).jason({ error: err }) //Shawn
        })
})

//product update
product.put('/update/:store_id', (req, res, next) => {
    //The update method updates multiple instances that match the where options.
    item.update(
        {
            product_name: req.body.product_name,
            product_img: req.body.product_img,
            category: req.body.category,
            price: req.body.price,
            expire_date: req.body.expire_date,
            stock_amount: req.body.stock_amount,
            coupon: req.body.coupon,
            store_id: req.params.store_id
        },
        {
            //The where option is used to filter the query.
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

//product delete
product.delete('/delete/:store_id/:item_id', (req, res, next) => {
    //The destroy method is use to delete selectec instance
    item.destroy({
        where: {
            store_id: req.params.store_id,
            item_id: req.params.item_id
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

//search by category
product.get('/category', (req, res, next) => {
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    item.findAll({
        where: {
            category: req.params.category
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

//search by name using like functionality
product.get('/:name/price/asc', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            }
        },
        order: [
            ['price', 'ASC']
        ]

    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

//search by name using like functionality
product.get('/:name/price/desc', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            }
        },
        order: [
            ['price', 'DESC']
        ]

    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

//search by name using like functionality
product.get('/:name/expire/desc', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            }
        },
        order: [
            ['expire_date', 'DESC']
        ]

    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})
//search by name using like functionality
product.get('/:name/expire/asc', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            }
        },
        order: [
            ['expire_date', 'ASC']
        ]

    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})


module.exports = product
