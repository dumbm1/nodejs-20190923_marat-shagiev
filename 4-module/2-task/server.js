const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const fileSizeLimit = Math.pow(2, 20);

const limitedStream = new LimitSizeStream({limit: fileSizeLimit}); // байт
const server = new http.Server();

server.on('request', (req, res) => {

  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      Promise.all([

        new Promise((resolve, reject) => {
          if (pathname.includes('/')) {
            res.statusCode = 400;
            return reject(new Error('Вложенные папки не поддерживаются'));
          } else { return resolve('Порядок - вложенных папок нет');}
        }),

        new Promise((resolve, reject) => {
          if (fs.existsSync(filepath)) {
            res.statusCode = 409;
            return reject(new Error('Файл существует'));
          } else { return resolve('Порядок - файла с таким именем нет');}
        }),

        new Promise((resolve, reject) => {
          let chunkLength = 0;
          req.on('data', chunk => {
            try {
              chunkLength += chunk.length;
              limitedStream.write(chunk);
            } catch (err) {
              if (err.code === 'LIMIT_EXCEEDED') {
                res.statusCode = 413;
                return reject(new Error(`Ошибка - файл > ${fileSizeLimit} байт; ${chunkLength}`));
              } else {
                res.statusCode = 500;
                return reject(new Error(`Неизвестная ошибка сервера`));
              }
            }
          });

          req.on('close', () => {
            res.statusCode = 666;
            return reject(new Error(`Соединение прервано`));
          });

          req.on('end', () => {

            if (chunkLength < fileSizeLimit) {
              return resolve(`Порядок - файл < ${fileSizeLimit} байт; Размер файла ${chunkLength} байт`);
            } else {
              return reject(new Error(`Ошибка - файл > ${fileSizeLimit} байт; ${chunkLength}`));
            }

          });

        })
      ])
             .then(results => {
               results.forEach(result => {
                 console.log(result);
                 console.log(res.statusCode);
               });
             })
             .catch(err => {
               console.log(err.message);
               console.log(res.statusCode);
             })
             .finally(() => {
               res.end('Конец запроса');
             });

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
