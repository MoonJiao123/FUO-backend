/**
 * Description:
 * This file is to POST the requested data of register/login from the business user.
 * This file is to GET the requested data of profile from the business user.
 * This file is to POST the requested data of register/login from the customer user.
 * This file is to GET the requested data of profile from the customer user.
 * BE will compare the requested data with the data we have in database. Return the result of comparison to FE.
 *
 * Endpoints and Params:
 *   On business signup - (POST) /user/business/register
 *   On business login - (POST) /user/business/login
 *   On customer signup - (POST)  /user/customer/register
 *   On customer login - (POST) /user/customer/login
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
 * Contributors:
 * Yue Jiao, Yunning Yang
 *
 * Shawn - just added res.status().json({}) messages
 * Darien - debug tweaks
 * Derek - implemented the logout function and added various session
 */

const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sessions = require('express-session')
users.use(cors())
const BusinessUser = require('../models/BusinessModel.js')
const CustomerUser = require('../models/CustomerModel.js')
var nodeGeocoder = require('node-geocoder');
var options = { provider: 'openstreetmap' };
var geoCoder = nodeGeocoder(options);

process.env.SECRET_KEY = 'secret'

/*ACCESS ACCOUNT*/
//homedepot@homedepot.com
//homedepotiscool1
//Business-SIGNUP
users.post('/business/register', (req, res) => {

    console.log(req.body.name); //for testing, can be deleted
    console.log(req.body); //for testing, can be deleted
    console.log(req.body.email); //for testing, can be deleted

    const userData = {
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        mobile: req.body.mobile,
        name: req.body.name
    }

    //The findOne method obtains the first entry it finds (that fulfills the optional query options, if provided
    //since we only use email and password for login, so we only compare email here
    BusinessUser.findOne({
        //The where option is used to filter the query.
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (!user) {
                //if the user does not exist, there is no user with the same email, we will create the user here
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    //The create method uilds a new model instance and calls save on it.
                    //it generate its own token after it created the user
                    BusinessUser.create(userData)
                        .then(user => {
                            res.status(200).json({ message: 'Registered!' })
                            // MESSAGE NOT GETTING THROUGH
                            console.log(user.email)
                        })
                        .catch(err => {
                            //res.send('error: ' + err)
                            res.status(400).json({ Error: 'Bad request Hi Darien' }) /* Added by Shawn */
                            // ERROR MESSAGE NOT GETTING THROUGH
                        })
                })
            } else {
                //res.json({ error: 'User already exists' })
                res.status(400).json({ Error: 'User already exists' }) /* Added by Shawn */
                // ERROR MESSAGE NOT GETTING THROUGH
            }
        })
        .catch(err => {
            //res.send('error: ' + err)
            res.status(400).json({ Error: err }) /* Added by Shawn */
        })
})

//Business-LOGIN
users.post('/business/login', (req, res) => {
    BusinessUser.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            console.log('Found business user');
            if (user) {
                //if the email exists, compare the password from databas
                //first password comes from FE, second password comes from database
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    //jwt will generate a token that will be passing to FE
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440 //lifetime of token
                    })

                    // console.log('login() - sessionID: ' + req.sessionID);
                    // console.log('login() - userType: ' + req.session.userType);
                    // console.log('login() - userId: ' + req.session.userId);

                    //Login to the business users
                    // req.session.userType = "business";
                    // req.session.userId = user.business_id;
                    // req.session.save();

                    res.status(200).json({ token: token, user_id: user.business_id })
                } else { //Login failed
                    res.status(400).json({ error: 'Incorrect Password' }) //Incorrect password
                }
            } else {
                res.status(400).json({ error: 'Email doesn not exist' }) //Unregistered email
            }
        })
        .catch(err => {
            res.status(400).json({ error: 'No email input found' })
        })

})
//get current user from token
users.post('/me/from/token/:usertype', (req, res) => {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token;
    if (!token) {
        return res.status(401).json({ message: 'Must pass token' });
    }
    // Check token that was passed by decoding token using secret
    jwt.verify(token, process.env.SECRET_KEY, function (err, user) {
        console.log(user)

        if (err) throw err;
        if (req.params.usertype == "business") {
            //return user using the id from w/in JWTToken
            BusinessUser.findOne({
                where: {
                    business_id: user.business_id
                }
            }).then(user => {
                console.log("entering function");
                if (err) throw err;
                //user = utils.getCleanUser(user);
                //Note: you can renew token by creating new token(i.e.
                //refresh it)w/ new expiration time at this point, but I’m
                //passing the old token back.
                // var token = utils.generateToken(user);
                res.status(200).json({
                    user: user,
                    token: token
                });
            });
        } else if(req.params.usertype == "customer") {
             //return user using the id from w/in JWTToken
             CustomerUser.findOne({
                where: {
                    customer_id: user.customer_id
                }
            }).then(user => {
                console.log("entering function");
                if (err) throw err;
                //user = utils.getCleanUser(user);
                //Note: you can renew token by creating new token(i.e.
                //refresh it)w/ new expiration time at this point, but I’m
                //passing the old token back.
                // var token = utils.generateToken(user);
                res.status(200).json({
                    user: user,
                    token: token
                });
            });
        }

    });
});
//PROFILE
//to fetch profile from FE.
users.get('/business', (req, res) => {
    //to verify authorization sent from FE with secret key
    //it converts token back to the object we created
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    BusinessUser.findOne({
        where: {
            id: decoded.id
        }
    })
        .then(user => {
            if (user) {
                res.json(user)
                res.status(200).json({ message: 'User found, authenticated' }) /* Added by Shawn */
            } else {
                //res.send('User does not exist')
                res.status(400).json({ error: 'User does not exist' }) /* Added by Shawn */
            }
        })
        .catch(err => {
            //res.send('error: ' + err)
            res.status(400).json({ error: err }) /* Added by Shawn */
        })
})

//customer-SIGNUP
//note ERROR 500, When god tried testing sign up, request recieved by BE correctly
//However, Internal server error 500 in backend. need to fix ;-;
users.post('/customer/register', async (req, res) => {

    console.log(req.body); //for testing, can be deleted
    console.log(req.body.email); //for testing, can be deleted

    //Sign up page have customer_location now!!!!

    const userData = {
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        customer_location: req.body.customer_location
    }

    //check validation of address
    customerAddress = await req.body.customer_location
    validation = await geoCoder.geocode(customerAddress)
    // console.log("Inside address validation")

    // console.log("customerAddress "+customerAddress)
    // console.log("validation "+validation)
    // console.log("validation==null "+(validation==null))
    // console.log("validation===null "+(validation===null))
    // console.log("validation==empty "+(validation==""))
    // console.log("validation===empty "+(validation===""))
    // console.log("isEmpty(validation) "+isEmpty(validation))

    if (validation.length < 1 || validation == undefined) {
        res.status(400).json({message: "invalid address"})
    } else {

        //since we only use email and password for login, so we only compare email here
        CustomerUser.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(user => {
                if (!user) {
                    //if the user does not exist, there is no user with the same email, we will create the user here
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        userData.password = hash
                        //it generate its own token after it created the user
                        CustomerUser.create(userData)
                            .then(user => {
                                //res.json({ status: user.email + 'Registered!' })
                                res.status(200).json({ message: req.body }) /* added by Shawn*/
                            })
                            .catch(err => {
                                res.send('error: ' + err)
                                res.status(400).json({ error: err }) /* added by Shawn*/
                            })
                    })
                } else {
                    //res.json({ error: 'User already exists' })
                    res.status(400).json({ error: 'User already exists' }) /* added by Shawn*/
                }
            })
            .catch(err => {
                //res.send('error: ' + err)
                res.status(400).json({ message: req.body }) /* added by Shawn*/
            })
    }
})

//LOGOUT - KILL THE SESSION AND WIPE TEH COOKIE
users.get('/logout', (req, res) => {
    //to verify authorization sent from FE with secret key
    //it converts token back to the object we created
    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    console.log('Business ID: ' + req.session.userType)
    req.session.destroy(function (err) {
        console.log('LOGOUT() - Logging out user')
        console.log('SESSION SUCCESSFULY DESTROYED')
    })

    res.status(200).json({ message: 'User successfully logged out!' });
})
/*
"message": {
  "name": "tekashisixnine@prison.edu",
  "password": "gummo6969"
}*/
//customer-LOGIN
users.post('/customer/login', (req, res) => {
    CustomerUser.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                //if the email exists, compare the password from database
                //first password comes from FE, second password comes from database
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    //jwt will generate a token that will be passing to FE
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440 //lifetime of token
                    })


                    res.status(200).json({ token: token })
                } else { //Login failed
                    res.status(400).json({ error: 'Incorret Password' })
                }
            } else {
                res.status(400).json({ error: 'This Email does not exist ' })
            }
        })
        .catch(err => {
            res.status(400).json({ error: 'No email input found' })
        })

})


module.exports = users
