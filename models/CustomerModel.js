/**
 * Description:
 * This file is to set up the customer model for custmer user.
 * The data in this are corresponding to the fields in our database to BE.
 * the type of value here should be the same as the value property of the fields we created in database
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize')
//the connection to database
const db = require('../config/DB.js');
//var Cart = require('./CartModel')

//define consumer user model here, and reflect the fields in our database to BE
//the value set here should be the same as the value property of the field we created in database
var Customer = db.sequelize.define(
  "customers",
  {
    customer_id: {
      type: Sequelize.INTEGER,
      //Automatically gets converted to SERIAL for MySQL
      autoIncrement: true,
      primaryKey: true
    },
    account: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    customer_location: {
      type: Sequelize.STRING
    },
    customer_lat: {
      type: Sequelize.DOUBLE
    },
    customer_long: {
      type: Sequelize.DOUBLE
    }
  },
  {
    //Sequelize default to timestamps, set to true if we decide to use it
    timestamps: false
  }
)

module.exports = Customer;