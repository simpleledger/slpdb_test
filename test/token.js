const assert = require('assert')
const slpdb = require('../slpdb')

describe('tokens', () => {
  [
    'schema_version',
    'lastUpdatedBlock',
    'mintBatonUtxo',
    'tokenDetails',
    'tokenDetails.decimals',
    'tokenDetails.tokenIdHex',
    'tokenDetails.timestamp',
    'tokenDetails.transactionType',
    'tokenDetails.versionType',
    'tokenDetails.documentUri',
    'tokenDetails.documentSha256Hex',
    'tokenDetails.symbol',
    'tokenDetails.name',
    'tokenDetails.batonVout',
    'tokenDetails.containsBaton',
    'tokenDetails.genesisOrMintQuantity',
    'tokenDetails.sendOutputs',
    'tokenStats',
    'tokenStats.block_created',
    'tokenStats.block_last_active_send',
    'tokenStats.block_last_active_mint',
    'tokenStats.qty_valid_txns_since_genesis',
    'tokenStats.qty_valid_token_utxos',
    'tokenStats.qty_valid_token_addresses',
    'tokenStats.qty_token_minted',
    'tokenStats.qty_token_burned',
    'tokenStats.qty_token_circulating_supply',
    'tokenStats.qty_satoshis_locked_up',
    'tokenStats.minting_baton_status'
  ].forEach(key => describe(`#${key} exists`, () => {
    it(`there should be no token documents without a ${key} property`, () =>
      slpdb.query(slpdb.exists(key, 't'))
        .then((data) => assert.strict.equal(0, data.t.length))
    )
  }))

  describe('#mintBatonUtxo correct format', () => {
    it('mintBatonUtxo must be either empty string or follow the regex provided for txid:vout', () =>
      slpdb.query({
        'v': 3,
        'q': {
          'db': ['t'],
          'aggregate': [
            {
              '$match': {
                'mintBatonUtxo': {
                  '$ne': ''
                }
              }
            },
            {
              '$match': {
                'mintBatonUtxo': {
                  '$regex': `^((?![0-9a-f]{64}:[0-9]+).)*$`
                }
              }
            },
            {
              '$count': 'mintBatonUtxo'
            }
          ],
          'limit': 1
        }
      }).then((data) => assert.strict.equal(0, data.t.length))
    )
  })

  describe('tokens.tokenDetails', () => {
    describe('#tokenDetails.decimals correct format', () => {
      it('decimals must be 0-9', () =>
        slpdb.query(slpdb.inverse_match_array('tokenDetails.decimals', 't', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
          .then(data => assert.strict.equal(0, data.t.length))
      )
    })
    describe('#tokenDetails.tokenIdHex correct format', () => {
      it('tokenIdHex must exist and must be hex string of 64 length', () =>
        slpdb.query(slpdb.inverse_match_regex('tokenDetails.tokenIdHex', 't', slpdb.regex.TOKENIDHEX))
          .then((data) => assert.strict.equal(0, data.t.length))
      )
    })
    describe('#tokenDetails.transactionType correct format', () => {
      it('transactionType must be GENESIS', () =>
        slpdb.query(slpdb.inverse_match_regex('tokenDetails.transactionType', 't', 'GENESIS'))
          .then((data) => assert.strict.equal(0, data.t.length))
      )
    })
    describe('#tokenDetails.versionType correct format', () => {
      it('versionType must be 1', () =>
        slpdb.query(slpdb.inverse_match_array('tokenDetails.versionType', 't', [1]))
          .then((data) => assert.strict.equal(0, data.t.length))
      )
    })
  })
})
