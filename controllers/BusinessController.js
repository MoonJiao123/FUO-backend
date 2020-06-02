/**
 * Description:
 * This file is to GET the requested data of print/search/select locations from the business user.
 * This file is to POST the requested data of adding locations from the business user.
 * This file is to DELETE the requested data of deleting locations from the business user.
 * 
 * Endpoints and Params:
 *   On page load - (GET) /business/printalllocation/:business_id
 *   On location search - (POST) /business/searchlocation/:business_id/:address
 *   On location select - (GET) /business/selectlocation/:business_id/:address
 *   On location add - (POST) /business/addlocation/:business_id/:address
 *   On location delete - (DELETE) /business/deletelocation/:business_id/:address
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
const sessions = require('express-session')
const Store = express.Router()
const cors = require('cors')
const store = require('../models/StoreModel.js')
const item = require('../models/ProductModel.js')
const cart = require('../models/CartModel.js')
const business = require('../models/BusinessModel')
const { Op } = require("sequelize");
var Sequelize = require('sequelize');
let nodeGeocoder = require('node-geocoder');
let options = { provider: 'openstreetmap' };
let geoCoder = nodeGeocoder(options);
var request = require('request');
Store.use(cors())

/* separate functions : printalllocation and numoflocation */
//01-endpoint for business name to be displayed in the dashboard
Store.get('/getbusinessname/:business_id', (req, res, next) => {
    // if(req.session.userType == null || req.session.userType != "business"){
    //     res.status(400).json({error:'Session was never created'});
    //     return;
    // }
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    business.findOne({
        attributes: ['name'],
        where: {
            business_id: req.params.business_id,
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})
//02-print all locations of a business
Store.get('/printalllocation/:business_id', (req, res, next) => {
    // console.log('printalllocation() - sessionID: ' + req.session.sessionID); 
    // console.log('printalllocation() - userType: ' + req.session.userType); 
    // console.log('printalllocation() - userId: ' + req.session.userId); 
    // if(req.session.userType == null){
    //     res.status(400).json({error:'Session Is NULL!'});
    //     return;
    // }
    // if(req.session.userType != "business"){
    //     res.status(401).json({error:'Not equal to business'});
    //     console.log('printalllocation() - userType: ' + req.session.userType); 
    //     return;
    // }

    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    store.findAll({
        attributes: ['store_name', 'address', 'store_id'],
        where: {
            business_id: req.params.business_id,
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})

//03-print number of locations of a business
Store.get('/numoflocations/:business_id', (req, res, next) => {
    //  //Verify that we have created a session previously
    //  if(req.session.userType == null || req.session.userType != "business"){
    //     res.status(400).json({error:'Session was never created'});
    //     return;
    // }
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    store.count({
        distinct: true,
        col: 'store_id',
        where: {
            business_id: req.params.business_id,
        }
    })
        .then(function (count) {
            res.status(200).json(count)
        })
        .catch(next)
})

//04-location search
Store.get('/searchlocation/:business_id/:address', (req, res, next) => {
    //Verify that we have created a session previously
    // if(req.session.userType == null || req.session.userType != "business"){
    //     res.status(400).json({error:'Session was never created'});
    //     return;
    // }

    store.findAll({
        where: {
            business_id: req.params.business_id,
            address: {
                [Op.like]: '%' + req.params.address + '%'
            }
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
    /*TODO - No handling of case when there are no stores for a business id*/
})

//05-select location 
Store.get('/selectlocation/:business_id/:address', (req, res, next) => {
    // if(req.session.userType == null || req.session.userType != "business"){
    //     res.status(400).json({error:'Session was never created'});
    //     return;
    // }
     //Verify that we have created a session previously
    //Op = Sequelize.Op;
    store.findAll({
        where: {
            business_id: req.params.business_id,
            address: req.params.address
        }
    })
        .then(function (rowsUpdated) {
            res.status(200).json(rowsUpdated)
        })
        .catch(next)
})


//06-add location with latitude and longitude
Store.post('/addlocation/:business_id', async (req, res, next) => {

    const userData = {
        address: req.body.address,
        business_id: req.params.business_id,
        store_name: req.body.name
    }
    console.error(userData);

    var reqaddress = await req.body.address
    console.log("address info " +reqaddress)
    validation = await geoCoder.geocode(reqaddress)
    console.log("info " +validation)

    if (validation.length < 1 || validation == undefined) {
        res.status(400).json({message: "invalid address"})
    } else {

        //The findOne method obtains the first entry it finds (that fulfills the optional query options, if provided
        store.findOne({
            //The where option is used to filter the query.
            where: {
                business_id: req.params.business_id,
                address: req.body.address,
            }
        })
            //it generate its own token after it created the user
            .then(user => {
                if (!user) {
                    //The create method uilds a new model instance and calls save on it.
                    //it generate its own token after it created the user
                    store.create(userData)
                    geoCoder.geocode(reqaddress)
                        .then((res) => {
                            console.error(res);
                            store.update(
                                {store_lat: res[res.length - 1].latitude, store_long: res[res.length - 1].longitude},
                                {
                                    where: {
                                        business_id: req.params.business_id,
                                        address: req.body.address,
                                    }
                                }
                            ).then(result =>
                                console.log("converted address to long and lat")
                            )
                                .error(err =>
                                    handleError(err)
                                )
                        })
                        .catch((err) => {
                            console.log(err);
                        });

                    res.status(200).json({status: 'Added item to business'})

                } else {
                    res.status(400).json({status: 'item already exists'})
                }
            })
            .catch(err => {
                //res.send('error: ' + err)
                res.status(400).json({error: err}) //Shawn
            })
    }
})

//07-delete location
Store.delete('/deletelocation/:business_id/:store_id',  async (req, res, next) => {
    // if(req.session.userType == null || req.session.userType != "business"){
    //     res.status(400).json({error:'Session was never created'});
    //     return;
    // }
    //The destroy method is use to delete selectec instance

    console.log("Inside store.delete")

    //destroy cart_id that contain the item which is to be delete
    productIDs = await locateProductId(req.params.store_id)
    console.log("productIDs", productIDs)

    for(PID of productIDs){
        cartIDs = await locateCartId(PID)
        for (CID of cartIDs) {
            console.log("deleting cartID: "+ CID)
            await cart.destroy({
                where:{
                    cart_id: CID
                }
            })
        }
    }

    //destroy product_id that that belongs to the location which is to be delete
    for (PID of productIDs) {
        await item.destroy({
            where:{
                product_id: PID
            }
        })
    }

    store.destroy({
        where: {
            store_id:req.params.store_id
        }
    }).then(function (rowsUpdated) {
        res.status(200).json(rowsUpdated)
        console.log("itmes deleted before delete store")
    })
        .catch(next)

    // store.destroy({
    //     where: {
    //         business_id: req.params.business_id,
    //         store_id: req.params.store_id
    //     }
    // })
    //     .then(function (rowsUpdated) {
    //         //delete product when delete the store
    //         // request('localhost:5000/deleteallproduct/req.params.store_id', function (error) {
    //         //     if (!error && response.statusCode == 200) {
    //         //         console.log("deleted all prodcut of store_id" + req.params.store_id)
    //         //     }
    //         // })
    //         res.status(200).json(rowsUpdated)
    //     })
    //     .catch(next)

})

//================= functions to delete relative cart id while delete product==============

//find product id from store
async function locateProductId(storeID) {

    listofProducts = await item.findAll({
        where: {
            store_id: storeID
        }
    })
    productIds = listofProducts.map(anitem => {
        return anitem.getDataValue('product_id')
    })
    productIds = await Promise.all(productIds)
    return productIds
}

//find cart id from product
async function locateCartId(productID) {

    listofCarts = await cart.findAll({
        where: {
            product_id: productID
        }
    })
    cartIds = listofCarts.map(ancartid => {
        return ancartid.getDataValue('cart_id')
    })
    cartIds = await Promise.all(cartIds)
    return cartIds
}




module.exports = Store