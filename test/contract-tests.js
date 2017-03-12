const contract = require('../lib/contract');
const HDPublicKey = require('bitcore-lib/lib/hdpublickey');
const HDPrivateKey = require('bitcore-lib/lib/hdprivatekey');
const PublicKey = require('bitcore-lib/lib/publickey');
const assert = require('assert');


describe('contract tests', () => {

    it('generateChildHash', () => {
      const childName = 'hello-world';
      const hdPublicKey = HDPublicKey.fromString('xpub6BapBbRsbWSDQT6yMCiTXsJTJfdEVvi8AaV2zuSb2x8YQ4xJ7giyS8v4n8DmVf4giyNjHwZN2jj5dpgVYTDEncvmg84AnKWoPRqMpKyPW6h');
      const childHash = contract.generateChildHash(hdPublicKey, childName);
      const result = new Buffer(childHash).toString('base64');

      assert.equal(result, '68RvUwDjq+a8UQHgRXWIVC0rm8BZdwCrn+Wc3EXim4Vnqa9eBXE2x6nkGw7dvkx1TvrpzGprXFF85SLYFb2GsA==');
    })

    it('signAndHashContract', () => {
      const contractContent = 'hello-world';
      const hdPublicKey = HDPublicKey.fromString('xpub6BapBbRsbWSDQT6yMCiTXsJTJfdEVvi8AaV2zuSb2x8YQ4xJ7giyS8v4n8DmVf4giyNjHwZN2jj5dpgVYTDEncvmg84AnKWoPRqMpKyPW6h');
      const result = contract.signAndHashContract(hdPublicKey.publicKey, contractContent);

      assert.equal(result, 'b0685e39f14731bbc04002c2491cad68052537ad144e93ffdf787bf822a0d694');
    })

    it('generateChildPublicKey', () => {
      const childName = "satoshi"
      const hdPublicKey = HDPublicKey.fromString('xpub6BapBbRsbWSDQT6yMCiTXsJTJfdEVvi8AaV2zuSb2x8YQ4xJ7giyS8v4n8DmVf4giyNjHwZN2jj5dpgVYTDEncvmg84AnKWoPRqMpKyPW6h');
      const result = contract.generateChildPublicKey(hdPublicKey, childName);

      assert.equal(result.toString(), 'xpub6D8g4bu6LojJFVeTsSF5cHU2Eh1d4cbiMbptPv3h5Kdj4yXs9DYgMNW5FYrtpdBJxrcY98u3KyTiYkBhFJMNpeD1cnBu6cXgsWMAgmwcM42');
    })

    it('generateChildPrivateKey', () => {
      const childName = "satoshi"
      const hdPrivateKey = HDPrivateKey.fromString('xprv9v8nHsbWMhYY44amHzSgUXRmrK3hxATvv7ZkV5G7LQLvXEgwt3BNQJGF1YiSRGng9zsR7D6WTDBvpZDMpU1UgEMprjtccRCPf44WLawMfnC');
      const result = contract.generateChildPrivateKey(hdPrivateKey, childName);

      assert.equal(result.toString(), 'xprv9xbTn5tym8svC1h46dK6g55rMJ11kZjxz9nUrDRBqhxD1weFangerRck2BfXa4CmrqRNEXnrnaskpWeYQ61bPvQcazvpwwUscLc3Vjm1rAv');
    })

})
