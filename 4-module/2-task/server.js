const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

const fileSizeLimit = Math.pow(2, 20);

const server = new http.Server();

server.on('request', (req, res) => {

  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const dir = path.join(__dirname, 'files');
      !fs.existsSync(dir) && fs.mkdirSync(dir);
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('Ошибка загрузки - файл с таким именем существует');
      }

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Вложенные папки не поддерживаются');
      }

      const stream = fs.createWriteStream(filepath, {flags: 'wx'});

      const limitStream = new LimitSizeStream({limit: fileSizeLimit}); // байт

      req
        .pipe(limitStream)
        .pipe(stream);

      stream.on('error', error => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
        } else {
          res.statusCode = 500;
          res.end(`Internal server error. ${error.code}`);
          fs.unlink(filepath, err => {});
        }
      });

      limitStream.on('error', error => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end(`Размер файла не должен превышать ${fileSizeLimit} байт`);
        } else {
          res.statusCode = 500;
          res.end(`Internal server error. ${error.code}`);
        }
        fs.unlink(filepath, err => {});
      });

      stream.on('close', () => {
        res.end('File has been saved');
      })

      res.on('close', () => {
        if (res.finished) return;
        fs.unlink(filepath, err => {});
      });

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

