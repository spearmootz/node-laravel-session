# node-laravel-session
a way to share laravel session with node. please feel free to make PR's with additional functionality such as getting decoded sessions from other session drivers

# What it does
This is a simple utility which helps you obtain the laravel session key.  You pass in your laravel key, as well as your laravel_session found in your cookie and we return a key that helps you find the session details.

# API
```
getAppKey(pathToEnvFile): resolves APP_KEY found in .env without 'base64:'

getSessionKey(laravel_session, laravelAppKey): returns laravel session key such as 'ffdbeaac243c2d691d64084710d428d575c07007'

getSessionFromRedis(laravelSessionKey, redisConnection): returns a promise that resolves with the session object

getSessionFromMysql(laravelSessionKey, mySqlConnection [, databaseTable]): returns a promise that resolves with the session object

getSessionFromFile(laravelSessionKey, sessionFilePath): returns a promise that resolves with session object
```

# Usage

`let laravelSession = require('node-laravel-session');`



Get your laravel_session from the cookie. for example:

``` js
let cookie = require('cookie');
let session = cookie.parse(req.headers.cookie).laravel_session;
```

Get your app key, for example "MES4V4nAY+eLns059EwEXaXbCB2YKLHCP6bA7tc54KI=" by pasting it or by parsing the laravel .env file with a regex to obtain it. DO NOT INCLUDE "Base64:". or use the provided function function.

``` js
laravelSession.getAppKey('path/to/your/.env')
        .then((appKey) => {
            // continue
        });
```

Then just find the key by calling the function 'getSessionKey'

``` js
let sessionKey = laravelSession.getSessionKey(session, appKey);
```

Get your complete laravel session. Redis example

``` js
laravelSession.getSessionFromMysql(sessionKey, mySqlConnection)
  .then((session) => {
      console.log('here is the full session:' + session);
  });
```
