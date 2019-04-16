const assert = require('assert');
const btoa = require('btoa');
const axios = require('axios');


const slpdb = {
  query: (query) => new Promise((resolve, reject) => {
    if (! query) {
      return resolve(false);
    }
    const b64 = btoa(JSON.stringify(query));
    const url = "https://slpdb.fountainhead.cash/q/" + b64;
  
    console.log(url)
    resolve(axios.get(url).then(data => data.data));
  }),
}

