(() => {
  const configResult = require('dotenv').config()
  if (configResult.error) {
    throw configResult.error
  }
})()

const assert = require('assert')
const btoa = require('btoa')
const axios = require('axios')
const _ = require('lodash')

const slpdb = {
  query: (query) => new Promise((resolve, reject) => {
    if (!query) {
      return reject(new Error('no query provided'))
    }
    const b64 = btoa(JSON.stringify(query))
    const url = process.env.SLPSERVE_URL + b64

    // log to help debugging
    console.info(url)

    resolve(axios.get(url)
      .then(data => data.data,
        e => reject(e))
    )
  }),

  // helper query to check the property exists
  exists: (prop, db, additional_requirements = {}) => {
    let find = {
      [prop]: {
        '$exists': false
      }
    }
    _.merge(find, additional_requirements)

    return {
      'v': 3,
      'q': {
        'db': [db],
        'find': find,
        'limit': 1
      }
    }
  },

  inverse_match_regex: (prop, db, regex) => ({
    'v': 3,
    'q': {
      'db': [db],
      'find': {
        [prop]: {
          '$regex': `^((?!${regex}).)*$`
        }
      },
      'limit': 1
    }
  }),

  inverse_match_array: (prop, db, arr) => ({
    'v': 3,
    'q': {
      'db': [db],
      'find': {
        [prop]: {
          '$nin': arr
        }
      },
      'limit': 1
    }
  })
}

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
      })
      .then((data) => assert.strict.equal(0, data.t.length))
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
        slpdb.query(slpdb.inverse_match_regex('tokenDetails.tokenIdHex', 't', '[0-9a-f]{64}'))
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

describe('confirmed', () => {
  [
    'tx',
    'tx.h',
    'in',
    'in.i',
    'in.str',
    'in.e',
    'in.e.h',
    'in.e.i',
    'in.e.a',
    'out',
    'out.i',
    'out.str',
    'out.e',
    'out.e.v',
    'out.e.i',
    'slp',
    'slp.valid',
    'blk',
    'blk.h',
    'blk.i',
    'blk.t'
  ].forEach(key => describe(`#${key} exists`, () => {
    it(`there should be no confirmed documents without a ${key} property`, () =>
      slpdb.query(slpdb.exists(key, 'c'))
        .then((data) => assert.strict.equal(0, data.c.length))
    )
  }));

  [
    'slp.detail',
    'slp.detail.decimals',
    'slp.detail.tokenIdHex',
    'slp.detail.transactionType',
    'slp.detail.versionType',
    'slp.detail.documentUri',
    'slp.detail.documentSha256Hex',
    'slp.detail.symbol',
    'slp.detail.name',
    'slp.detail.txnBatonVout',
    'slp.detail.txnContainsBaton',
    'slp.detail.outputs',
    'slp.detail.outputs.address',
    'slp.detail.outputs.amount',
    'slp.invalidReason',
    'slp.schema_version'
  ].forEach(key => describe(`#${key} exists`, () => {
    it(`there should be no confirmed documents without a ${key} property`, () =>
      slpdb.query(slpdb.exists(key, 'c', { 'slp.valid': true }))
        .then((data) => assert.strict.equal(0, data.c.length))
    )
  }))
})

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
})

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
})

describe('utxos', () => {
  [
    'tokenDetails',
    'tokenDetails.tokenIdHex',
    'utxo'
  ].forEach(key => describe(`#${key} exists`, () => {
    it(`there should be no utxo documents without a ${key} property`, () =>
      slpdb.query(slpdb.exists(key, 'x'))
        .then((data) => assert.strict.equal(0, data.x.length))
    )
  }))
  describe('utxos.tokenDetails', () => {
    describe('utxos.tokenDetails.tokenIdHex', () =>
      slpdb.query(slpdb.inverse_match_regex('tokenDetails.tokenIdHex', 'x', '[0-9a-f]{64}'))
        .then((data) => assert.strict.equal(0, data.x.length))
    )
  })
  describe('#utxos.utxo correct format', () => {
    it('utxo must follow the regex provided for txid:vout', () =>
      slpdb.query(slpdb.inverse_match_regex('utxo', 'x', '[0-9a-f]{64}:[0-9]+'))
        .then((data) => assert.strict.equal(0, data.x.length))
    )
  })
})
