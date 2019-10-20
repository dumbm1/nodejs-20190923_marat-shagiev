const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const limitSizeStream = new LimitSizeStream({limit: 100});
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Вложенные папки не поддерживаются');
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File Exists');
      }

      req.pipe(fs.createWriteStream(filepath));
      res.end('OK');


      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
