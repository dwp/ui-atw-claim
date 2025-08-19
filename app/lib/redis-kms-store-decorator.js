 
const logger = require('../logger/logger');

const log = logger('lib:redis-kms-store-decorator');

const RedisKMSDecorator = (RedisStore, cryptoService) => {
  const getRedis = RedisStore.prototype.get;
  const setRedis = RedisStore.prototype.set;

   
  RedisStore.prototype.get = function (sid, callback) {
    getRedis.call(this, sid, (err, data) => {
      if (typeof data === 'object' && ('ciphertext' in data) && ('cipherkey' in data)) {
        cryptoService.decrypt({
          ciphertext: Buffer.from(data.ciphertext, 'base64'),
          cipherkey: Buffer.from(data.cipherkey, 'base64'),
        }).then((dec) => {
          callback(null, JSON.parse(dec.toString('utf8')));
        }).catch((e) => {
          log.error(e);
          log.error(err);
          callback(err);
        });
      } else {
        callback(err, data);
      }
    });
  };

   
  RedisStore.prototype.set = function (sid, session, callback) {
    let sessionString;
    try {
      sessionString = JSON.stringify(session);
    } catch (ex) {
      log.error(ex);
      callback(ex);
      return;
    }

    cryptoService.encrypt({
      plaintext: Buffer.from(sessionString, 'utf8'),
    }).then((enc) => {
      setRedis.call(this, sid, {
        ciphertext: enc.ciphertext.toString('base64'),
        cipherkey: enc.cipherkey.toString('base64'),
      }, callback);
    }).catch((err) => {
      log.error(err);
      callback(err);
    });
  };
};

module.exports = RedisKMSDecorator;
