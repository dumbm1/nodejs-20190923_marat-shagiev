const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const limitSizeStream = new LimitSizeStream({limit: 1000});
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
      const outStream = fs.createWriteStream(filepath);
      limitSizeStream.pipe(outStream);
      outStream
        .on('error', err => {
          if(err.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end('Limit Exceeded Error');
          } else {
            res.statusCode = 500;
            res.end('Internal Server Error');
          }

        })
        .pipe(res);

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
