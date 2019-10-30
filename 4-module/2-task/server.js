const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const fileSizeLimit = Math.pow(2, 20);

const limitedStream = new LimitSizeStream({limit: fileSizeLimit}); // байт
const server = new http.Server();

server.on('request', (req, res) => {

  const dir = path.join(__dirname, 'files');
  !fs.existsSync(dir) && fs.mkdirSync(dir);

  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      let lenChunk = 0;
      let bodyChunk = '';

      Promise.all([

        new Promise((resolve, reject) => {
          if (!pathname.includes('/')) return resolve('Путь корректрый');
          res.statusCode = 400;
          return reject(new Error('Вложенные папки не поддерживаются'));

        }),

        new Promise((resolve, reject) => {
          if (!fs.existsSync(filepath)) return resolve('Имя файла корректное');
          res.statusCode = 409;
          return reject('Ошибка загрузки - такой файл уже есть');
        }),

        new Promise((resolve, reject) => {

          req.on('data', chunk => {

            lenChunk += chunk.length;
            bodyChunk += chunk;

            if (lenChunk >= fileSizeLimit) {
              res.statusCode = 413;
              return reject(`${lenChunk} >= ${fileSizeLimit}`);
            }

            return resolve('req.on data');
          });
        }),

      ])
        .then(results => {
          results.forEach(result => {
            console.log(result, res.statusCode);
          });

          fs.createWriteStream(filepath).write(bodyChunk);
          res.end('then end');

        })
        .then(result => {
          new Promise((resolve, reject) => {
            res.on('finish', () => {
              return resolve('res.on finish');
            });
          });
        })
        .then(result => {
          new Promise((resolve, reject) => {
            req.on('close', err => {
              if (err) {
                res.statusCode = 500;
                fs.unlinkSync(pathname);
                return reject('Возможно произошел обрыв соединения');
              }
              return resolve('req.on close');
            });
          });
        })
        .catch(err => {
          console.log(err, res.statusCode);
        })
        .finally(
          req.on('end', () => {
            res.end('finally res.end');
          }));

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
