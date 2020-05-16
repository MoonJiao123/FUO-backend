/**
 * This file is to set up the connection to database.
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize')
const DB = {}

//set up connection: Sequelize(database name, user name of local host, password,{})
const sequelize = new Sequelize('heroku_90f3403bf02fffe', 'bd778a3ba469c4', '1641b41b', {
    host: 'us-cdbr-iron-east-01.cleardb.net',
    dialect: 'mysql', //type of the database we use
    operatorsAliases: false, //use to complete comparison, we won't use it yet, so set to false

    //connection part of the Sequelize
    pool: {
        max: 5, //maximum number of connections
        min: 0, //minimum number of connections
        acquire: 30000, //maximum time in millisecond to get connection before throwing an error
        idle: 10000 //connection can be idle before being released
    }
})

DB.sequelize = sequelize
DB.Sequelize = Sequelize

module.exports = DB