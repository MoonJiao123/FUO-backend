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
const store = require('../models/StoreModel.js')
const customer = require('../models/CustomerModel.js')
const business = require('../models/BusinessModel')
const cart = require('../models/CartModel.js')
const { Op } = require("sequelize");
var nodeGeocoder = require('node-geocoder');
var options = {provider: 'openstreetmap'};
var geoCoder = nodeGeocoder(options);

product.use(cors())

//product upsert
product.post('/upsert/:store_id/:product_id', (req, res, next) => {
    console.error("img ");
    console.error("img "+req.body.product_img);//does not wokr
    if(req.body.coupon != null){
        var discounted_price = calculateDiscounted(req.body.price, req.body.coupon);
    }
    console.error(discounted_price);
    //The update method updates multiple instances that match the where options.
    const userData = {
        product_name: req.body.product_name,
        product_img: req.body.product_img,
        category: req.body.category,
        price: req.body.price,
        expire_date: req.body.expire_date,
        stock_amount: req.body.stock_amount,
        coupon: req.body.coupon,
        discounted_price: discounted_price,
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
product.delete('/delete/:store_id/:product_id', async (req, res, next) => {

    //destroy cart_id that contain the item which is to be delete
    cartIDs = await locateCartId(req.params.product_id)

    for (CID of cartIDs) {
        console.log("deleting cartID: "+ CID)
        await cart.destroy({
            where:{
                cart_id: CID
            }
        })
    }


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
product.delete('/deleteallproduct/:store_id', async (req, res, next) => {
    //The destroy method is use to delete selected instance
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

    // item.destroy({
    //     where: {store_id: req.params.store_id},
    // })
    //     .then(function (rowsUpdated) {
    //         res.status(200).json(rowsUpdated)
    //     })
    //     .catch(next)
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

///==============      add expiration date, discount amount, category after searching by name     ==================

//0-search by name in ascending price order with distance sorting
product.get('/:customer_id/:sortmode/:category/:name/:low/:high', async (req, res, next) =>{

    tempName = req.params.name
    tempName = await tempName.split(';').join(' ')

    whereStatement = {}
    switch (req.params.sortmode){
        case 'Distance':
            orderStatement = []
            break;
        case 'Price': //using discounted_price
            orderStatement = [['discounted_price', 'ASC']]
            break;
        case 'Expiration':
            orderStatement = [['expire_date', 'DESC']]
            break;
        default:
    }
    // console.log("product model attri: ", item.rawAttributes)
    if (!(req.params.high == 1000)) {
        whereStatement.discounted_price = {[Op.between]: [req.params.low, req.params.high]}
    }
    if (!(req.params.category=="None")) {
        whereStatement.category = req.params.category
    }

    whereStatement.product_name = {[Op.like]: '%' + tempName + '%'}

    console.log("whereStatement ", whereStatement)
    console.log("orderStatement ", orderStatement)


        item.findAll({
            attributes: ['discounted_price', 'expire_date', 'category', 'store_id', 'product_id', 'product_img', 'product_name', 'stock_amount'],
            where: whereStatement,
            include: {
                    model: store,
                    attributes: ['address'],
                    as: 'store_product',
                    include:  {model: business, attributes: ['name']}
                },
            order: orderStatement


        })
            .then(async (rowsUpdated) => {
                // console.log('rowsUpdated.length '+rowsUpdated.length)
                // console.log('in routing, rowsUpdated[0] ', rowsUpdated[0])
                // tmp = await rowsUpdated[0].getDataValue('product_id')
                // console.log('pid0 ', tmp)
                // tmp = await rowsUpdated[0].getDataValue('category')
                // console.log('cat0 ', tmp)
                row1 = await sortByDist(req.params.customer_id, rowsUpdated)
                console.log('rowsUpdated' + rowsUpdated)
                console.log('row1 ' + row1)
                //console.log(result)
                console.log("number of row1 " + row1.length)
                console.log('number of rowsUpdated ' + rowsUpdated.length)
                if (req.params.sortmode == 'Distance') {
                    console.log("sort by distance")
                    res.status(200).json(row1)
                } else {
                    result = await mask(rowsUpdated, row1)
                    res.status(200).json(result)
                }
            })
            .catch(next)

})

//1-search by category with distance sorting
product.get('/:customer_id/:category', (req, res, next) => {
    console.log(req.params.customer_id)
    console.log("req.params.category "+req.params.category)
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    item.findAll({
        where: {
            category: req.params.category,
        }
    })
        .then( async (rowsUpdated) => {
            // console.log("in then");
            result = await sortByDist(req.params.customer_id, rowsUpdated)
            // console.log(result)
            res.status(200).json(result)
        })
        .catch(next)
})

//2-search by category using price range filter with distance sorting
product.get('/:customer_id/:category/:low/:high', (req, res, next) => {
    //The findAll method generates a standard SELECT query which will retrieve all entries from the table
    item.findAll({
        where: {
            category: req.params.category,
            price: {
                [Op.between]: [req.params.low, req.params.high]
            }
        }
    })
        .then( async rowsUpdated => {
            result = await sortByDist(req.params.customer_id, rowsUpdated)
            res.status(200).json(result)
        })
        .catch(next)
})

//3-search by name in ascending price order with distance sorting
product.get('/:customer_id/:name/price_asc', (req, res, next) => {
    //console.log("3-search by name in ascending price order")
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
        .then( async (rowsUpdated) => {
            row1 = await sortByDist(req.params.customer_id, rowsUpdated)
            //console.log('rowsUpdated.length '+rowsUpdated.length)
            //console.log('rowsUpdated'+rowsUpdated)
            //console.log('row1 '+row1)
            result = await mask(rowsUpdated, row1)
            //console.log(result)
            res.status(200).json(result)
        })
        .catch(next)
})

//4-search by name using price range filter in ascending price order with distance sorting
product.get('/:customer_id/:name/price_asc/:low/:high', (req, res, next) => {
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
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
        .then( async (rowsUpdated) => {
            row1 = await sortByDist(req.params.customer_id, rowsUpdated)
            result = await mask(rowsUpdated, row1)
            res.status(200).json(result)
        })
        .catch(next)
})

//5-search by name in descending price order with distance sorting
product.get('/:customer_id/:name/price_desc', (req, res, next) => {
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

        .then( async (rowsUpdated) => {
            row1 = await sortByDist(req.params.customer_id, rowsUpdated)
            result = await mask(rowsUpdated, row1)
            res.status(200).json(result)
        })
        .catch(next)
})

//6-search by name using price range filter in descending price order with distance sorting
product.get('/:customer_id/:name/price_desc/:low/:high', (req, res, next) => {
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

        .then( async (rowsUpdated) => {
            row1 = await sortByDist(req.params.customer_id, rowsUpdated)
            result = await mask(rowsUpdated, row1)
            res.status(200).json(result)
        })
        .catch(next)
})

//7-search by name in ascending expiration date order with distance sorting
product.get('/:customer_id/:name/expire_asc', (req, res, next) => {
    console.log("7-search by name in ascending expiration date order")
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

        .then( async (rowsUpdated) => {
            console.log("rowsUpdated.length "+rowsUpdated.length)
            row1 = await sortByDist(req.params.customer_id, rowsUpdated)
            result = await mask(rowsUpdated, row1)
            res.status(200).json(result)
        })
        .catch(next)
})

//8-search by name using price range filter in ascending expiration date order with distance sorting
product.get('/:customer_id/:name/expire_asc/:low/:high', (req, res, next) => {
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

        .then( async (rowsUpdated) => {
            row1 = await sortByDist(req.params.customer_id, rowsUpdated)
            result = await mask(rowsUpdated, row1)
            res.status(200).json(result)
        })
        .catch(next)
})

//9-search by name in descending expiration date order with distance sorting
product.get('/:customer_id/:name/expire_desc', (req, res, next) => {
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

        .then( async (rowsUpdated) => {
            row1 = await sortByDist(req.params.customer_id, rowsUpdated)
            result = await mask(rowsUpdated, row1)
            res.status(200).json(result)
        })
        .catch(next)
})

//10-search by name using price range filter in descending expiration date order with distance sorting
product.get('/:customer_id/:name/expire_desc/:low/:high', (req, res, next) => {
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
        .then( async (rowsUpdated) => {
            row1 = await sortByDist(req.params.customer_id, rowsUpdated)
            result = await mask(rowsUpdated, row1)
            res.status(200).json(result)
        })
        .catch(next)
})
//function to calculate discounted price given price and a string of discount like 20%
function calculateDiscounted(price, discount){
    var dis = discount.split("%")[0];
    var doubledis = parseFloat(dis);
    return price * (1 - (doubledis / 100));
}

//*********************** functions for distance sorting start from here ****************************************//

//function1 - To update customer address to coordinate ------------DONE
async function updateCustomerCoord(customerID){

    // console.log('customerID ', customerID)
    customerInst = await customer.findOne({
        where: {customer_id: customerID}
    })
    // console.log('customerInst ', customerInst)

    // console.log('customerlat ', customerlat)
    // console.log('customerlong ', customerlong)

    // if ((customerlat == null) || (customerlong == null)) {
    if (true) {
        customerAddress = await customerInst.getDataValue('customer_location')
        result = await geoCoder.geocode(customerAddress)
        console.log("customerAddress", customerAddress)
        console.log("geocode result===================", result)
        var customerlat = result[0].latitude
        var customerlong = result[0].longitude
        await customerInst.setDataValue('customer_lat',customerlat)
        await customerInst.setDataValue('customer_long',customerlong)
        customerInst.save()
    }
}

//function2 - To get customer data ------------DONE
async function getCustomerData(customerID, attri) {
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

//function3 - To get customer data ------------DONE
async function getStoreInfo(items, attri) {
    // console.log("attri ", attri)
    promises = items.map( async item => {
        pid = await item.getDataValue('product_id')
        sid = await item.getDataValue('store_id')
        console.log("item.product_id ", pid)
        console.log("item.store_id ", sid)
        if (sid == null) {
            val = null
        } else {
            astore = await store.findOne({
                where: {
                    store_id: sid
                }
            })
            val = await astore.getDataValue(attri)
        }
        return val
    })

    result = await Promise.all(promises)
    // console.log("result "+result)
    return result
}

//function4 - To get all latitude and longitude from both customer and items ------------DONE
async function getLL(customerID, items) {

    Lat = []
    Long = []

    storeLat = await getStoreInfo(items, 'store_lat')
    storeLong = await getStoreInfo(items, 'store_long')
    customerLat = await getCustomerData(customerID, 'customer_lat')
    customerLong = await getCustomerData(customerID, 'customer_long')

    console.log("customerLat "+customerLat)
    console.log("customerLong "+customerLong)
    console.log('storeLat '+storeLat)
    console.log('storeLong '+storeLong)

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

//function5 - To calculate distance ------------DONE
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
    if ((phic == null) || (lbdc == null)) {
        return dist
    }
    //////
    phic = phic / 180 * Math.PI
    lbdc = lbdc / 180 * Math.PI
    // console.log("phic "+phic)
    // console.log("lbdc "+lbdc)
    for (var i = 0; i < nstore; i++) {
        phis = LL[0][i + 1]
        lbds = LL[1][i + 1]
        // console.log("i "+i)
        // console.log("phis "+phis)
        // console.log("lbds "+lbds)
        if ((phis != null) && (lbds != null)) {
            phis = phis / 180 * Math.PI
            lbds = lbds / 180 * Math.PI
            dphi = phis - phic
            dlbd = lbds - lbdc
            a = Math.sin(dphi / 2) ** 2 + Math.cos(phis) * Math.cos(phic) * Math.sin(dlbd / 2) ** 2
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            //round two decimal
            dist[i] = ( R * c * 0.621371 ).toFixed(2);
        }
    }

    return dist
}

//function6 - To sort the 20 closest products to customer user ------------DONE
async function sortByDist(customerID, items, numKeep=20) {

    await updateCustomerCoord(customerID);
    // console.log("finished updateCustomerCoord")
    //To get latitude and longitude of customer
    // console.log("in sortByDist, items[0]: ", items[0])
    LL = await getLL(customerID, items)
    console.log("LL "+LL)

    //To get the distances from products to customer
    dist = coord2dist(LL)
    console.log("dist "+dist)

    //To sort the distances and keep check of permutation
    perm = Array.from(Array(dist.length).keys())
    associatedSort(dist, perm)

    // console.log("sorted dist "+dist)
    // console.log("perm "+perm)

    nitems = items.length
    newItems = []

    //To return the numbers of distances that associated with products
    console.log("numKeep ", numKeep)
    console.log("Math.min(nitems, numKeep)", Math.min(nitems, numKeep))
    for (var i = 0; i < Math.min(nitems, numKeep); i++) {
        await items[perm[i]].setDataValue('distance', dist[i])
        newItems.push(items[perm[i]])
    }
    console.log("newItems.length ", newItems.length)

    return newItems
}

//function7 - Sorts arr and syncs assArr simultaneously ------------DONE
var associatedSort = (function() {
    //if a>b return 1, a<b return -1, won't do anything when a=b
    var comparator = function(a, b) {
        //null as infinite
        if(b[0] == null) {
            return -1;
        }

        if(a[0] == null) {
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

//To mask items1 by items2
//function8 - To extract the products from items1 that are existing in items2 in sorted order ------------DONE
async function mask(items1, items2) {
    //console.log(items2)
    //to return the product_id of the items in items2 in order
    productIds = items2.map(item => { return item.getDataValue('product_id')})
    productIds = await Promise.all(productIds)

    //console.log("productIds "+productIds)

    newItems = []

    //check if the products in items1 is also in iterms2, if so, push it into newItem in order
    for (anItem of items1) {
        ithId = await anItem.getDataValue('product_id')
        //console.log("ithId "+ithId)
        //console.log("ithId in productIds "+(productIds.includes(ithId)))
        if (!(productIds.includes(ithId))) {
            continue;
        }
        //console.log("push item "+ithId)
        await newItems.push(anItem)
    }
    //console.log("newItems.length "+ newItems.length)
    return newItems
}

//================= functions to delete relative cart id while delete product==============

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

module.exports = product
