# node-laravel-session
a way to share laravel session with node. please feel free to make PR's with additional functionality such as getting decoded sessions from other session drivers

# What it does
This is a simple utility which helps you obtain the laravel session key.  You pass in your laravel key, as well as your laravel_session found in your cookie and we return a key that helps you find the session details.

# Getting Redis Session
Included is a function to retrieve the session in the case you use redis as your session driver.  It gets the information stored in 'laravel:' + SessionKey;

# Getting Database Session
In the case that the driver is mysql you will need to find the record in the session table where id matches the laravel session key.  other database drivers should follow similar methods.

# Usage

`let laravelSession = require('node-laravel-session');`

Get your app key, for example "MES4V4nAY+eLns059EwEXaXbCB2YKLHCP6bA7tc54KI=" by pasting it or by parsing the laravel .env file with a regex to obtain it. DO NOT INCLUDE "Base64:".

Get your laravel_session from the cookie. for example:

``` js
let cookie = require('cookie');
let session = cookie.parse(req.headers.cookie).laravel_session;
```

Then just find the key by calling the function 'getSessionKey'

``` js
let sessionKey = laravelSession(session, appKey);
```

Get your complete laravel session. Redis example

``` js
laravelSession.getSessionFromRedis(sessionKey, redisCon)
  .then((session) => { console.log('here is the full session:' + session);});
```
