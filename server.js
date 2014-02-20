var http = require('http');
var url  = require('url');
var path = require('path');
var fs   = require('fs');

var mime = require('mime');

var server = http.createServer(router).listen(7357);

function router (req, res) {
  var pathname = url.parse(req.url, true).pathname;
  if (pathname.slice(0, 4) === '/api') {
    apiHandler(req, res);
  } else {
    if (pathname[pathname.length - 1] === '/') 
      pathname += 'index.html';
    staticFileHandler(pathname, res);
  }
}

function staticFileHandler (pathname, res) {
  fs.readFile(__dirname + '/public_html' + pathname, function (err, data) {
    if (err) return errHandler(err, res);
    console.log('[200]: ' + pathname);
    res.setHeader('Content-Type', mime.lookup(path.extname(pathname)));
    res.end(data);
  });
}

function errHandler (err, res) {
  if (err.code === 'ENOENT') {
    res.statusCode = 404;
    res.end('File not found!');
    console.log('[404]: File not found: ' + err.path);
  } else {
    console.error(err);
  }
}

function apiHandler (req, res) {
  res.setHeader('Content-Type', mime.lookup('json'));
  res.end(JSON.stringify({ potatoes: true }));
}