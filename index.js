'use strict';

let unserialize = require('php-unserialize').unserialize;
let unserialize2 = require('php-serialization').unserialize;
let crypto = require('crypto');

module.exports = {
    getSessionKey: function (laravelSession, laravelKey) {
        //Get session object
        laravelSession = new Buffer(laravelSession, 'base64');
        laravelSession = laravelSession.toString();
        laravelSession = JSON.parse(laravelSession);

        //Create key buffer
        laravelKey = new Buffer(laravelKey, 'base64');

        //crypto required iv in binary or buffer
        laravelSession.iv = new Buffer(laravelSession.iv, 'base64');

        //create decoder
        let decoder = crypto.createDecipheriv('aes-256-cbc', laravelKey, laravelSession.iv);

        //add data to decoder and return decoded
        let decoded = decoder.update(laravelSession.value, 'base64');

        //unserialize
        return unserialize(decoded);
    },
    getSessionFromRedis: function (laravelSessionKey, redisConnection) {
        return new Promise(function (resolve, reject) {
            redisConnection.get('laravel:' + laravelSessionKey)
                .then(function (value) {
                    return resolve(unserialize2(unserialize2(value)).node);
                })
                .catch(reject);
        });
    }
};
