const assert = require('assert')
const slpdb = require('../slpdb')

describe('addresses', () => {
  [
    'tokenDetails',
    'tokenDetails.tokenIdHex',
    'address',
    'satoshis_balance',
    'token_balance'
  ].forEach(key => describe(`#${key} exists`, () => {
    it(`there should be no address documents without a ${key} property`, () =>
      slpdb.query(slpdb.exists(key, 'a'))
        .then((data) => assert.strict.equal(0, data.a.length))
    )
  }))
  describe('addresses.tokenDetails', () => {
    describe('#tokenIdHex correct format', () =>
      it('tokenIdHex must exist and must be hex string of 64 length', () =>
        slpdb.query(slpdb.inverse_match_regex('tokenDetails.tokenIdHex', 'a', slpdb.regex.TOKENIDHEX))
          .then((data) => assert.strict.equal(0, data.a.length))
      )
    )
  })
  describe('#satoshis_balance correct format', () =>
    it('satoshis_balance must be a positive integer', () =>
      slpdb.query({
        'v': 3,
        'q': {
          'db': 'a',
          'find': {
            'satoshis_balance': {
              '$lt': 546
            }
          },
          'limit': 1
        }
      }).then((data) => assert.strict.equal(0, data.a.length))
    )
  )
})
