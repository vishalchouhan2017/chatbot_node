var TAG = 'chatBoot_Function.js';
var dbConfig = require('./../../Environment/mongoDatabase.js');
var inputConfig = require("../config/config.js");
var inputConstant = require("../config/constant.js");
var crypto = require('crypto');
var log = require('./../../Environment/log4js.js');
var s3 = require('./../../Environment/s3Configuration.js');
var awsDAO = require('../awsDAo/awsDAo.js');
var env = require('../../Environment/env.js').env;


exports.firstQuestion = function(req,callback){
    try{
        var logger = log.logger_chatbot;
        if(!req.body.name || !req.body.company){
            resJson = {
                "http_code": "500",
                "message": "name and company is mandatory"
            };
            logger.error(TAG+" "+"name and company is mandatory");
            return callback(false, resJson);        
        }
        const crypto = require("crypto");
        const id = crypto.randomBytes(8).toString("hex")+req.body.name+crypto.randomBytes(8).toString("hex");

        var sessionObject = {
            sessionId : id,
            userName : req.body.name,
            company : req.body.company
        }

        var db = dbConfig.mongoDbConn;
        var sessionCollection  = db.collection(inputConstant.collectionNames.sessionId);
        sessionCollection.insert(sessionObject, function(err, results) {
            if (err) {
                    resJson = {
                        "http_code": "500",
                        "message": "Db error !"
                    };
                    logger.err(TAG+" "+"erro while inserting sessionObject data"+" "+JSON.stringify(sessionObject));
                    return callback(false, resJson);
                
            } else {
                resJson = {
                    "http_code": "200",
                    "message": "session id created successfully",
                    "sessionId":id
                };
                logger.info(TAG+" "+"session id created successfully"+" "+JSON.stringify(sessionObject));
                return callback(false, resJson);
            }
        });
    }catch(e){
        resJson = {
            "http_code": "500",
            "message": "Error firstQuestion function. :-" + e.message
        };
        return callback(e, resJson);

    }
}

exports.chatBotQuestion = function(req, callback) {
    try {
        var logger = log.logger_chatbot;

        if(!req.body.sessionId){
            resJson = {
                "http_code": "500",
                "message": "session Id is mandatory"
            };
            logger.error(TAG+" "+"session Id is mandatory");
            return callback(false, resJson);
        }

        var db = dbConfig.mongoDbConn;
        var sessionCollection  = db.collection(inputConstant.collectionNames.sessionId);

        console.log(req.body.query);
      
        sessionCollection.find({"sessionId":req.body.sessionId}).toArray (function(err, result) {
            // console.log(result);
            if (err) {
                resJson = {
                    "http_code": "500",
                    "message": "Db error !"
                };
                return callback(false, resJson);
            } 
            if (!result.length) {
                resJson = {
                  "http_code": "404",
                  "message": "session Id not matched"
                };
                return callback(false, resJson);
             }else {
                 var input = new inputConfig.querySchema;
                 input.sessionId = result[0].sessionId;
                 input.userName = result[0].userName;
                 input.company = result[0].company;
                 input.query = ((req.body.query != undefined && req.body.query != '') ? req.body.query : '')
                 input.requestIp = '';
                 input.requestType = "text";
                 input.feedBack = '';
                 input.userFeedbackComment = '';

                 this.response = "";
                 this.statusCode = "";
                 
                const http = require("http");
                var url = "http://18.218.118.104:8081/response?query="+((req.body.query != undefined && req.body.query != '') ? req.body.query : '');
                if(req.body.requestType){
                    url = url+"&requestType="+req.body.requestType;
                    }
                 if(req.body.sessionId){
                    url = url+"&sessionId="+req.body.sessionId;
                    }
                 if(req.body.company){
                    url = url+"&company="+req.body.company;
                   }
        
                   http.get(url, res => {
                    res.setEncoding("utf8");
                    let pythonResponse = "";
                    res.on("data", data => {
                        pythonResponse += data;
                    });
                    res.on("end", () => {
                        pythonResponse = JSON.parse(pythonResponse);
                        resJson = {
                            "http_code": "200",
                            "message": pythonResponse.Data,
                            "Response_type":pythonResponse.Response_type
                          };
                           callback(false, resJson);
                       input.response = pythonResponse.Data;
                       input.statusCode = pythonResponse.Status_code;
                       input.confidence = pythonResponse.Confidence
                    
                       var chatbootQuestionCollection  = db.collection(inputConstant.collectionNames.chatbootQuestion);
                       chatbootQuestionCollection.insert(input, function(err, result) {
                           if (err) {
                                   resJson = {
                                       "http_code": "500",
                                       "message": "Db error !"
                                   };
                                   logger.err(TAG+" "+"erro while inserting chatbootQuestion data"+" "+JSON.stringify(resJson));
                               
                           } else {
                               resJson = {
                                   "http_code": "200",
                                   "message": "chatbootQuestion  created successfully",
                                   "sessionId":input
                               };
                               logger.info(TAG+" "+"chatbootQuestion created successfully"+" "+JSON.stringify(resJson));
                           }
                       });
                    });
                });
            }
        });
        
        

    } catch (e) {

    }
}