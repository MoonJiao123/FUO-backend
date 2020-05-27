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
const sessions = require('express-session')
const product = express.Router()
const cors = require('cors')
const item = require('../models/ProductModel.js')
const store = require('../models/StoreModel.js')
const customer = require('../models/CustomerModel.js')
const { Op } = require("sequelize")

product.use(cors())
// //product upload
// product.post('/test/:store_id', (req, res) => {
//     const userData = {
//         product_name: req.body.product_name,
//         product_img: req.body.product_img,
//         category: req.body.category,
//         price: req.body.price,
//         expire_date: req.body.expire_date,
//         stock_amount: req.body.stock_amount,
//         coupon: req.body.coupon,
//         store_id: req.params.store_id
//     }

//     //The create method uilds a new model instance and calls save on it.
//     //it generate its own token after it created the user
//     item.bulkCreate(userData, 
//         {
//             updateOnDuplicate: ["product_id","product_name", "product_img", "category","price","expire_date", "stock_amount", "coupon"]
//         } )
//         .then(user => {
//             res.status(200).json({ status: user.product_name + 'Added coupon to db' })
//         })
//         .catch(err => {
//             //res.send('error: ' + err)
//             res.status(400).json({ error: err }) //Shawn
//         })
// })

//product upsert
product.post('/upsert/:store_id/:product_id', (req, res, next) => {
    
    console.log("product_id "+req.params.product_id);
    console.log("store_id "+req.params.store_id);
    console.log("product_name"+req.body.product_name);
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
                        res.status(200).json({ message: req.body }) 
                    })
                    .catch(err => {
                        //res.send('error: ' + err)
                        res.status(400).json({ Error: 'Bad request!' }) /* Added by Shawn */
                    })
            } else {
                console.log("product already existed");
                item.update(userData,{//The where option is used to filter the query.
                    where: {
                        product_id: req.params.product_id
                    }})
                    .then(function (rowsUpdated) {
                        console.log("in update function");
                        res.status(200).json(rowsUpdated)
                    })
            }
        })
        .catch(err => {
            console.log("some error");
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

//product delete all
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


//1-search by category in default distance sorting
product.get('/getnearbystore/:category/:customer_id', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    item.findAll({
        where: {
            category: req.params.category,
        }
    })
        .then(function (rowsUpdated) {
            //console.log("in then");
            res.status(200).json(sortByDist(req.session.userId,rowsUpdated))
        })
        .catch(next)
})

//2-search by category using price range filter
product.get('/:category/:low/:high', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
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
            res.status(200).json(sortByDist(req.session.userId,rowsUpdated))
        })
        .catch(next)
})

//3-search by name in ascending price order
product.get('/:name/price/asc', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
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
            res.status(200).json(mask(rowsUpdated,sortByDist(req.session.userId,rowsUpdated)))
        })
        .catch(next)
})

//4-search by name using price range filter in ascending price order
product.get('/:name/price/asc/:low/:high', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
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
            res.status(200).json(mask(rowsUpdated,sortByDist(req.session.userId,rowsUpdated)))
        })
        .catch(next)
})

//5-search by name in descending price order
product.get('/:name/price/desc', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
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
            res.status(200).json(mask(rowsUpdated,sortByDist(req.session.userId,rowsUpdated)))
        })
        .catch(next)
})

//6-search by name using price range filter in descending price order
product.get('/:name/price/desc/:low/:high', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
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
            res.status(200).json(mask(rowsUpdated,sortByDist(req.session.userId,rowsUpdated)))
        })
        .catch(next)
})

//7-search by name in ascending expiration date order
product.get('/:name/expire/asc', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
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
            res.status(200).json(mask(rowsUpdated,sortByDist(req.session.userId,rowsUpdated)))
        })
        .catch(next)
})

//8-search by name using price range filter in ascending expiration date order
product.get('/:name/expire/asc/:low/:high', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
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
            res.status(200).json(mask(rowsUpdated,sortByDist(req.session.userId,rowsUpdated)))
        })
        .catch(next)
})

//9-search by name in descending expiration date order
product.get('/:name/expire/desc', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
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
            res.status(200).json(mask(rowsUpdated,sortByDist(req.session.userId,rowsUpdated)))
        })
        .catch(next)
})

//10-search by name using price range filter in descending expiration date order
product.get('/:name/expire/desc/:low/:high', (req, res, next) => {
    if(req.session.userType == null || req.session.userType != "customer"){
        res.status(400).json({error:'Session was never created'});
        return;
    }
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
            res.status(200).json(mask(rowsUpdated,sortByDist(req.session.userId,rowsUpdated)))
        })
        .catch(next)
})

//*********************** functions for distance sorting start from here ****************************************//

async function mask(items1,items2) {
    // mask items1 by items2
    pids = items2.map( item => { return item.getDataValue('product_id')})
    pids = await Promise.all(pids)
    newItems = []
    for (item of items1) {
        myid = await item.getDataValue('product_id')
        if (!(myid in pids)) {
            continue;
        }
        newItems.push(item)
    }
    return newItems
}

async function sortByDist(customerID,items,numKeep=20) {

    LL = await getLL(customerID,items)

    //console.log("LL "+LL)

    dist = coord2dist(LL)
    //console.log("dist "+dist)

    perm = Array.from(Array(dist.length).keys())

    associatedSort(dist,perm)

    //console.log("sorted dist "+dist)
    //console.log("perm "+perm)

    nitems = items.length
    newItems = []
    for (var i=0; i< Math.min(nitems,numKeep); i++) {
        newItems.push(items[perm[i]])
    }
    return newItems
}

async function getLL(customerID,items) {

// Get latitude and longitude

    Lat = []
    Long = []

    storeLat = await getStoreInfo(items, 'store_lat')
    storeLong = await getStoreInfo(items, 'store_long')
    customerLat = await getCustomerData(customerID, 'customer_lat')
    customerLong = await getCustomerData(customerID, 'customer_long')

    // console.log("customerLat "+customerLat)
    // console.log("customerLong "+customerLong)
    // console.log('storeLat '+storeLat)
    // console.log('storeLong '+storeLong)

    Lat.push(customerLat)
    Lat = Lat.concat(storeLat)
    Long.push(customerLong)
    Long = Long.concat(storeLong)

    // console.log('Lat '+Lat)
    // console.log('Long '+Long)

    LL = []
    LL.push(Lat)
    LL.push(Long)

    return LL
}

async function getStoreInfo(items,attri) {
    promises = items.map( async item => {
        if (item.store_id==null) {
            return null
        } else {
            await store.findOne({
                where: {
                    store_id: item.store_id
                }
            }).then(
                async stores => {
                    val = await stores.getDataValue(attri)
                    // console.log("getting store value "+val)
                })
            return val
        }
    })
    result = await Promise.all(promises)
    // console.log("result "+result)
    return result
}

async function getCustomerData(customerID,attri) {
    result = await customer.findOne({
        where: {
            customer_id: customerID
        }
    }).then(
        customerInst => {
            return customerInst.getDataValue(attri)
        }
    )
    return result
}

function coord2dist(LL) {
    nstore = LL[0].length - 1
    m = LL.length
    // console.log(nstore+", "+m)
    dist = new Array(nstore)
    dist.fill(null)
    // Radius of earth in km
    R = 6371
    // customer coord
    // console.log(LL[0])
    // console.log(LL[1])
    phic = LL[0][0]
    lbdc = LL[1][0]
    // console.log(LL[0][1])
    // console.log(LL[0][1]==null)
    if ((phic==null)||(lbdc==null)) {
        return dist
    }
    phic = phic/180*Math.PI
    lbdc = lbdc/180*Math.PI
    // console.log("phic "+phic)
    // console.log("lbdc "+lbdc)
    for (var i=0; i< nstore; i++) {
        phis = LL[0][i+1]
        lbds = LL[1][i+1]
        // console.log("i "+i)
        // console.log("phis "+phis)
        // console.log("lbds "+lbds)
        if ((phis!=null)&&(lbds!=null)) {
            phis = phis/180*Math.PI
            lbds = lbds/180*Math.PI
            dphi = phis - phic
            dlbd = lbds - lbdc
            a = Math.sin(dphi / 2) ** 2 + Math.cos(phis) * Math.cos(phic) * Math.sin(dlbd / 2) ** 2
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            dist[i] = R * c * 0.621371
        }
    }
    return dist
}

//Sorts arr and syncs assArr simultaneously
var associatedSort = (function() {
    var comparator = function(a, b) {
        if(b[0]==null) {
            return -1;
        }

        if(a[0]==null) {
            return 1;
        }

        if(a[0] < b[0]) {
            return -1;
        }

        if(a[0] > b[0]) {
            return 1;
        }

        return 0;
    };

    return function(arr, assArr) {
        if(arr.length !== assArr.length) {
            throw 'Arrays have different length';
        }

        //Replace all elements of the array with a helper object containing the element and the corresponding element of the other array.
        for(var i = 0; i < arr.length; i++) {
            arr[i] = [arr[i], assArr[i]];
        }

        //Sort
        arr.sort(comparator);

        //Now assign the old elements and remove the helper object
        for(var i = 0; i < arr.length; i++) {
            assArr[i] = arr[i][1];
            arr[i] = arr[i][0];
        }
    };
})();

module.exports = product
