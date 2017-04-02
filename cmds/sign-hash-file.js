'use strict';

const contract = require('pay-to-contract-lib/lib/contract');
const fs = require('fs');
const crypto = require('crypto');
const HDPublicKey = require('bitcore-lib/lib/hdpublickey');

module.exports = function(program) {

  program
    .command('sign-hash-file <pubkey> <file>')
    .description('sign contract with public key and output sha512 signature')
    .action(function(pubkey, file) {
			const hash = crypto.createHash('sha512');
			const stream = fs.createReadStream(file);
			stream.on('data', (data) => hash.update(data, 'utf8'));
			stream.on('end', function () {
    		const signature = hash.digest('hex');
				const hdPublicKey = HDPublicKey.fromString(pubkey);
				const result = contract.signAndHashContract(hdPublicKey.publicKey, signature);

				console.log(result.toString());
			});
    });

};
