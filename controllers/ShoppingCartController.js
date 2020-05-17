/**
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
    list.findAll({
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
    list.findOne({
        where: {
            product_id: req.params.product_id,
            customer_id: req.params.customer_id
        }
    })
        //it generate its own token after it created the user
        .then(user => {
            if (!user) {
                list.create(userData)
                res.json({ status:  'Added item to cart' })

            }
            res.json({ status:  'item already exists' })
        })
        .catch(err => {
            res.send('error: ' + err)
            res.status(400).jason({ error: err }) //Shawn
        })
})

//delete item from cart
Cart.delete('/delete/:customer_id/:product_id', (req, res, next) => {
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