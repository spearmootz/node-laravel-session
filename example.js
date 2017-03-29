'use strict';
// require node server., and cookie parser
const http = require('http');
const cookie = require('cookie');

// require node-laravel-session library
const laravelSession  = require('node-laravel-session');

// connect to redis because that is where sessions are stored - this can be mysql, or redis
let redis = require('redis');
let redisCon = redis.createClient();

//Lets define a port we want to listen to
const PORT = 8080;

// path to laravel environment filepath
const ENV_PATH = 'C:/wamp64/www/socialMedia/.env';

// this is the function that will respond all request to this node server - note: we have not created the server yet
function handleRequest(request, response){

    //getting laravel app key
    laravelSession.getAppKey(ENV_PATH)
        .then((appKey) => {

            //once we have the appKey, lets parse the cookie
            let session = cookie.parse(request.headers.cookie);

            //get the session id
            let sessionId = laravelSession.getSessionKey(session.laravel_session, appKey);

            // get the session from redis
            laravelSession.getSessionFromRedis(sessionId, redisCon).then((session) => {
                //now we have the session available here
                response.end(JSON.stringify(session));
            });

        });

}


//Create a server which will handle all request using the handleRequest method
var server = http.createServer(handleRequest);

// redis error handling, not needed for this demo but its here
redisCon.on("error", function (err) {
    console.log("Error " + err);
});

// once redis connects it will make the server start listening
redisCon.on("ready", function (err) {
    //Lets start our server
    server.listen(PORT, function(){
        //Callback triggered when server is successfully listening. Hurray!
        console.log("Server listening on: http://localhost:%s", PORT);
    });
});
