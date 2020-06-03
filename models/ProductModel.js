/**
 * Description:
 * This file is to set up the product model for product.
 * The data in this are corresponding to the fields in our database to BE.
 * the type of value here should be the same as the value property of the fields we created in database
 *
 * Public Class: 
 *  -BelongsTo: One-to-one association
 *   The A.belongsTo(B) association means that a One-To-One relationship exists between A and B, with the foreign key 
 *   being defined in the source model (A).
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize');
//the connection to database
const db = require('../config/DB.js');

var Store = require('./StoreModel');

//define products model here, and reflect the fields in our database to BE
//the value set here should be the same as the value property of the field we created in database
var Product = db.sequelize.define(
  "products",
  {
    product_id: {
      type: Sequelize.INTEGER,
      //Automatically gets converted to SERIAL for MySQL
      autoIncrement: true,
      primaryKey: true
    },
    product_name: {
      type: Sequelize.STRING,
      defaultValue: "None"
    }, 
    product_img: {
      type: Sequelize.STRING,
      defaultValue: "https://corona-food.herokuapp.com/static/media/error.4e5e3349.png"
    },
    category: {
      type: Sequelize.STRING,
      defaultValue: "None"
    },
    price: {
      type: Sequelize.DOUBLE,
      defaultValue: 0
    },
    discounted_price: {
      type: Sequelize.DOUBLE,
      defaultValue: 0
    },
    expire_date: {
      type: Sequelize.STRING,
      defaultValue: "None"
    },
    stock_amount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    coupon: {
      type: Sequelize.STRING,
      defaultValue: "50"
    },
    distance: {
       type: Sequelize.VIRTUAL
    }

  },
  {
    //Sequelize default to timestamps, set to true if we decide to use it
    timestamps: false
  }
)

//product belongs to store
Product.belongsTo(Store, { as: 'store_product', foreignKey: 'store_id', onDelete: 'CASCADE'});
//Product.belongsTo(Cart, { as: 'cart_product', foreignKey: 'cart_id' , constraints: false});

module.exports = Product;
