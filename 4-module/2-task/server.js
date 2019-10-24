const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const limitedStream = new LimitSizeStream({limit: Math.pow(2, 20)}); // байт
const server = new http.Server();

server.on('request', (req, res) => {

  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Вложенные папки не поддерживаются');
    console.log('Вложенные папки не поддерживаются');
    return;
  }

  switch (req.method) {
    case 'POST':

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File Exists');
        console.log('File Exists');
        break;
      }

      req.pipe(limitedStream);

      limitedStream.on('error', err => {

        if (err.code === 'LIMIT_EXCEEDED') {

          fs.unlink(filepath, err => {
            if (err) cosole.log(err.code);
            console.log('Файл Зачищен');
          });

          res.statusCode = 413;
          res.end(err.code);
          console.log(err.code);
        } else {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }

      });

      const file = fs.createWriteStream(filepath/*, {flags: 'wx'}*/);

      req.on('end', err => {
        if (err) {
          console.log(err.code);
        }
        limitedStream.pipe(file);

        console.log('Req End');
        res.end('Req End');
      });

      file.on('close', () => {
        console.log('File close');
      });

      req.on('close', err => {
        if (err) {
          console.log(err.code);
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
