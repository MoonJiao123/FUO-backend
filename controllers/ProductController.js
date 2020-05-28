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
 *  On products delete - (DELETE) /product/delete/:store_id/:product_id
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
 * Return Values:
 *  -200 - OK
 *   The 200 status code  means that the request was received and understood and is being processed.
 *  -400 - Bad Request 
 *   A status code of 400 indicates that the server did not understand the request due to bad syntax.
 * 
 * Contributors: Yue Jiao, Yunning Yang
 */

const express = require('express')
const product = express.Router()
const cors = require('cors')
const item = require('../models/ProductModel.js')
//const store = require('../models/StoreModel.js')
const { Op } = require("sequelize");

product.use(cors())

//product upsert
product.post('/upsert/:store_id/:product_id', (req, res, next) => {
    console.error("img ");
    console.error("img "+req.body.product_img);//does not wokr
    //The update method updates multiple instances that match the where options.
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
    
    item.findOne(
        {
            //The where option is used to filter the query.
            where: {
                product_id: req.params.product_id
            }
        })
        .then(user => {
            if (!user) {
               
                item.create(userData)
                    .then(user => {
                        console.error("img "+req.body.product_img);
                        res.status(200).json({ message: req.body }) 
                    })
                    .catch(err => {
                        //res.send('error: ' + err)
                        res.status(400).json({ Error: 'Bad request!' }) /* Added by Shawn */
                    })
            } else {
                console.error("product already existed");
                item.update(userData, {//The where option is used to filter the query.
                    where: { product_id: req.params.product_id}
                })
                    .then(function (rowsUpdated) {
                        console.error("img in else "+req.body.product_img);
                        res.status(200).json(rowsUpdated)
                    })
            }
        })
        .catch(err => {
            console.error("some error");
            //res.send('error: ' + err)
            res.status(400).json({ Error: err }) /* Added by Shawn */
        })
})

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
            res.status(200).json({ status: user.product_name + 'Added coupon to db' })
        })
        .catch(err => {
            //res.send('error: ' + err)
            res.status(400).json({ error: err }) //Shawn
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
                store_id: req.params.store_id,
                //make sure the string we store are as correct date form since we are using string now
                expire_date: req.body.expire_date
            }
        })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//product delete
product.delete('/delete/:store_id/:product_id', (req, res, next) => {
    //The destroy method is use to delete selected instance
    item.destroy({
        where: {
            store_id: req.params.store_id,
            product_id: req.params.product_id
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//product delete for all items
product.delete('/deleteallproduct/:store_id', (req, res, next) => {
    //The destroy method is use to delete selected instance
    item.destroy({
        where: {store_id: req.params.store_id},
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//search by products belonging to a certain store
product.get('/printallproduct/:store_id', (req, res, next) => {
    //console.log("param "+req.params.store_id);
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    item.findAll({
        where: {
            store_id: req.params.store_id
        }
    })
        .then(function (rowsUpdated) {
            //console.log("in then");
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
    //console.log("after then");
})

//1-search by category
product.get('/:category', (req, res, next) => {
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    item.findAll({
        where: {
            category: req.params.category
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//2-search by category using price range filter
product.get('/:category/:low/:high', (req, res, next) => {
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    item.findAll({
        where: {
            category: req.params.category,
            price: {
                [Op.between]: [req.params.low, req.params.high]
            }
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//3-search by name in ascending price order
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
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//4-search by name using price range filter in ascending price order
product.get('/:name/price/asc/:low/:high', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            },
            price: {
                [Op.between]: [req.params.low, req.params.high]
            }
        },
        order: [
            ['price', 'ASC']
        ]

    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//5-search by name in descending price order
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
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//6-search by name using price range filter in descending price order
product.get('/:name/price/desc/:low/:high', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            },
            price: {
                [Op.between]: [req.params.low, req.params.high]
            }
        },
        order: [
            ['price', 'DESC']
        ]

    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//7-search by name in ascending expiration date order
product.get('/:name/expire/asc', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            },
            price: {
                [Op.between]: [req.params.low, req.params.high]
            }
        },
        order: [
            ['expire_date', 'ASC']
        ]

    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//8-search by name using price range filter in ascending expiration date order
product.get('/:name/expire/asc/:low/:high', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            },
            price: {
                [Op.between]: [req.params.low, req.params.high]
            }
        },
        order: [
            ['expire_date', 'ASC']
        ]

    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//9-search by name in descending expiration date order
product.get('/:name/expire/desc', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            },
            price: {
                [Op.between]: [req.params.low, req.params.high]
            }
        },
        order: [
            ['expire_date', 'DESC']
        ]

    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//10-search by name using price range filter in descending expiration date order
product.get('/:name/expire/desc/:low/:high', (req, res, next) => {
    item.findAll({
        where: {
            product_name: {
                [Op.like]: '%' + req.params.name + '%'
            },
            price: {
                [Op.between]: [req.params.low, req.params.high]
            }
        },
        order: [
            ['expire_date', 'DESC']
        ]

    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

module.exports = product
