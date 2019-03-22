var TAG = 'app.js';

var express = require('express');
var app = express();
var env = require('./Environment/env.js').env;
var routes = require('./views/index.js');
var path = require('path');


var dbConfig = require('./Environment/mongoDatabase.js');
var log = require('./Environment/log4js.js');



var bodyParser = require('body-parser');
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    limit: '20mb',
    extended: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



//CORS issue in the Browser.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

//  

// Routing
var chatbot = require('./routes/services.js');


app.use('/', routes);
app.use('/chatbot', chatbot);


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        http_code: err.status || 500,
        message: err.message
    });
    console.log("req:- " + req.url);
    console.log("time : " + new Date());
    console.log("error triggered from app.js:- " + err.stack);
});

//Initialize connection once
var server;

dbConfig.createMongoConn(function(error) {
    if (error) {
        console.log('Unable to connect to the mongoDB server. Error:', error);
    } else {

        if (env === "prd") {
            server = app.listen(8082);
            console.log('Listening on port 8082');
        } else if (env === "stg") {
            server = app.listen(8080);
            console.log('Listening on port 8080');
        } else {
            //dev
            server = app.listen(8083);
            console.log('Listening on port 8083');
        }
    }
});


process.on('SIGTERM', function() {
    shutdown('SIGTERM');
});

process.on('SIGINT', function() {
    shutdown('SIGINT');
});

var shutdown = event => {
    console.log('Event triggered : ' + event);
    server.close(() => {
        console.log("Finished all requests");
        dbConfig.mongoDbConn.close(err => {
            console.log("Closed DB connections");
            process.exit(err ? 1 : 0);
        });
    });
}