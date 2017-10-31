'use strict';

const unserialize = require('php-unserialize').unserialize;
const unserialize2 = require('php-serialization').unserialize;
const crypto = require('crypto');
const fs = require('fs');

module.exports = {
    getAppKey: function (filepath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filepath, 'utf8', function (err, data) {
                if (err != null) return reject(err);

                let key = data.match(/APP_KEY.*/g);

                if (key.length == 0) reject('APP_KEY not found');
                key = key[0];
                key = key.split('=')[1].trim();

                return resolve(key.replace('base64:', ''));
            });
        });
    },
    getSessionKey: function (laravelSession, laravelKey, keyLength) {
        keyLength = keyLength || 32;
        let cypher = 'aes-' + keyLength * 8 + '-cbc';

        //Get session object
        laravelSession = new Buffer(laravelSession, 'base64');
        laravelSession = laravelSession.toString();
        laravelSession = JSON.parse(laravelSession);

        //Create key buffer
        laravelKey = new Buffer(laravelKey, 'base64');

        //crypto required iv in binary or buffer
        laravelSession.iv = new Buffer(laravelSession.iv, 'base64');

        //create decoder
        let decoder = crypto.createDecipheriv(cypher, laravelKey, laravelSession.iv);

        //add data to decoder and return decoded
        let decoded = decoder.update(laravelSession.value, 'base64');

        //unserialize
        return unserialize(decoded);
    },
    getSessionFromFile: function (laravelSessionKey, filePath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filePath + '/' + laravelSessionKey, 'utf8', function (err, data) {
                if (err != null) return reject(err);

                return resolve(unserialize2(data));
            });
        });
    },
    getSessionFromRedis: function (laravelSessionKey, redisConnection) {
        return new Promise(function (resolve, reject) {
            redisConnection.get('laravel:' + laravelSessionKey, function (err, value) {
                if (err != null) return reject(err);

                return resolve(unserialize2(unserialize2(value)));
            });
        });
    },
    getSessionFromMysql: function (laravelSessionKey, mySqlConnection, databaseTable) {
        return new Promise(function (resolve, reject) {
            databaseTable = databaseTable || 'sessions';

            mySqlConnection.query('select payload from ' + databaseTable + ' where id = "' + laravelSessionKey + '"', function (err, rows, fields) {
                if (err != null) return reject(err);
                if (rows.length == 0) reject('Session not found');
                let session = new Buffer(rows[0].payload, 'base64').toString();

                return resolve(unserialize(session));
            });
        });
    },
    getUserIdFromSession: function (session) {
        var cookieKey = 'login_82e5d2c56bdd0811318f0cf078b78bfc';
        if (session.hasOwnProperty(cookieKey)) {
            return session[cookieKey];
        }
        for (var key in session) {
            var matches = key.match(/login_(.*_)?([a-zA-Z0-9]+)/gi);
            if (matches && matches.length > 0) {
                return session[matches[0]];
            }
        }
    }
};
