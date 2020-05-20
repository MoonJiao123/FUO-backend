/**
 * Description:
 * This file is to set up the store model for business user's locations.
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

const Sequelize = require('sequelize')
//the connection to database
const db = require('../config/DB.js');
var Business = require('./BusinessModel.js')

//define stores model here, and reflect the fields in our database to BE
//the value set here should be the same as the value property of the field we created in database
var Store = db.sequelize.define(
    "stores",
    {
        store_id: {
            type: Sequelize.INTEGER,
            //Automatically gets converted to SERIAL for MySQL
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
        //Sequelize default to timestamps, set to true if we decide to use it
        timestamps: false
    }
)

//store belongs to business user
Store.belongsTo(Business, { foreignKey: 'business_id' });

module.exports = Store;