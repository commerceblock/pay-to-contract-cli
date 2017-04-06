'use strict';

const contract = require('pay-to-contract-lib/lib/contract');
const HDPublicKey = require('bitcore-lib/lib/hdpublickey');

module.exports = function(program) {

  program
    .command('derive-address-from-hash <pubkey> <path>')
    .description('derive a child address from a given BIP32 compliant path')
    .action(function(pubkey, path) {
      const hdPublicKey = HDPublicKey.fromString(pubkey)
      const result = hdPublicKey.derive(path).toString()

      console.log(result);
    });

};
