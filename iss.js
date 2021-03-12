const request = require('request');


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json',
    (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      } else if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
        return;
      }
      const ip = JSON.parse(body).ip;
      if (ip) {
        callback(null, ip);
      }
    });
};

      
      
// const data = JSON.parse(body);
// console.log('error:', error); // Print the error if one occurred
// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
// console.log('body:', body); // Print the HTML for the Google homepage.
   
    
      

      

const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
        return;

      }
      const { latitude, longitude } = JSON.parse(body);

      callback(null, { latitude, longitude });
    });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;

    } else {
      const passTimes = JSON.parse(body);
      callback(null, passTimes);
    }
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
 
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, passTimes);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };

