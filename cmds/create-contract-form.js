'use strict';

const contract = require('../lib/contract');
const fs = require('fs');
const crypto = require('crypto');
const HDPublicKey = require('bitcore-lib/lib/hdpublickey');

module.exports = function(program) {

  program
    .command('create-contract-form <pubkey> <file>')
    .description('create contract form')
    .action(function(pubkey, file) {
			const hash = crypto.createHash('sha512');
			const stream = fs.createReadStream(file);

			stream.on('data', function (data) {
    		hash.update(data, 'utf8');
			});

			stream.on('end', function () {
    		const signature = hash.digest('hex');
				const hdPublicKey = HDPublicKey.fromString(pubkey);
				const contractSignatureHash = contract.signAndHashContract(hdPublicKey.publicKey, signature);
				const result = contract.generateChildPublicKey(hdPublicKey, contractSignatureHash);

				console.log(result.toString());
			});

    });

};
