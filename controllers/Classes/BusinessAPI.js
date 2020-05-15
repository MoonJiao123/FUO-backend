
/**
 * This file encapsulate all of the BusinessAPI functionality, web calls that would be important to the front end 
 *
 * Contributors: Derek Ta
 */


const express = require('express')
const businessUsers = express.Router()
/*Used for API Key generation
 *https://stackoverflow.com/questions/23327010/how-to-generate-unique-id-with-node-js
 */ 
const {v4: uuidv4 } = require('uuid')
const BUser = require('../../models/BusinessModel.js')


/* Class that encapsulates all API functionality and subsequent API calls*/
class BusinessAPI{

    /* Description: 
    * BusinessAPI constructor that will construct the business API object 
    * Parameters: 
    *   None
    * Return Values: 
    *   None
    */
    constructor(){

    }

    /* Description: 
     * Generates a new unique API key for the business user id and stores it in the model 
     * Parameters:
     *  - req: the request object from which this is being called
     *  - res: the repsonse object 
     * Return Values: 
     *  - None
     */
    generateApiKey(req,res){
        /* Invalid reference was passed in*/
        if(!user){
            res.json({ error: 'Invalid user, could not find'}, 404)
            return 
        }

        /*Update the user's api key*/
        var newApiKey = uuidv4(); 

        /*Find and update the database with the user's new API key*/
        /*https://stackoverflow.com/questions/8158244/how-to-update-a-record-using-sequelize-for-node*/
        user.update({
            api: newApiKey
        })
        .on('success', id=>{
            res.json({ message: 'Successfully created api key'},201)
        })
        .on('failure', error=>{
            res.json({ error: 'Encountered some error'},404)
        })


    }
}

/*Exporting a singleton to businessAPI*/
module.exports = new BusinessAPI(); 