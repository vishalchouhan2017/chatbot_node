var TAG = 'mongoDatabase.js';
var mongoClient = require('mongodb').MongoClient;
var async = require('async');

var env = require('./env.js').env;
console.log("------- AIROBOTICA Nodejs CODE BASE ------")
console.log(TAG + " " + "Deployment Environment is: " + env);

var dbConfig = {
    "prd": {
        "type": "singleInstance",
        "user": "airobotica",
        "pwd": "hudastone",
        "mongod": ["ds223019.mlab.com:23019"],
        "database": "airoboticadb"
    },

    "stg": {
        "type": "singleInstance",
        "user": "airobotica",
        "pwd": "hudastone",
        "mongod": ["ds223019.mlab.com:23019"],
        "database": "airoboticadb"
    },
    "dev": {
        "type": "singleInstance",
        "user": "airobotica",
        "pwd": "hudastone",
        "mongod": ["ds223019.mlab.com:23019"],
        "database": "airoboticadb"
    }
};

var connParams = null;

if (env === 'prd') {
    connParams = dbConfig.prd;
} else if (env === 'stg') {
    connParams = dbConfig.stg;
} else {
    connParams = dbConfig.dev;
}

var mongod = connParams.mongod;

var databaseURL = null;
var mongoDbConn = null;

var hosts = null;
for (var i = 0; i < mongod.length; i++) {
    if (i === 0) {
        hosts = mongod[0];
    } else {
        hosts = hosts + ',' + mongod[i];
    }
}

var dbConnUrl = null;
var dbConnUrlSecondary = null;
if (!(connParams.user === "" && connParams.pwd === "")) {
    dbConnUrl = 'mongodb://' + connParams.user + ':' + connParams.pwd + '@' + hosts + '/' + connParams.database;
} else {
    dbConnUrl = 'mongodb://' + hosts + '/' + connParams.database;
}


 
var authenticate ='';
//cloud

 mongodbHost = 'ds223019.mlab.com';
 mongodbPort = '23019';
 authenticate = 'airoboticadb:hudastone@95'

 
var mongodbDatabase = 'airoboticadb';
var url = 'mongodb://'+authenticate+mongodbHost+':'+mongodbPort + '/' + mongodbDatabase;


var mongoose = require('mongoose');


exports.createMongoConn = function(callback) {
    async.parallel([
            function(asyncCallback) {
                mongoClient.connect('mongodb://airobotica:hudastone@ds223019.mlab.com:23019/airoboticadb', function(err, database) {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        console.log('Connection established to: ', 'mongodb://ds223019.mlab.com:23019/airoboticadb');
                        exports.mongoDbConn = database;
                        asyncCallback(false);
                    }
                });
            },
        ],
        function(err, results) {
            if (err) {
                console.log('Error connecting to DB. Err : \n' + err.stack);
            } else {
                console.log('DB connection successfull.');
                callback(false);
            }
        });
}

/*Should be only used for Deletion*/
var dbDataLoaderUser = null;

dbDataLoaderUser = "mongodb://127.0.0.1:27017/airoboticaDB";


exports.createMongoConnRemove = function(callback) {

    mongoClient.connect(dbDataLoaderUser, function(err, databaseRem) {
        if (err) {
            callback(true, err);
        } else {
            callback(false, databaseRem);
        }
    });
}