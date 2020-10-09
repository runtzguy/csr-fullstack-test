/**
 * This method checks to see if the object's key value pairs is empty or null
 * @param  {object to check} obj
 * @return {false if key value pairs is not empty; true if key value pairs has empty value} 
 */

function isPropertiesEmpty(obj) {
    for (let key in obj) {
        if (!obj[key])
            return true;
    }
    return false;
}

module.exports = isPropertiesEmpty;