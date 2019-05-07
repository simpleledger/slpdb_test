const assert = require('assert')
const slpdb = require('../slpdb')

describe('utxos', () => {
  [
    'tokenDetails',
    'tokenDetails.tokenIdHex',
    'utxo',
    'txid',
    'vout',
    'address', 
    'bchSatoshis', 
    'slpAmount'
  ].forEach(key => describe(`#${key} exists`, () => {
    it(`there should be no utxo documents without a ${key} property`, () =>
      slpdb.query(slpdb.exists(key, 'x'))
        .then((data) => assert.strict.equal(0, data.x.length))
    )
  }))
  describe('utxos.tokenDetails', () => {
    describe('#tokenIdHex correct format', () =>
      it('tokenIdHex must exist and must be hex string of 64 length', () =>
        slpdb.query(slpdb.inverse_match_regex('tokenDetails.tokenIdHex', 'x', slpdb.regex.TOKENIDHEX))
          .then((data) => assert.strict.equal(0, data.x.length))
      )
    )
  })
  describe('#utxos.utxo correct format', () => {
    it('utxo must follow the regex provided for txid:vout', () =>
      slpdb.query(slpdb.inverse_match_regex('utxo', 'x', slpdb.regex.UTXO))
        .then((data) => assert.strict.equal(0, data.x.length))
    )
  })
})
