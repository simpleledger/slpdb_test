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

describe('tokens', () => {
  describe('#tokenDetails exists', () => {
    it('there should be no token documents without a tokenDetails property', () =>
      slpdb.query({
        "v": 3,
        "q": {
          "db": ["t"],
          "find": {
            "tokenDetails": {
              "$exists": false
            }
          },
          "limit": 10
        }
      }).then((data) => assert.equal(0, data.t.length))
    )
  });
  describe('#tokenStats exists', () => {
    it('there should be no token documents without a tokenStats property', () =>
      slpdb.query({
        "v": 3,
        "q": {
          "db": ["t"],
          "find": {
            "tokenStats": {
              "$exists": false
            }
          },
          "limit": 10
        }
      }).then((data) => assert.equal(0, data.t.length))
    )
  });
  describe('#mintBatonUtxo correct format', () => {
    it('mintBatonUtxo must be either empty string or follow the regex provided for txid:vout', () =>
      Promise.all([
        slpdb.query({
          "v": 3,
          "q": {
            "db": ["t"],
            "aggregate": [
              {
                "$count": "mintBatonUtxo"
              }
            ],
            "limit": 1
          }
        }),
        slpdb.query({
          "v": 3,
          "q": {
            "db": ["t"],
            "aggregate": [
              {
                "$match": {
                  "$or": [
                    {
                      "mintBatonUtxo": {
                        "$eq": ""
                      }
                    },
                    {
                      "mintBatonUtxo": {
                        "$regex": "^[0-9a-f]{64}:[0-9]+$"
                      }
                    }
                  ]
                }
              },
              {
                "$count": "mintBatonUtxo"
              }
            ],
            "limit": 1
          }
        })
      ]).then(([total, mint_baton_matched]) => assert.equal(total.t.mintBatonUtxo, mint_baton_matched.t.mintBatonUtxo))
    )
  });
  describe('#tokenDetails.decimals correct format', () => {
    it('decimals must be 0-9', () =>
      slpdb.query({
        "v": 3,
        "q": {
          "db": ["t"],
          "aggregate": [
            {
              "$match": {
                "$or": [
                  {
                    "tokenDetails.decimals": {
                      "$gt": 9
                    }
                  },
                  {
                    "tokenDetails.decimals": {
                      "$lt": 0
                    }
                  },
                  {
                    "tokenDetails.decimals": {
                      "$not": {
                        "$type": "number"
                      }
                    }
                  }
                ]
              }
            },
            {
              "$count": "mintBatonUtxo"
            }
          ],
          "limit": 1
        }
      }).then(data => assert.equal(0, data.t.length))
	)
  })
  describe('#tokenDetails.decimals correct format', () => {
    it('decimals must be 0-9', () =>
      Promise.all([
		slpdb.query({
          "v": 3,
          "q": {
            "aggregate": [
              {
                "$count": "mintBatonUtxo"
              }
            ],
            "limit": 1
          }
        }),
        slpdb.query({
          "v": 3,
          "q": {
            "aggregate": [
              {
                "$match": {
                  "tokenDetails.tokenIdHex": {
                  "$regex": "^[0-9a-f]{64}$"
                  }
                }
              },
              {
                "$count": "mintBatonUtxo"
              }
            ],
            "limit": 1
          }
        })
      ]).then(([total, tokenidhex_matched]) => assert.equal(total.t.mintBatonUtxo, tokenidhex_matched.t.mintBatonUtxo))
	)
  })
});

