const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const fileSizeLimit = Math.pow(2, 30);

const limitedStream = new LimitSizeStream({limit: fileSizeLimit}); // байт
const server = new http.Server();

server.on('request', (req, res) => {

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

        new Promise((resolve, reject) => {
          req.on('end', () => {
            return resolve('req.on end');
          });
        }),

        new Promise((resolve, reject) => {
          res.on('finish', () => {
            return resolve('res.on finish');
          });
        }),

        new Promise((resolve, reject) => {
          req.on('close', err => {
            if (err) {
              res.statusCode = 500;
              return reject('Возможно произошел обрыв соединения');
            }
            return resolve('req.on close');
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
        .catch(err => {
          console.log(err, res.statusCode);
        })
        .finally(res.end('finally res.end'));

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
