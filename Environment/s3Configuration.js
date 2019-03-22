//This file contains Hosting details(IP adress and PORT number) where application will be deployed.
var env = require('./env.js').env;

//Object that represent s3 bucket names for all different environments.
var bucketName = {
	"prd": {
		"s3BucketName": "nodedata/prd",
		
	},
	"stg": {
		"s3BucketName": "nodedata/stg",
	
	},
	"dev": {
		"s3BucketName": "nodedata/dev",
	
	}	
}

var BUCKET_NAME = null;			//variable which holds the s3 bucket name of existing environment.
var accessKeyId = 'AKIAJ3QECLI6AINZDZCA';
var secretAccessKey = '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'

if (env === 'prd') {
	BUCKET_NAME = bucketName.prd.s3BucketName;

} else if ( env === 'stg') {
	BUCKET_NAME = bucketName.stg.s3BucketName;

} else if ( env === 'dev') {
	BUCKET_NAME = bucketName.dev.s3BucketName;

}

exports.BUCKET_NAME = BUCKET_NAME;
exports.accessKeyId = accessKeyId;
exports.secretAccessKey = secretAccessKey;
