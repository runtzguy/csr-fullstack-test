const isPropertiesEmpty = require('../utils/general.js');
const mysql = require('mysql');
const {generateHashWithSaltRound, doPasswordsMatch }= require('../utils/encryption.js');
const getTodaysDateTime = require('../utils/date.js');

const env = process.env.NODE_ENV || 'development';
const config = require('../../config.js')[env];
const pool = mysql.createPool(config.database);

/**
 * Inserts new user into the Database
 * @param  {object} newUser - object containing key value pairs of DB table where key is column and value is value of record
 * @param  {object} connection - sql connection object
 * 
 * @return {Promise} - Returns either a resolve containing object or reject containing error
 */
const insertNewUserRecord = (newUser, connection) => {
    if(isPropertiesEmpty(newUser)){
        throw new Error('New User object properties cannot be null');
    }
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO Users SET ?', newUser, (err, results) => {
            if(err) {
                reject(err);
                return;
            };
            let msg = 'Successful Sign up of user: ' + newUser.email;

            resolve({insertId : results.insertId, affectedRows : results.affectedRows, msg});
        })
    })
}
/**
 * This method checks if email exist in database returns false or true
 * @param  {string} email - email of user
 * @param  {object} connection - sql connection object
 * 
 * @return {Promise} -returns a promise containing a boolean value 
 */
const checkUserByEmail = (email, connection) => {

    return new Promise((resolve,reject) => {
        //Check if email and connection are falsy
        if(!email || !connection){
            reject('Email/Connection must not be null or empty');
            //throw new Error('Email/Connection must not be null or empty');
            //console.log('ERROR')
        }
        connection.query('SELECT 1 FROM Users WHERE email = ?', [email], (err, result) => {
            if(err){
                reject(err);
                return;
            } 
            if(result.length == 0){
                resolve(true);
            } else {
                resolve(false);
            }
            
        })
    })
}
/**
 * Establish sql connection pool and checks to see if user email exist
 * @param  {string} userEmail - user email to check
 * 
 * @return {Promise} -promise containing either a reject(false) for no record or resolve(true) for found record
 */
const checkIfUserEmailExist = (userEmail) => {
    return new Promise( (resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err){
                reject(err);
                return
            };

            checkUserByEmail(userEmail, connection)
            .then((result) => {
                resolve(result);
            }).catch(err => {
                reject(err);
            }).finally( () => {
                connection.release();
            })
        })
    })
}
/**
 * Insert new user record into database
 * @param  {string} userEmail - user email
 * @param  {string} userPassword - user password
 * 
 * @return {Promise} - resolve returns an object inside.
 */
const insertNewUserAndGenerateHash = (userEmail, userPassword) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            generateHashWithSaltRound(userPassword, 10)
            .then( hashedPw => {
                let newUser = {email : userEmail, password: hashedPw, timestamp : getTodaysDateTime()};
                
                insertNewUserRecord(newUser, connection)
                .then( result => {
                    console.log('Result: ' + result.msg);
                    resolve(result);
                }).catch(err =>{
                    reject(err);
                })
                connection.release();
            })   
        })    
    });
}
/**
 * This method gets hash password by email 
 * @param  {string} email - user email
 * 
 * @return {Promise} -reject if no email exists or resolve if email exists
 */
const getHashPasswordByEmail = (email) => {
    return new Promise( (resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err){
                console.error(err);
                reject(err);
            }

            connection.query('SELECT password FROM Users WHERE email = ?', [email], (err, result) => {
                if(err){
                    reject(err);
                    return;
                }
                
                //Non existent email
                if(result.length == 0){
                    reject({msg : 'No such email exists', hash : null});
                } else {
                    resolve({msg : 'Found Email\'s password', hash : result[0].password});
                }
            })
        })
    });
}
/**
 * This method establishes connection to sql pool for checking if passwords match
 * @param  {string} userEmail - user email
 * @param  {string} userPassword - user password
 * 
 * @return {Promise} -resolve contains if passwords match; reject contains error
 */
const checkEmailAndPasswordMatches = (userEmail, userPassword) => {
    return new Promise( (resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err){
                console.error(err);
                reject(err);
            }

            connection.query('SELECT password FROM Users WHERE email = ?', [userEmail], (err, result) => {
                if(err){
                    console.error(err);
                    reject(err);
                    return;
                }

                doPasswordsMatch(result.password, userPassword)
                .then( (result) => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
            connection.release();
        })
    });
}


module.exports = {insertNewUserRecord, getHashPasswordByEmail, insertNewUserAndGenerateHash, checkIfUserEmailExist, checkEmailAndPasswordMatches};