/**
 * This method retrieves all vehicle records from the DB
 * @param  {object} connection - sql object for connection to database
 * 
 * @return {Promise} - returns resolve containing Vehicle records or reject containing error
 */
const getAllVehicles = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Vehicles', (error, results) => {
            if(error) {
                reject(error);
            }
            
            resolve(results);
        });
    });
}

module.exports = getAllVehicles;
   