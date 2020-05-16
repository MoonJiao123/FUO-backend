/**
 * This file is to set up model for carts.
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize')
const db = require('../config/DB.js'); //the connection to database
//var Product = require('./ProductModel');
var Customer = require('./CustomerModel');
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
    },
    // product_id: {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: Product,
    //     key: "product_id"
    //   }
    // },
    customer_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Customer,
        key: "customer_id"
      }
    }

  },
  {
    timestamps: false //Sequelize default to timestamps, set to true if we decide to use it
  }
)

//Cart.hasMany(Product, {as: 'product', foreignKey: 'product_id'})
Cart.belongsTo(Customer, { as: 'customer_cart', foreignKey: 'customer_id' })
module.exports = Cart   