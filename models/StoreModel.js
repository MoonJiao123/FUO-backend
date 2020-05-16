/**
 * This file is to set up model for stores.
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize')
const db = require('../config/DB.js'); //the connection to database
var Business = require('./BusinessModel.js')
//define stores model here, and reflect the fields in our database to BE
//the value set here should be the same as the value property of the field we created in database
var Store = db.sequelize.define(
    "stores",
    {
        store_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        address: {
            type: Sequelize.STRING
        },
        // //foreign key
        // business_id: {
        //     type: Sequelize.STRING,
        //     //forerign key
        //     references: {
        //         model: 'businesses', 
        //         key: 'business_id' 
        //     }
        // }
    },
    {
        timestamps: false //Sequelize default to timestamps, set to true if we decide to use it
    }
)
Store.belongsTo(Business);
module.exports = Store;