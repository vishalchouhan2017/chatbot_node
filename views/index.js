var express = require('express'); 
var fs = require('fs');
var app = express();
var path = require('path');

// /* GET home page. */
app.get('/', function(req, res, next) {
   
    if(req.url === "/"){
       fs.readFile('./views/home.html',"UTF-8", function(error, content) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }
    else if(req.url.match("/")){
        var cssPath = path.join(__dirname,'views','/css');
        var fileStream = fs.createReadStream(cssPath,"UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);
    }else if(req.url.match("\.png")){
        var imagePath = path.join(__dirname,'views',req.url);
        var fileStream = fs.createReadStream(imagePath,"UTF-8");
        res.writeHead(200, {"Content-Type": "image/png"});
        fileStream.pipe(res);
    }

    

})
// });
module.exports = app;
