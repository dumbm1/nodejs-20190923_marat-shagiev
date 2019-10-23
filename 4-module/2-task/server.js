const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const limitedStream = new LimitSizeStream({limit: 10000000}); // байт
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      const file = fs.createWriteStream(filepath, {flags: 'wx'});

      file.on('error', err => {
        res.end(`File Error: ${err.code}`);
        console.log(`File Error: ${err.code}`);
      });

      limitedStream.pipe(file);

      req.on('data', chunk => {
        console.log(chunk);

        limitedStream.write(chunk, 'utf-8', err => {
          if (!err) return;
          if (err.code === 'LIMIT_EXCEEDED') {
            res.end(`LIMIT_EXCEEDED`);
            console.log(`LIMIT_EXCEEDED`);
          } else {
            res.end(`LimitStream Unknown Error: ${err}`);
            console.log(`LimitStream Unknown Error: ${err}`);
          }
        });
      });

      req.on('end', () => {
        // req.pipe(limitedStream);
        res.end('Req Event: End');
        console.log('Req Event: End');
      });

      // req.pipe(file);

      limitedStream.on('error', err => {
        res.end(`LimitStream.onError: ${err.code}`);
        console.log(`LimitStream.onError: ${err.code}`);
      });

      file.on('close', () => {
        res.end(`File Event: Close`);
        console.log(`File Event: Close`);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
