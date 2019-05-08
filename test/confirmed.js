const assert = require('assert')
const slpdb = require('../slpdb')

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
  ].forEach(key => describe(`#${key} exists and not null`, () => {
    it(`there should be no confirmed documents with a null ${key} property`, () =>
      slpdb.query(slpdb.match(key, 'c', {
        '$exists': true,
        '$eq': null
      }))
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
    'slp.detail.txnContainsBaton',
    'slp.detail.outputs',
    'slp.detail.outputs.address',
    'slp.detail.outputs.amount',
    'slp.schema_version'
  ].forEach(key => describe(`#${key} exists and not null`, () => {
    it(`there should be no confirmed documents with a null ${key} property`, () =>
      slpdb.query(slpdb.match(key, 'c', {
        '$exists': true,
        '$eq': null
      }, {
        'slp.valid': true
      }))
      .then((data) => assert.strict.equal(0, data.c.length))
    )
  }))

  describe('tx', () => {
    describe('tx.h', () => {
      describe('#h correct format', () =>
        it('tx.h must exist and must be hex string of 64 length', () =>
          slpdb.query(slpdb.inverse_match_regex('tx.h', 't', slpdb.regex.TXID))
            .then((data) => assert.strict.equal(0, data.t.length))
        )
      )
    })
  })
  describe('confirmed.slp', () => {
    describe('confirmed.slp.details', () => {
      describe('#tokenIdHex correct format', () => {
        it('tokenIdHex must exist and must be hex string of 64 length', () =>
          slpdb.query(slpdb.inverse_match_regex('slp.details.tokenIdHex', 'g', slpdb.regex.TOKENIDHEX))
            .then((data) => assert.strict.equal(0, data.g.length))
        )
      })
    })
  })
})
