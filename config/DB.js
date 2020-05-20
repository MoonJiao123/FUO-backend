/**
 * Description:
 * This file is to set up the connection to database.
 *
 * Contributors: Yue Jiao, Yunning Yang
 */

const Sequelize = require('sequelize')
const DB = {}

//set up connection: Sequelize(database name, user name of local host, password,{})
const sequelize = new Sequelize('heroku_8af0b174b3133de', 'b1d9fe9f5be15a', '87666a20', {
    host: 'us-cdbr-east-06.cleardb.net',
    //type of the database we use
    dialect: 'mysql',
    //use to complete comparison, we won't use it yet, so set to false
    operatorsAliases: false,

    //connection part of the Sequelize
    pool: {
        //maximum number of connections
        max: 5,
        //minimum number of connections
        min: 0,
        //maximum time in millisecond to get connection before throwing an error
        acquire: 30000,
        //connection can be idle before being released
        idle: 10000
    }
})

DB.sequelize = sequelize
DB.Sequelize = Sequelize

module.exports = DB