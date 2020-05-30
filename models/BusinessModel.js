/**
 * Description:
 * This file is to set up the business model for business user.
 * The data in this are corresponding to the fields in our database to BE.
 * the type of value here should be the same as the value property of the fields we created in database
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize')
//the connection to database
const db = require('../config/DB.js');

//define business user model here, and reflect the fields in our database to BE
//the value set here should be the same as the value property of the field we created in database
module.exports = db.sequelize.define(
  "businesses",
  {
    business_id: {
      type: Sequelize.INTEGER,
      //Automatically gets converted to SERIAL for MySQL
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: "None"
    },
    password: {
      type: Sequelize.STRING,
      defaultValue: "None"
    },
    email: {
      type: Sequelize.STRING,
      defaultValue: "None"
    },
    mobile: {
      type: Sequelize.STRING,
      defaultValue: "None"
    },
    api: {
      type: Sequelize.STRING,
      defaultValue: "None"
    }
  },
  {
    //Sequelize default to timestamps, set to true if we decide to use it
    timestamps: false
  }
)

