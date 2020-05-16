/**
 * This file is to set up model for products.
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize');
const db = require('../config/DB.js'); //the connection to database
var Store = require('./StoreModel');
//define products model here, and reflect the fields in our database to BE
//the value set here should be the same as the value property of the field we created in database
var Product = db.sequelize.define(
    "products",
    {
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      product_name: {
        type: Sequelize.STRING
      },
      product_image: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      expire_date: {
        type: Sequelize.STRING
      },
      stock_amount: {
        type: Sequelize.INTEGER
      },
      coupon: {
        type: Sequelize.STRING
      },
      
    },
    {
      timestamps: false //Sequelize default to timestamps, set to true if we decide to use it
    }
)
Product.belongsTo(Store)
module.exports = Product