var TAG = " AWS S3 DAO - ";
var awsConfig = require('../../Environment/aws.js');
var fs = require('fs');
var mime = require('mime-types');
var async = require('async');
var log = require('../../Environment/log4js.js');
var s3;

var taskArray = [];

exports.intializeS3 =
function intializeS3 (filesToUpload, callback){

  //Variable for Mongo DB Connection.
  // var db = dbConfig.mongoDbConn;

  //Variable for Logging the messages to the file.
  // var logger = log.logger_awsDAO;

  // var colS3Credentials = db.collection('S3Credentials');

  // colS3Credentials.findOne({},{"_id":0},function(err, result){

  //   if(!err && result !== null){
  //     AWS.config.update({accessKeyId: result.AWS_ACCESS_KEY_ID, secretAccessKey: result.AWS_SECRET_ACCESS_KEY});
  //     AWS.config.update({region: 'eu-west-1'});
      s3 = new awsConfig.aws.S3();

      parallelS3Uploads(filesToUpload, function(err, result){
        return callback(err, result);
      });
  //   }else if(!err && result === null){
  //     resJson = {
  //       "http_code" : "400",
  //       "message" : "AWS Details not Found."
  //     };
  //     logger.error(TAG + " AWS Details not Found.");
  //     return callback(true, resJson);
  //   } else {
  //     resJson = {
  //       "http_code" : "500",
  //       "message" : "Internal Server Error while uploading file to s3."
  //     };
  //     logger.error(TAG + " Intialize the s3 failed." + JSON.stringify(err));
  //     return callback(true, resJson);
  //   }
  // });
}

//Function for performing the parallel uploads to s3.
function parallelS3Uploads (filesToUpload, callback){
  //Variable for Logging the messages to the file.
  // var logger = log.logger_awsDAO;

  // logger.info(TAG + " Request received for uploading the file or image to s3.");

  createParallelTasks(filesToUpload, function(err){
    if(err){
      resJson = {
        "http_code" : "500",
        "message" : "Image Upload to s3 failed."
      };
      // logger.error(TAG + " create parallel tasks s3 failed." + JSON.stringify(err));
      return callback(false, resJson);
    }else{

      async.parallel(taskArray, function(err, results){
        if(!err){

          taskArray = [];
          resJson = {
            "http_code" : "200",
            "message" : results
          };
          // logger.debug(TAG + " async parallel tasks s3 Successful." + JSON.stringify(err));
          return callback(false, resJson);
        }else{
          resJson = {
            "http_code" : "500",
            "message" : "Image Upload to s3 failed."
          };
          // logger.error(TAG + " async parallel tasks s3 failed." + JSON.stringify(err));
          return callback(false, resJson);
        }
      });
    }
  });
};

//This function is used to create the parallel tasks.
function createParallelTasks(filesToUpload, callback){
  async.series([
    function(scallback){

      for(var i=0; i<filesToUpload.length; i++){
        var path = filesToUpload[i].filePath;
        var fileName = filesToUpload[i].fileName;

        taskPush(path, fileName, filesToUpload[i].pathToUpload, filesToUpload[i].acl, filesToUpload[i].typeOfFile, filesToUpload[i].displayName, filesToUpload[i].size,filesToUpload[i].filesCount);
      }
      scallback();
    }
  ],
  function(err, results){
    return callback(false);
  });
}

function taskPush(path, fileName, pathToUpload, acl, typeOfFile, displayName, size,filesCount){
  //Variable for Logging the messages to the file.
  // var logger = log.logger_awsDAO;
  taskArray.push(
    function(callback){

      var filepath = path;

      var type = mime.lookup(filepath);

      var stream = fs.createReadStream(filepath);

      var bucketPath = pathToUpload;

      var key = fileName;

      var params = {
        Bucket: bucketPath,
        Key: key,
        ACL: acl,
        ContentType: type,
        Body:stream
      };

      uploadObjectToS3(params, typeOfFile, displayName, size, function(err, data){
        if(!err){

          try{
            if(!filesCount){
              //This will delete the file which gets created in temp.
              fs.unlinkSync(filepath);              
            } else {
              --filesCount;
              if(filesCount == 0){
                //This will delete the file which gets created in temp.
                fs.unlinkSync(filepath);                 
              }
            }

          }
          catch(e){
            // logger.error(TAG + " exception araised while removing file " +filepath+ ", exception: "+ JSON.stringify(e));
          }

          return callback(err, data);
        }else{
          return callback(err);
        }
      });
    }
  );
}

//This Function is used for uploading the object to s3.
function uploadObjectToS3(params, typeOfFile, displayName, size, callback){
  var bucketName = params.Bucket;
  var keyName = params.Key;
  //Variable for Logging the messages to the file.
  // var logger = log.logger_awsDAO;

  s3.putObject(params, function(err, data) {
    if (err){

      resJson = {
        "http_code" : "500",
        "message" : "Image Upload to s3 failed."
      };
      // logger.error(TAG + " s3 Put Object tasks s3 failed." + JSON.stringify(err));
      return callback(false, resJson);
    }
    else{
      var response = {
        "typeOfFile": typeOfFile,
        "fileName": keyName,
        "displayName": displayName,
        "size" : size
      };
      return callback(false, response);
    }
  });
}

exports.downloadFromS3 =
function downloadFromS3(pathToDownload, fileName, callback){

  //Variable for Mongo DB Connection.
  var db = dbConfig.mongoDbConn;

  //Variable for Logging the messages to the file.
  var logger = log.logger_awsDAO;

  // var colS3Credentials = db.collection('S3Credentials');

  // colS3Credentials.findOne({},{"_id":0},function(err, result){

  //   if(!err && result !== null){

  //     AWS.config.update({accessKeyId: result.AWS_ACCESS_KEY_ID,secretAccessKey: result.AWS_SECRET_ACCESS_KEY});
  //     AWS.config.update({region: 'eu-west-1'});
      var s3 = new awsConfig.aws.S3();

      var params = {
        Bucket: pathToDownload,
        Key: fileName
      };

      var params = {Bucket: pathToDownload, Key: fileName, Expires: 500};
      var url = s3.getSignedUrl('getObject', params);
      resJson = {
          "http_code" : "200",
          "message" : "File Download from s3 success.",
          "url" : url
        };
        // logger.info(TAG + " s3 Download success.");
        return callback(false, resJson);

        // s3.getSignedUrl('getObject', params, function(err, url){
        //   if (err) {
        //     resJson = {
        //       "http_code" : "404",
        //       "message" : "File not found in s3.",
        //       "url" :""
        //     };
        //     return callback(err, resJson);
        //   } else {
        //     resJson = {
        //       "http_code" : "200",
        //       "message" : "File Download from s3 success.",
        //       "url" : url
        //     };
        //     logger.info(TAG + " s3 Download success.");
        //     return callback(false, resJson);
        //   }
        // });


      // }else {
      //   resJson = {
      //     "http_code" : "500",
      //     "message" : "Error retriving aws credentials while downloading file to s3."
      //   };
      //   logger.error(TAG + " downloading from s3 failed." + JSON.stringify(err));
      //   return callback(true, resJson);
      // }
    // });
  };

  exports.listFilesS3 =
  function listFilesS3(bucketName, searchPath, callback){

    //Variable for Mongo DB Connection.
    // var db = dbConfig.mongoDbConn;

    //Variable for Logging the messages to the file.
    // var logger = log.logger_awsDAO;

    // var colS3Credentials = db.collection('S3Credentials');

    // colS3Credentials.findOne({},{"_id":0},function(err, result){

    //   if(!err && result !== null){
    //     AWS.config.update({accessKeyId: result.AWS_ACCESS_KEY_ID,secretAccessKey: result.AWS_SECRET_ACCESS_KEY});

        var s3 = awsConfig.aws.S3({apiVersion: '2006-03-01'});

        var params = {
          Bucket: bucketName,
          EncodingType: 'url',
          Prefix: encodeURI(searchPath)
        };

        s3.listObjectsV2(params, function(uerr, result) {
          if (uerr){
            resJson = {
              "http_code" : "500",
              "message" : "File Listing from s3 failed."
            };
            // logger.error(TAG + " s3 Listing files failed." + JSON.stringify(uerr));
            return callback(true, resJson);
          }else{
            var fileNames = [];
            result.Contents.forEach(function(entry){
              var pathArray = entry.Key.split("/");
              fileNames.push(pathArray[pathArray.length-1]);
            });
            resJson = {
              "http_code" : "200",
              "message" : "File Listing from s3 success.",
              "fileNames" : fileNames
            };
            // logger.info(TAG + " s3 Listing files success.");
            return callback(false, resJson);
          }
        });

    //   }else {
    //     resJson = {
    //       "http_code" : "500",
    //       "message" : "Internal Server Error while Listing files from s3."
    //     };
    //     logger.error(TAG + " Listing files from s3 failed." + JSON.stringify(err));
    //     return callback(true, resJson);
    //   }
    // });
  };

  exports.downloadFileFromS3 =
  function downloadFileFromS3(pathToDownload, fileName, callback){

    //Variable for Mongo DB Connection.
    // var db = dbConfig.mongoDbConn;

    //Variable for Logging the messages to the file.
    // var logger = log.logger_awsDAO;

    // var colS3Credentials = db.collection('S3Credentials');

    // colS3Credentials.findOne({},{"_id":0},function(err, result){

    //   if(!err && result !== null){
    //     AWS.config.update({accessKeyId: result.AWS_ACCESS_KEY_ID,secretAccessKey: result.AWS_SECRET_ACCESS_KEY});

        var s3 = awsConfig.aws.S3({apiVersion: '2006-03-01'});

        var params = {
          Bucket: pathToDownload,
          Key: fileName
        };

        s3.getObject(params, function(uerr, result) {
          if (uerr){
            resJson = {
              "http_code" : "500",
              "message" : "File Download from s3 failed."
            };
            // logger.error(TAG + " s3 Download failed." + JSON.stringify(uerr));
            return callback(false, resJson);
          } else{
            var params = {Bucket: pathToDownload, Key: fileName, Expires: 60};

            fs.writeFile("/usr/NodeJslogs/email_attchements/"+fileName, result.Body, function(err) {
              if(err) {
                resJson = {
                  "http_code" : "500",
                  "message" : "File Download from s3 failed."
                };
                // logger.error(TAG + " s3 Download failed. error: "+ JSON.stringify(err));
                return callback(false, resJson);
              } else {
                resJson = {
                  "http_code" : "200",
                  "message" : "File Download from s3 success."
                };
                // logger.info(TAG + " s3 Download success.");
                return callback(false, resJson);
              }
            });
          }
        });

    //   }else {
    //     resJson = {
    //       "http_code" : "500",
    //       "message" : "Internal Server Error while downloading file to s3."
    //     };
    //     logger.error(TAG + " downloading from s3 failed." + JSON.stringify(err));
    //     return callback(false, resJson);
    //   }
    // });
  };

  exports.uploadToS3 =
  function uploadToS3(pathToUpload, filepath, fileName, callback){

    //Variable for Mongo DB Connection.
    // var db = dbConfig.mongoDbConn;

    //Variable for Logging the messages to the file.
    // var logger = log.logger_awsDAO;

    // var colS3Credentials = db.collection('S3Credentials');

    // colS3Credentials.findOne({},{"_id":0},function(err, result){

    //   if(!err && result !== null){
    //     AWS.config.update({accessKeyId: result.AWS_ACCESS_KEY_ID,secretAccessKey: result.AWS_SECRET_ACCESS_KEY});
    //     AWS.config.update({region: 'eu-west-1'});
        //var s3 = new AWS.S3({apiVersion: '2006-03-01'});
        var s3 = new awsConfig.aws.S3();

        var type = mime.lookup(filepath);

        var stream = fs.createReadStream(filepath);

        var params = {
          Bucket: pathToUpload,
          Key: fileName,
          ACL: 'private',
          ContentType: type,
          Body: stream
        };

        s3.putObject(params, function(uerr, data) {

          if (uerr){
            resJson = {
              "http_code" : "500",
              "message" : "File Upload to s3 failed."
            };
            // logger.error(TAG + " s3 upload failed." + JSON.stringify(uerr));
            return callback(true, resJson);
          }else{

            try{
              //This will delete the file which gets created in temp.
              fs.unlinkSync(filepath);
            }
            catch(e){
              // logger.error(TAG + " exception araised while removing file " +filepath+ ", exception: "+ JSON.stringify(e));
            }
            resJson = {
              "http_code" : "200",
              "message" : "File Upload to s3 success.",
              "fileName" : fileName
            };
            // logger.info(TAG + " s3 upload success.");
            return callback(false, resJson);
          }
        });

    //   }else {
    //     resJson = {
    //       "http_code" : "500",
    //       "message" : "Internal Server Error while uploading file to s3."
    //     };
    //     logger.error(TAG + " uploading to s3 failed." + JSON.stringify(err));
    //     return callback(true, resJson);
    //   }
    // });
  };
