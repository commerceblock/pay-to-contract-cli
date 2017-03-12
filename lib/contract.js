const PrivateKey = require('bitcore-lib/lib/privatekey');
const PublicKey = require('bitcore-lib/lib/publickey');
const HDPrivateKey = require('bitcore-lib/lib/hdprivatekey');
const HDPublicKey = require('bitcore-lib/lib/hdpublickey');
const Point = require('bitcore-lib/lib/crypto/point');
const bn = require('bitcore-lib/lib/crypto/bn');
const bufferUtil = require('bitcore-lib/lib/util/buffer');
const hashUtil = require('bitcore-lib/lib/crypto/hash');


const generateChildHash = exports.generateChildHash = function(hdPublicKey, childName) {
  const data = bufferUtil.concat([hdPublicKey.publicKey.toBuffer(), new Buffer(childName)]);
  const hash = hashUtil.sha512hmac(data, hdPublicKey._buffers.chainCode);

  return hash;
};

exports.signAndHashContract = function(publicKey, contractString) {
  const contractSeed = hashUtil.sha256hmac(new Buffer(contractString), publicKey.toBuffer());

  //TODO: might be able to simplified.
  const contractPublicKey = HDPrivateKey.fromSeed(contractSeed).privateKey.publicKey;

  const contractHash = hashUtil.sha256(contractPublicKey.toBuffer()).toString('hex')

  return contractHash;
};

exports.generateChildPublicKey = function(hdPublicKey, childName) {
  const hash = generateChildHash(hdPublicKey, childName);
  const leftPart = bn.fromBuffer(hash.slice(0, 32), {
    size: 32
  });
  const chainCode = hash.slice(32, 64);
  const publicKey = PublicKey.fromPoint(Point.getG().mul(leftPart).add(hdPublicKey.publicKey.point));

  return new HDPublicKey({
    network: hdPublicKey.network,
    depth: hdPublicKey.depth + 1,
    parentFingerPrint: hdPublicKey.fingerPrint, //TODO:: what is this?
    childIndex: 0,
    chainCode: chainCode,
    publicKey: publicKey
  });
};

exports.generateChildPrivateKey = function(hdPrivateKey, childName) {
  const hash = generateChildHash(hdPrivateKey.hdPublicKey, childName);
  const leftPart = bn.fromBuffer(hash.slice(0, 32), {
    size: 32
  });
  const chainCode = hash.slice(32, 64);
  const privateKey = leftPart.add(hdPrivateKey.privateKey.toBigNumber()).mod(Point.getN()).toBuffer({
    size: 32
  });

  return new HDPrivateKey({
    network: hdPrivateKey.network,
    depth: hdPrivateKey.depth + 1,
    parentFingerPrint: hdPrivateKey.fingerPrint,
    childIndex: 0,
    chainCode: chainCode,
    privateKey: privateKey
  });
};
