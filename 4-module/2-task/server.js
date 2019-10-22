const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const limitedStream = new LimitSizeStream({limit: 1000}); // 8 байт
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      /* if (pathname.includes('/')) {
       res.statusCode = 400;
       res.end('Вложенные папки не поддерживаются');
       }*/

      /* if (fs.existsSync(filepath)) {
       res.statusCode = 409;
       res.end('File Exists');
       }*/

      const file = fs.createWriteStream(filepath);
      limitedStream.pipe(file);

      req.on('data', data => {
        limitedStream.write(data);
      });

      req.on('end', () => {
        res.end('End of Request');
      });

      limitedStream.on('error', err => {
        res.end(`Limit Error: ${err.code}`);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
