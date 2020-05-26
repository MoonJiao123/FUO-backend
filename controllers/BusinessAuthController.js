/**
 * This file is to get the requested data of login/signup from the BusinessModel.js
 * Comparing the requested data with the data we have in database.
 * Return the result of comparison to FE.
 *
 * Contributors: Yue Jiao, Yunning Yang, Derek Ta, Shawn, Darien
 */

const express = require('express')
const businessUsers = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

/*We will reference the business API singleton*/
const BAPI = require('Classes/BusinessAPI.js')

const BUser = require('../models/BusinessModel.js')
businessUsers.use(cors())

process.env.SECRET_KEY = 'secret'

//SIGNUP
businessUsers.post('/register', (req, res) => {

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

  //since we only use email and password for login, so we only compare email here
  BUser.findOne({
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
          BUser.create(userData)
            .then(user => {
              res.status(200).json({ status: req.body.email + 'Registered!' })
            })
            .catch(err => {
              res.status(400).json({error: err})
            })
        })
      } else {
        res.status(400).json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.status(400).json({Error:'error: ' + err})
    })
})

//LOGIN
businessUsers.post('/login', (req, res) => {
  BUser.findOne({
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
          res.status(200).send(token)
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
businessUsers.get('/business', (req, res) => {
  //to verify authorization sent from FE with secret key
  //it converts token back to the object we created
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  BUser.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        //res.send('User does not exist')
        res.status(400).json({error: 'User does not exist'}) //Shawn
      }
    })
    .catch(err => {
      //res.send('error: ' + err)
      res.status(400).json({error: err}) //Shawn
    })
})


module.exports = businessUsers


// const authJwt = require('./verifyToken');
// const verifySignUp = require('./verifySignUp');

// module.exports = function(app) {
 
//   const controller = require('../controllers/business.controller.js');

// app.post('/api/auth/reg', [verifySignUp.checkDuplicateUserNameOrNameOrEmailOrMobile], controller.signup);

// app.post('/api/auth/login', controller.signin);

// // app.get('/business/user', [authJwt.verifyToken], controller.userContent);

// // app.get('/business', [authJwt.verifyToken, authJwt.isPmOrAdmin], controller.managementBoard);

// }
