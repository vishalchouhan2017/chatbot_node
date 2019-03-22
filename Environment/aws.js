var AWS = require('aws-sdk');

exports.intializeAWS = function  (callback){
           
            AWS.config.update({accessKeyId: "AKIAIIQS5TNVAZGD4PWA", secretAccessKey:"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"});
            AWS.config.update({region: 'US East (Ohio)'});
            console.log(JSON.stringify(AWS))
            exports.aws = AWS;
            return callback(false);
   
}