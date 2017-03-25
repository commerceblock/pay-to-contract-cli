'use strict';

const contract = require('pay-to-contract-lib/lib/contract');
const fs = require('fs');
const crypto = require('crypto');
const HDPublicKey = require('bitcore-lib/lib/hdpublickey');
const HDPrivateKey = require('bitcore-lib/lib/hdprivatekey');

module.exports = function(program) {

  program
    .command('claim-contract-funds <prvkey> <contractformfile> <signedcontractfile>')
    .description('claim contract funds')
    .action(function(prvkey, contractformfile, signedcontractfile) {
      const contractFormHash = crypto.createHash('sha512');
      const contractFormStream = fs.createReadStream(contractformfile);

      contractFormStream.on('data', function(data) {
        contractFormHash.update(data, 'utf8');
      });

      contractFormStream.on('end', function() {
        const signature = contractFormHash.digest('hex');
        const masterPrivateKey = HDPrivateKey.fromString(prvkey);
        const contractSignatureHash = contract.signAndHashContract(masterPrivateKey.privateKey.publicKey, signature);
        const paymentBasePrivateKey = contract.generateChildPrivateKey(masterPrivateKey, contractSignatureHash);

        const signedContractStream = fs.createReadStream(contractformfile);
        const signedContractHash = crypto.createHash('sha512');

        signedContractStream.on('data', function(data) {
          signedContractHash.update(data, 'utf8');
        });
        signedContractStream.on('end', function() {
          const signature = signedContractHash.digest('hex');

          const contractSignatureHash = contract.signAndHashContract(paymentBasePrivateKey.privateKey.publicKey, signature);
          const paymentAddressPrivateKey = contract.generateChildPrivateKey(paymentBasePrivateKey, contractSignatureHash);

          console.log(paymentAddressPrivateKey.toString());
        });
      });

    });

};
