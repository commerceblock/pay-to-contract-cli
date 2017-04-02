'use strict';

const contract = require('pay-to-contract-lib/lib/contract');
const fs = require('fs');
const crypto = require('crypto');
const HDPublicKey = require('bitcore-lib/lib/hdpublickey');

module.exports = function(program) {

  program
    .command('compute-path-from-hash <sha512hash>')
    .description('compute a BIP32 child path form sha512 hash')
    .action(function(hash) {
      const result = contract.derivePath(hash);

      console.log(result);
    });

};
