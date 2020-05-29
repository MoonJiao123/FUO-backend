/**
 * Description:
 * This file is to set up the cart model for shoppingcart.
 * The data in this are corresponding to the fields in our database to BE.
 * the type of value here should be the same as the value property of the fields we created in database
 * 
 * Public Class: 
 *  -HasMany: One-to-many association
 *   The A.hasMany(B) association means that a One-To-Many relationship exists between A and B, with the foreign key 
 *   being defined in the target model (B).
 * 
 *  -BelongsTo: One-to-one association
 *   The A.belongsTo(B) association means that a One-To-One relationship exists between A and B, with the foreign key 
 *   being defined in the source model (A).
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize')
//the connection to database
const db = require('../config/DB.js');

var Customer = require('./CustomerModel');
var Product = require('./ProductModel');

//define carts model here, and reflect the fields in our database to BE
//the value set here should be the same as the value property of the field we created in database
var Cart = db.sequelize.define(
  "carts",
  {
    cart_id: {
      type: Sequelize.INTEGER,
      //Automatically gets converted to SERIAL for MySQL
      autoIncrement: true,
      primaryKey: true
    },
    
    product_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Product,
        key: "product_id"
      }
    },
    customer_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Customer,
        key: "customer_id"
      }
    }

  },
  {
    //Sequelize default to timestamps, set to true if we decide to use it
    timestamps: false
  }
)

//cart has many products
Cart.hasMany(Product, { as: 'product', foreignKey: 'product_id', constraints: false })
//cart belongs to customer
Cart.belongsTo(Customer, { as: 'customer_cart', foreignKey: 'customer_id' })

module.exports = Cart   