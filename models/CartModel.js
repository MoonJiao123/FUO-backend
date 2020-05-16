/**
 * This file is to set up model for carts.
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize')
const db = require('../config/DB.js'); //the connection to database
var Customer = require('./CustomerModel');
var Product = require('./ProductModel');
//define carts model here, and reflect the fields in our database to BE
//the value set here should be the same as the value property of the field we created in database
var Cart = db.sequelize.define(
  "carts",
  {
    cart_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: Sequelize.STRING
    },
    total_price: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false //Sequelize default to timestamps, set to true if we decide to use it
  }
)

Cart.belongsTo(Customer)
Cart.hasMany(Product)

module.exports = Cart   