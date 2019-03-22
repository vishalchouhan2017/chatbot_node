var TAG = 'chatboot.js';

var express = require('express');
var app = express();
var customerFunc = require("./functionality/customerfunction.js");
var chatbootFunc = require("./functionality/chatBootFunction.js");
var fs = require("fs");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: '/usr/NodeJslogs' });
// ******************** FOR API CALLS FROM WEB/MOBILE ***********************


// ******************** CUSTOMER API ***********************
app.post('/api/v1.0/init', multipartMiddleware, function (req, res) {
	var callback = function (err, regres) {
		res.statusCode = regres.http_code;
		res.json(regres);
	};
	customerFunc.init(req, callback);

});


app.post('/api/v1.0/customerRegistration', function (req, res) {
	var callback = function (err, regres) {
		res.statusCode = regres.http_code;
		res.json(regres);
	};
	customerFunc.customerRegistration(req, callback);
});

app.post('/api/v1.0/viewCustomer', function (req, res) {
    var callback = function (err, regres) {
      res.statusCode = regres.http_code;
      res.json(regres);
  };
  customerFunc.viewCustomer(req, callback);
});

app.post('/api/v1.0/removeCustomer', function (req, res) {
    var callback = function (err, regres) {
      res.statusCode = regres.http_code;
      res.json(regres);
  };
  customerFunc.removeCustomer(req, callback);
});

app.post('/api/v1.0/updateCustomer', function (req, res) {
    var callback = function (err, regres) {
      res.statusCode = regres.http_code;
      res.json(regres);
  };
  customerFunc.updateCustomer(req, callback);
});

app.post('/api/v1.0/inquiryFrom', function (req, res) {
  var callback = function (err, regres) {
    res.statusCode = regres.http_code;
    res.json(regres);
};
customerFunc.inquiryFrom(req, callback);
});


app.post('/api/v1.0/careerForm',multipartMiddleware, function (req, res) {
  var callback = function (err, regres) {
    res.statusCode = regres.http_code;
    res.json(regres);
};
customerFunc.careerForm(req, callback);
});

// ******************** CHATBOOT API ***********************

app.get('/api/v1.0/botIcon', function (req, res) {
  var callback = function (err, regres) {
    res.statusCode = regres.http_code;
    res.json(regres);
  };
  chatbootFunc.botIcon(req, callback);

});

app.get('/api/v1.0/initBot', function (req, res) {
        var path = require('path');
        // res.writeHead(200, { 'Content-Type': 'text/html' });

        // res.status(200);
        // res.sendStatus(200);
        // res.sendFile(path.join(__dirname+'/chatbotbox.html'));
        fs.readFile(__dirname + '/chatbotbox.html', 'utf8', function(err, text){
          res.status(200);
          res.write(text);
          res.end();
      });
        
     
});

app.post('/api/v1.0/firstQuestion', function (req, res) {
 
  var callback = function (err, regres) {
    res.statusCode = regres.http_code;
    res.json(regres);
  };
  chatbootFunc.firstQuestion(req, callback);

});

app.post('/api/v1.0/chatBotQuestion', function (req, res) {
  var callback = function (err, regres) {
    res.statusCode = regres.http_code;
    res.json(regres);
};
chatbootFunc.chatBotQuestion(req, callback);
});

module.exports = app;
