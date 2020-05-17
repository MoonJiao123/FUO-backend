/**
 * Description:
 * This file is to GET the requested data of showing all items on the list from the customer user 
 * This file is to POST the requested data of adding items from the customer user.
 * This file is to DELETE the requested data of deleting items from the customer user.
 * 
 * Endpoints and Params:
 *   On coupon/item add - (POST) /cart/add/:customer_id/:product_id
 *   On coupon/item remove - (DELETE) /cart/delete/:customer_id/:product_id
 *   On shopping list clear - (DELETE) /cart/delete/:customer_id
 * 
 * Parameters:
 *  -req: the request received via the POST request
 *  -res: the response the server will send back
 * 
 * Return Values:
 *  -400 - Bad Request 
 *   A status code of 400 indicates that the server did not understand the request due to bad syntax.
 * 
 * Contributors: Yue Jiao, Yunning Yang
 */

const express = require('express')
const Cart = express.Router()
const cors = require('cors')
const list = require('../models/CartModel.js')
const { Op } = require("sequelize");
Cart.use(cors())

//show all products in the cart for a customer
Cart.get('/list/:customer_id', (req, res, next) => {
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    list.findAll({
        //The where option is used to filter the query.
        where: {
            customer_id: req.params.id
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

//add item to cart
Cart.post('/add/:customer_id/:product_id', (req, res) => {
    const userData = {
        //might delete amount and tootal price
        //amount: req.body.amount,
        //total_price: req.body.total_price,
        product_id: req.params.product_id,
        customer_id: req.params.customer_id
    }
    //The findOne method obtains the first entry it finds (that fulfills the optional query options, if provided
    list.findOne({
        where: {
            product_id: req.params.product_id,
            customer_id: req.params.customer_id
        }
    })
        //it generate its own token after it created the user
        .then(user => {
            if (!user) {
                //The create method uilds a new model instance and calls save on it.
                //it generate its own token after it created the user
                list.create(userData)
                res.json({ status: 'Added item to cart' })

            }
            res.json({ status: 'item already exists' })
        })
        .catch(err => {
            res.send('error: ' + err)
            res.status(400).jason({ error: err }) //Shawn
        })
})

//delete item from cart
Cart.delete('/delete/:customer_id/:product_id', (req, res, next) => {
    //The destroy method is use to delete selectec instance
    list.destroy({
        where: {
            product_id: req.params.product_id,
            customer_id: req.params.customer_id
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

//clear all items from cart
Cart.delete('/delete/:customer_id', (req, res, next) => {
    list.destroy({
        where: {
            customer_id: req.params.customer_id
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

module.exports = Cart