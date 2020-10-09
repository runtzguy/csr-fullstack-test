/**
 * Gets todays date in the format of "2020-09-24 15:28:14"
 * @return {String} - returns today's date 
 */
function getTodaysDateTime() { 
    var date = new Date(); 
    return date.toISOString().split('T')[0] 
        + ' '  
        + date.toTimeString().split(' ')[0]; 
}

module.exports = getTodaysDateTime;