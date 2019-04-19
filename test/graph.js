const assert = require('assert')
const slpdb = require('../slpdb')

describe('graphs', () => {
  [
    'tokenDetails',
    'tokenDetails.tokenIdHex',
    'graphTxn',
    'graphTxn.txid',
    'graphTxn.timestamp',
    'graphTxn.block',
    'graphTxn.details',
    'graphTxn.details.decimals',
    'graphTxn.details.tokenIdHex',
    'graphTxn.details.timestamp',
    'graphTxn.details.transactionType',
    'graphTxn.details.versionType',
    'graphTxn.details.documentUri',
    'graphTxn.details.documentSha256Hex',
    'graphTxn.details.symbol',
    'graphTxn.details.name',
    'graphTxn.details.batonVout',
    'graphTxn.details.containsBaton',
    'graphTxn.details.genesisOrMintQuantity',
    'graphTxn.details.sendOutputs',
    'graphTxn.outputs',
    'graphTxn.outputs.slpAmount',
    'graphTxn.outputs.address',
    'graphTxn.outputs.vout',
    'graphTxn.outputs.bchSatoshis',
    'graphTxn.outputs.spendTxid',
    'graphTxn.outputs.status',
    'graphTxn.outputs.invalidReason'
  ].forEach(key => describe(`#${key} exists`, () => {
    it(`there should be no graph documents without a ${key} property`, () =>
      slpdb.query(slpdb.exists(key, 'g'))
        .then((data) => assert.strict.equal(0, data.g.length))
    )
  }))
  describe('graphs.graphTxn', () => {
    describe('#txid correct format', () =>
      it('txid must exist and must be hex string of 64 length', () =>
        slpdb.query(slpdb.inverse_match_regex('graphTxn.txid', 'g', slpdb.regex.TXID))
          .then((data) => assert.strict.equal(0, data.g.length))
      )
    )
    describe('graphs.graphTxn.details', () => {
      describe('#tokenIdHex correct format', () =>
        it('tokenIdHex must exist and must be hex string of 64 length', () =>
          slpdb.query(slpdb.inverse_match_regex('graphTxn.details.tokenIdHex', 'g', slpdb.regex.TOKENIDHEX))
            .then((data) => assert.strict.equal(0, data.g.length))
        )
      )
    })
  })
})
