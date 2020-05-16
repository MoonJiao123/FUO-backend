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
Cart.get('/list/:id', (req, res, next) => {
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
Cart.post('/addtocart', (req, res) => {
    const userData = {
        amount: req.body.amount,
        total_price: req.body.total_price,
        product_id: req.body.product_id,
        customerCustomer_id: req.body.customerCustomer_id
    }

    //it generate its own token after it created the user
    list.create(userData)
        .then(user => {
            res.json({ status: user.product_name + 'Added item to cart' })
        })
        .catch(err => {
            res.send('error: ' + err)
            //res.status(400).jason({ error: err }) //Shawn
        })
})

//delete item from cart
Cart.delete('/delete/:id', (req, res, next) => {
    list.findOne({
        where: {
            product_id: req.params.product_id
        }
    })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch(next)
})

module.exports = Cart