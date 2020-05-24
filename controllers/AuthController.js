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
 * Shawn - just added res.status().json({}) messages
 * Darien - debug tweaks
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

process.env.SECRET_KEY = 'secret'

/*Use the sessions*/

//Business-SIGNUP
users.post('/business/register', (req, res) => {

  console.log(req.body.name); //for testing, can be deleted
  console.log(req.body); //for testing, can be deleted
  console.log(req.body.email); //for testing, can be deleted

  const userData = {
    account: req.body.account,
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
              res.status(200).json({ status: user.email + 'Registered!' })
            })
            .catch(err => {
              //res.send('error: ' + err)
              res.status(400).json({ Error: 'Bad request' }) /* Added by Shawn */
            })
        })
      } else {
        //res.json({ error: 'User already exists' })
        res.status(400).json({ Error: 'User already exists' }) /* Added by Shawn */
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
      if (user) {
        //if the email exists, compare the password from database
        //first password comes from FE, second password comes from database
        if (bcrypt.compareSync(req.body.password, user.password)) {
          //jwt will generate a token that will be passing to FE
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440 //lifetime of token
          })

          req.session.userType = "business"; 
          req.session.userId = user.business_id;

          //res.send(token)
          res.status(200).json({ message: 'User found, authenticated' }) /* Added by Shawn */
        }
      } else {
        res.status(400).json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

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
users.post('/customer/register', (req, res) => {

  console.log(req.body.name); //for testing, can be deleted
  console.log(req.body); //for testing, can be deleted
  console.log(req.body.email); //for testing, can be deleted

  const userData = {
    account: req.body.account,
    password: bcrypt.hashSync(req.body.password, 8),
    email: req.body.email,
    customer_location: req.body.customer_location
  }

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
              res.status(200).json({ message: 'Registered!' }) /* added by Shawn*/
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
      res.status(400).json({ error: err }) /* added by Shawn*/
    })
})

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
          /*req.session.cookie = JSON.stringify({userType:"customer", user_id: user.customer_id})
          req.session.save(function(err){*/

          req.session.userType = "customer"; 
          req.session.userId = user.customer_id;

          res.send(token)

      }
      } else {
        res.status(400).json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

//PROFILE
//to fetch profile from FE.
users.get('/customer', (req, res) => {
  //to verify authorization sent from FE with secret key
  //it converts token back to the object we created
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  CustomerUser.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
        res.status(200).json({ message: 'User found' }); /* added by Shawn */
      } else {
        //res.send('User does not exist')
        res.status(400).json({ error: 'User does not exist' }); /* added by Shawn */
      }
    })
    .catch(err => {
      //res.send('error: ' + err)
      res.status(400).json({ error: err }); /* added by Shawn */
    })
})
module.exports = users
