

 /**
 * This file sets up the API endpoint to which the API key is generated
 * Contributors: 
 */

const express = require('express')
const businessUsers = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const BUser = require('../models/BusinessModel.js')
businessUsers.use(cors())

process.env.SECRET_KEY = 'secret'

//PROFILE
//to fetch profile from FE.
businessUsers.get('/business', (req, res) => {
  
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

