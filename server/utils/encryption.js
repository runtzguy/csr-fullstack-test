const bcrypt = require('bcryptjs');
/**
 * This method generates Hash with password and Salt Round given. 
 * @param  {String} password - password to hash
 * @param  {String} saltRound - if no salt is given, default is 10
 * 
 * @return {Promise} - resolve containing hash value or reject containing error
 */
const generateHashWithSaltRound = (password, saltRound = 10) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRound, (err, salt) => {
            if(err) reject(err);
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        })
    })
}
/**
 * this method checks to see if password and hash value matches
 * @param  {string} password
 * @param  {string} hash
 * 
 * @return {Promise} -returns resolve(true) or resolve(false)
 */
const doPasswordsMatch = (password, hash) => {
    return new Promise ((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}

module.exports = {generateHashWithSaltRound, doPasswordsMatch};