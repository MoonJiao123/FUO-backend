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
 *  -200 - OK
 *   The 200 status code  means that the request was received and understood and is being processed.
 *  -400 - Bad Request 
 *   A status code of 400 indicates that the server did not understand the request due to bad syntax.
 * 
 * Contributors: Yue Jiao, Yunning Yang
 */
//21	Byrom	XY5GJIwLL	bbehninck0@seattletimes.com	17133 Sunfield Center	NULL	NULL
const express = require('express')
const Cart = express.Router()
const cors = require('cors')
const list = require('../models/CartModel.js')
const product = require('../models/ProductModel')
const store = require('../models/StoreModel')
const business = require('../models/BusinessModel')
const { Op } = require("sequelize");
const Sequelize = require('sequelize')
const { QueryTypes } = require('sequelize');
const db = require('../config/DB')
Cart.use(cors())

//show all products in the cart for a customer
Cart.get('/list/:customer_id', (req, res, next) => {     // Changed '/list/:customer_id' to /list'

    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    list.findAll({
        //The where option is used to filter the query.
        attributes: ['product_id'],
        where: {
            customer_id: req.params.customer_id
        },
        include: {
            model: product,
            as: 'product',
            where:{
                product_id: {[Op.col]: 'carts.product_id'}
            },
            include: {
                model: store,
                attributes: ['address'],
                as: 'store_product',
                include:  {model: business, attributes: ['name']} 
            }
        }
    })
            .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//add item to cart
Cart.post('/add/:customer_id', (req, res) => {
    //Verify that we have created a session previously
    // if(req.session.userType ==  null || req.session.userType != "customer"){
    //     res.status(400).json({error:'Please create sessions'});
    //     return;
    // }
    //check if product exist in product table
    product.findOne({ where: { product_id: req.body.product_id} })
    .then(product => {
        if (!product) {
            //The create method uilds a new model instance and calls save on it.
            //it generate its own token after it created the user
            res.status(400).json({ status: 'item does not exist' })

        }
        else{
            const userData = {
                //might delete amount and tootal price
                //amount: req.body.amount,
                //total_price: req.body.total_price,
                product_id: req.body.product_id,
                customer_id: req.params.customer_id
            }
            //The findOne method obtains the first entry it finds (that fulfills the optional query options, if provided
            list.findOne({
                where: {
                    product_id: req.body.product_id,
                    customer_id: req.params.customer_id
                }
            })
                //it generate its own token after it created the user
                .then(user => {
                    if (!user) {
                        //The create method uilds a new model instance and calls save on it.
                        //it generate its own token after it created the user
                        list.create(userData)
                        res.status(200).json({ status: 'Added item to cart' })
        
                    }
                    else{
                        res.status(400).json({ status: 'item already exists' })
                    }
                })
                .catch(err => {
                    //res.send('error: ' + err)
                    res.status(400).json({ error: err }) //Shawn
                })
        }
    })
    .catch(err => {
        //res.send('error: ' + err)
        res.status(400).json({ error: err }) //Shawn
    })
})

// //delete item from cart
Cart.delete('/delete/:customer_id/:product_id', (req, res, next) => {
    //Verify that we have created a session previously
    // if(req.session.userType ==  null || req.session.userType != "customer"){
    //     res.status(400).json({error:'Session was never created'});
    //     return;
    // }
    //The destroy method is use to delete selectec instance
    list.destroy({
        where: {
            product_id: req.params.product_id,
            customer_id: req.params.customer_id
        }
    })
        .then(function (rowsUpdated) {
             //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    list.findAll({
        //The where option is used to filter the query.
        attributes: ['product_id'],
        where: {
            customer_id: req.params.customer_id
        },
        include: {
            model: product,
            as: 'product',
            where:{
                product_id: {[Op.col]: 'carts.product_id'}
            },
            include: {
                model: store,
                attributes: ['address'],
                as: 'store_product',
                include:  {model: business, attributes: ['name']} 
            }
        }
    })
            .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
        })
        .catch(next)
})

//clear all items from cart
Cart.delete('/delete/:customer_id', (req, res, next) => {
    
    // if(req.session.userType ==  null || req.session.userType != "customer"){
    //     res.status(400).json({error:'Session was never created'});
    //     return;
    // }

    list.destroy({
        where: {
            customer_id: req.params.customer_id
        }
    })
        .then(function (rowsUpdated) {
             //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    list.findAll({
        //The where option is used to filter the query.
        attributes: ['product_id'],
        where: {
            customer_id: req.params.customer_id
        },
        include: {
            model: product,
            as: 'product',
            where:{
                product_id: {[Op.col]: 'carts.product_id'}
            },
            include: {
                model: store,
                attributes: ['address'],
                as: 'store_product',
                include:  {model: business, attributes: ['name']} 
            }
        }
    })
            .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
        })
        .catch(next)
})

module.exports = Cart