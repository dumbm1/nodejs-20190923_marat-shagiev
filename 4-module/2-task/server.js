const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const limitedStream = new LimitSizeStream({limit: 9000}); // 8 байт
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

      /* if (fs.existsSync(filepath)) {
       res.statusCode = 409;
       res.end('File Exists');
       }*/

      const file = fs.createWriteStream(filepath, {flags: 'wx'});
      limitedStream.pipe(file);

      /*req.pipe(file);

       file.on('close', () => {
       res.end('Saved');
       });

       file.on('error', err => {
       if (err.code === 'EEXIST') {
       res.statusCode = 400;
       res.end('File Exists');
       } else {
       res.statusCode = 500;
       res.end('Internal Server Error');
       }
       });*/
      let content = '';

      req.on('data', data => {
        content += data;
        limitedStream.write(data);
      });

      /*req.on('end', () => {
        res.end('Saved');
      });*/

      file.on('error', err => {
        res.end('File Error');
      });
      file.on('close', () => {
        res.end('File Closed');
      });

      break;
    case 'DELETE':

      fs.unlink(filepath, err => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('Not Found');
          } else {
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        }
        res.end('OK');
      });

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
