var TAG = 'customer_Function.js';
var dbConfig = require('./../../Environment/mongoDatabase.js');
var inputConfig = require("../config/config.js");
var inputConstant = require("../config/constant.js");
var crypto = require('crypto');
var log4js = require('log4js');
var log = require('./../../Environment/log4js.js');
var getIP = require('ipware')().get_ip;
var s3config = require('./../../Environment/s3Configuration.js');
var AWS = require('aws-sdk');
var fs = require('fs');
var S3FS = require('s3fs');


exports.customerRegistration = function(req, callback) {

    try {

        // variable for ip address
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        //Variable for Logging the messages to the file.
        var logger = log.logger_customer
        // const logger = log4js.getLogger('ai'); logger_ai
        logger.info(TAG + " " + "customer registration function called");
        if (!req.body.primaryMobileNumber || req.body.primaryMobileNumber == undefined || !req.body.primaryEmail || req.body.primaryEmail == undefined) {
            resJson = {
                "http_code": "500",
                "message": "mobile and email mandatory"
            };
            return callback(false, resJson);
        }
        var passwordHash = crypto.createHash('md5').update(req.body.password).digest('hex');

        var db = dbConfig.mongoDbConn;
        var customerColl = db.collection(inputConstant.collectionNames.customerDbName);
        var countersCol = db.collection(inputConstant.collectionNames.counterDbName);
        logger.info(TAG + " " + "db connection and collection required");

        countersCol.findAndModify({
            _id: 'userId'
        }, null, {
            $inc: {
                seq: 1
            }
        }, {
            new: true
        }, function(err, result) {
            if (err) {
                resJson = {
                    "http_code": "500",
                    "message": "DB eroor"
                };
                logger.error(TAG + " " + "error in counter collection" + err);
                return callback(false, resJson);
            } else {
                logger.info(TAG + " " + "couters collection hit and increase the counter");

                var input = new inputConfig.customerRegistration();
                input.userEntity.userId = ((req.body.userId != undefined && req.body.userId != '') ? req.body.userId : ''),
                    input.userEntity.firstName = ((req.body.firstName != undefined && req.body.firstName != '') ? req.body.firstName : ''),
                    input.userEntity.middleName = ((req.body.middleName != undefined && req.body.middleName != '') ? req.body.middleName : ''),
                    input.userEntity.lastName = ((req.body.lastName != undefined && req.body.lastName != '') ? req.body.lastName : ''),
                    input.userEntity.primaryEmail = ((req.body.primaryEmail != undefined && req.body.primaryEmail != '') ? req.body.primaryEmail : ''),
                    input.userEntity.primaryMobileNumber = ((req.body.primaryMobileNumber != undefined && req.body.primaryMobileNumber != '') ? req.body.primaryMobileNumber : ''),
                    input.userEntity.userType = ((req.body.userType != undefined && req.body.userType != '') ? req.body.userType : ''),
                    input.userEntity.userStatus = ((req.body.userStatus != undefined && req.body.userStatus != '') ? req.body.userStatus : ''),
                    input.userEntity.userStatusReason = ((req.body.userStatusReason != undefined && req.body.spocId != '') ? req.body.spocId : ''),
                    input.userEntity.userStatusUpdatedById = ((req.body.userStatusUpdatedById != undefined && req.body.userStatusUpdatedById != '') ? req.body.userStatusUpdatedById : ''),
                    input.userEntity.userStatusUpdatedByName = ((req.body.userStatusUpdatedByName != undefined && req.body.userStatusUpdatedByName != '') ? req.body.userStatusUpdatedByName : ''),
                    input.userEntity.userStatusUpdatedDate = ((req.body.userStatusUpdatedDate != undefined && req.body.userStatusUpdatedDate != '') ? req.body.userStatusUpdatedDate : ''),
                    input.userEntity.passwordHash = ((passwordHash != undefined && req.body.passwordHash != '') ? req.body.passwordHash : ''),
                    input.userEntity.lastLoginDate = ((req.body.lastLoginDate != undefined && req.body.lastLoginDate != '') ? req.body.lastLoginDate : ''),
                    input.userEntity.spocId = ((req.body.spocId != undefined && req.body.spocId != '') ? req.body.spocId : ''),
                    input.userEntity.additionalDetails.PANNumber = ((req.body.PANNumber != undefined && req.body.PANNumber != '') ? req.body.PANNumber : ''),
                    input.userEntity.additionalDetails.billingAddress.addressId = ((req.body.addressId != undefined && req.body.addressId != '') ? req.body.addressId : ''),
                    input.userEntity.additionalDetails.billingAddress.addressFirstName = ((req.body.addressFirstName != undefined && req.body.addressFirstName != '') ? req.body.addressFirstName : ''),
                    input.userEntity.additionalDetails.billingAddress.addressLastName = ((req.body.addressLastName != undefined && req.body.addressLastName != '') ? req.body.addressLastName : ''),
                    input.userEntity.additionalDetails.billingAddress.addressEmail = ((req.body.addressEmail != undefined && req.body.addressEmail != '') ? req.body.addressEmail : ''),
                    input.userEntity.additionalDetails.billingAddress.addressMobile = ((req.body.addressMobile != undefined && req.body.addressMobile != '') ? req.body.addressMobile : ''),
                    input.userEntity.additionalDetails.billingAddress.addressLine1 = ((req.body.addressLine1 != undefined && req.body.addressLine1 != '') ? req.body.addressLine1 : ''),
                    input.userEntity.additionalDetails.billingAddress.addressLine2 = ((req.body.addressLine2 != undefined && req.body.addressLine2 != '') ? req.body.addressLine2 : ''),
                    input.userEntity.additionalDetails.billingAddress.addressLine3 = ((req.body.addressLine3 != undefined && req.body.addressLine3 != '') ? req.body.addressLine3 : ''),
                    input.userEntity.additionalDetails.billingAddress.addressLine4 = ((req.body.addressLine4 != undefined && req.body.addressLine4 != '') ? req.body.addressLine4 : ''),
                    input.userEntity.additionalDetails.billingAddress.addressLine5 = ((req.body.addressLine5 != undefined && req.body.addressLine5 != '') ? req.body.addressLine5 : ''),
                    input.userEntity.additionalDetails.billingAddress.city = ((req.body.city != undefined && req.body.city != '') ? req.body.city : ''),
                    input.userEntity.additionalDetails.billingAddress.state = ((req.body.state != undefined && req.body.state != '') ? req.body.state : ''),
                    input.userEntity.additionalDetails.billingAddress.country = ((req.body.country != undefined && req.body.country != '') ? req.body.country : ''),
                    input.userEntity.additionalDetails.billingAddress.pincode = ((req.body.pincode != undefined && req.body.pincode != '') ? req.body.pincode : ''),
                    input.userEntity.WebsiteLink = ((req.body.WebsiteLink != undefined && req.body != '') ? req.body.WebsiteLink : ''),
                    input.userEntity.userip = ((req.body.userip != undefined && req.body != '') ? req.body.userId : '')

                customerColl.insert(input, function(err, results) {
                    if (err) {
                        if (err.code == 11000) {
                            resJson = {
                                "http_code": "500",
                                "message": "mobile/email already registerd"
                            };
                            logger.info(TAG + " " + "mobile/email already registerd" + input.primaryMobileNumber + " " + input.primaryEmail);
                            return callback(false, resJson);
                        } else {
                            resJson = {
                                "http_code": "500",
                                "message": "Db error !"
                            };
                            logger.err(TAG + " " + "erro while inserting customer data" + input.primaryMobileNumber);
                            return callback(false, resJson);
                        }
                    } else {
                        resJson = {
                            "http_code": "200",
                            "message": "customer Registerd successfully"
                        };
                        logger.info(TAG + " " + "customer registration done" + input.primaryMobileNumber)
                        return callback(false, resJson);
                    }
                });
            }
        });

    } catch (e) {
        resJson = {
            "http_code": "500",
            "message": "Error retriving customer details." + e.message
        };
        return callback(e, resJson);
    }
}

exports.viewCustomer = function(req, callback) {
    try {
        if (!req.body.mobile || req.body.mobile == undefined) {
            resJson = {
                "http_code": "500",
                "message": "mobile number mandatory"
            };
            return callback(false, resJson);
        }
        if (!req.body.password || req.body.password == undefined) {
            resJson = {
                "http_code": "500",
                "message": "password  mandatory"
            };
            return callback(false, resJson);
        }

        var passwordHash = crypto.createHash('md5').update(req.body.password).digest('hex');

        var db = dbConfig.mongoDbConn;
        var input = new inputConfig.viewCustomer();
        input.mobile = req.body.mobile;
        input.password = passwordHash;
        var customerColl = db.collection(inputConstant.collectionNames.customerDbName);


        customerColl.find({
            "userEntity.primaryMobileNumber": input.mobile,
            "userEntity.passwordHash": input.password
        }).toArray(function(err, result) {
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
                    "message": "mobile number and password not match"
                };
                return callback(false, resJson);
            } else {
                resJson = {
                    "http_code": "200",
                    "message": result[0]
                };
                return callback(false, resJson);
            }
        });
    } catch (e) {
        resJson = {
            "http_code": "500",
            "message": "Error retriving customer details." + e.message
        };
        return callback(e, resJson);
    }
}


exports.removeCustomer = function(req, callback) {
    try {
        if (!req.body.mobile || req.body.mobile == undefined) {
            resJson = {
                "http_code": "500",
                "message": "mobile number mandatory"
            };
            return callback(false, resJson);
        }
        if (!req.body.password || req.body.password == undefined) {
            resJson = {
                "http_code": "500",
                "message": "password  mandatory"
            };
            return callback(false, resJson);
        }

        var passwordHash = crypto.createHash('md5').update(req.body.password).digest('hex');

        var db = dbConfig.mongoDbConn;
        var input = new inputConfig.viewCustomer();
        input.mobile = req.body.mobile;
        input.password = passwordHash;
        var customerColl = db.collection(inputConstant.collectionNames.customerDbName);

        customerColl.remove({
            "userEntity.primaryMobileNumber": input.mobile,
            "userEntity.passwordHash": input.password
        }, 1, function(err, results) {
            if (err) {
                resJson = {
                    "http_code": "500",
                    "message": "Db error !"
                };
                return callback(false, resJson);
            } else {
                resJson = {
                    "http_code": "200",
                    "message": "customer removed successfully"
                };
                return callback(false, resJson);
            }
        });
    } catch (e) {
        resJson = {
            "http_code": "500",
            "message": "Error retriving customer details." + e.message
        };
        return callback(e, resJson);
    }
}

exports.updateCustomer = function(req, callback) {
    try {
        var db = dbConfig.mongoDbConn;
        var input = new customerInput.viewCustomer();
        input.mobile = req.body.mobile;

        var querobj = {};
        querobj["mobile"] = input.mobile;

        var updateObj = {};

        if (req.body.firstName != req.body.newFirstName) {
            updateObj["firstName"] = req.body.newFirstName;
        } else {
            updateObj["firstName"] = req.body.firstName;
        }
        if (req.body.lastName != req.body.newLastName) {
            updateObj["lastName"] = req.body.newLastName;
        } else {
            updateObj["lastName"] = req.body.lastName;
        }
        if (req.body.mobile != req.body.newMobile) {
            updateObj["mobile"] = req.body.newMobile;
        } else {
            updateObj["mobile"] = req.body.mobile;
        }
        if (req.body.email != req.body.newEmail) {
            updateObj["email"] = req.body.newEmail;
        } else {
            updateObj["email"] = req.body.email;
        }
        if (req.body.address != req.body.newAddress) {
            updateObj["address"] = req.body.newAddress;
        } else {
            updateObj["address"] = req.body.address;
        }
        if (req.body.userType != req.body.newUserType) {
            updateObj["userType"] = req.body.newUserType;
        } else {
            updateObj["userType"] = req.body.userType;
        }

        var customerColl = db.collection(inputConstant.collectionNames.customerDbName);

        customerColl.update(querobj, {
            $set: updateObj
        }, function(err, result) {
            if (err) {
                resJson = {
                    "http_code": "500",
                    "message": "Db error !"
                };
                return callback(false, resJson);
            } else {
                resJson = {
                    "http_code": "200",
                    "message": "customer details updated successfully"
                };
                return callback(false, resJson);
            }
        });
    } catch (e) {
        resJson = {
            "http_code": "500",
            "message": "Error retriving customer details." + e.message
        };
        return callback(e, resJson);
    }
}

exports.init = function(req, callback) {
    var s3fsImpl = new S3FS(s3config.BUCKET_NAME + '/resume', {
        accessKeyId: s3config.accessKeyId,
        secretAccessKey: s3config.secretAccessKey
    });

    var file = req.files.file;
    var stream = fs.createReadStream(file.path);
    return s3fsImpl.writeFile(file.originalFilename, stream).then(function() {
        fs.unlink(file.path);
        console.log("Sucessfully uploaded to Amazon S3 server");
    });
}

exports.inquiryFrom = function(req, callback) {

    try {

        // variable for ip address
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        //Variable for Logging the messages to the file.
        var logger = log.logger_customer
        // const logger = log4js.getLogger('ai'); logger_ai
        logger.info(TAG + " " + "customer registration function called");
        if (!req.body.name || req.body.name == undefined || !req.body.email || req.body.email == undefined) {
            resJson = {
                "http_code": "500",
                "message": "name and email mandatory"
            };
            return callback(false, resJson);
        }
        var db = dbConfig.mongoDbConn;
        var inquiry = db.collection(inputConstant.collectionNames.inquiry);
        logger.info(TAG + " " + "db connection and collection required");

        var input = new inputConfig.inquiry();
        input.name = ((req.body.name != undefined && req.body.name != '') ? req.body.name : '');
        input.email = ((req.body.email != undefined && req.body.email != '') ? req.body.email : '');
        input.phone = ((req.body.phone != undefined && req.body.phone != '') ? req.body.phone : '');
        input.budget = ((req.body.budget != undefined && req.body.budget != '') ? req.body.budget : '');
        input.projectDesribe = ((req.body.projectDesribe != undefined && req.body.projectDesribe != '') ? req.body.projectDesribe : '');

        inquiry.insert(input, function(err, results) {
            if (err) {
                resJson = {
                    "http_code": "500",
                    "message": "Db error !"
                };
                logger.err(TAG + " " + "erro while inserting inquiry data" + input.email);
                return callback(false, resJson);

            } else {
                resJson = {
                    "http_code": "200",
                    "message": "inquiry Registerd successfully"
                };
                logger.info(TAG + " " + "inquiry registration done" + input.email)
                return callback(false, resJson);
            }
        });


    } catch (e) {
        resJson = {
            "http_code": "500",
            "message": "Error in inquiry form function _ :- " + e.message
        };
        return callback(e, resJson);
    }
}

exports.careerForm = function(req, callback) {

    try {
        // variable for ip address
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        //Variable for Logging the messages to the file.
        var logger = log.logger_customer;
        logger.info(TAG + " " + "customer registration function called");

        if (!req.body.name || req.body.name == undefined || !req.body.email || req.body.email == undefined) {
            resJson = {
                "http_code": "500",
                "message": "name and email mandatory"
            };
            return callback(false, resJson);
        }

        var db = dbConfig.mongoDbConn;
        var career = db.collection(inputConstant.collectionNames.career);
        logger.info(TAG + " " + "db connection and collection required");

        var input = new inputConfig.carrerForm();
        input.name = ((req.body.name != undefined && req.body.name != '') ? req.body.name : '');
        input.email = ((req.body.email != undefined && req.body.email != '') ? req.body.email : '');
        input.message = ((req.body.message != undefined && req.body.message != '') ? req.body.message : '');
        if (req.files.file) {
            input.resumeUrl = s3config.BUCKET_NAME + '/resume/' + req.files.file.name;
        } else {
            input.resumeUrl = '';
        }


        career.insert(input, function(err, results) {
            if (err) {
                resJson = {
                    "http_code": "500",
                    "message": "Db error !"
                };
                logger.err(TAG + " " + "erro while inserting career data");
                return callback(false, resJson);

            } else {
                var s3fsImpl = new S3FS(s3config.BUCKET_NAME + '/resume', {
                    accessKeyId: s3config.accessKeyId,
                    secretAccessKey: s3config.secretAccessKey
                });


                var file = req.files.file;
                if (file) {
                    var stream = fs.createReadStream(file.path);
                    s3fsImpl.writeFile(file.originalFilename, stream).then(function() {
                        fs.unlinkSync(file.path);

                        console.log("Sucessfully uploaded to Amazon S3 server");
                        resJson = {
                            "http_code": "200",
                            "message": "career form Registerd successfully"
                        };
                        logger.info(TAG + " " + "inquiry registration done")
                        return callback(false, resJson);
                    });
                } else {
                    resJson = {
                        "http_code": "200",
                        "message": "career form Registerd successfully"
                    };
                    logger.info(TAG + " " + "inquiry registration done")
                    return callback(false, resJson);
                }


            }
        });


    } catch (e) {
        resJson = {
            "http_code": "500",
            "message": "Error in career form function _ :- " + e.message
        };
        return callback(e, resJson);
    }
}