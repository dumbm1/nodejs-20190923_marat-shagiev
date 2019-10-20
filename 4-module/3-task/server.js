const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':

      //region Description

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Вложенная структура папок не поддерживается');
      }

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
        res.statusCode = 200;
        res.end('OK');

      });

      //endregion
      break;

    case 'PUT': // helper case - create file
      fs.writeFile(filepath, 'Hell, NodeJs!', {enconding: 'utf-8'}, err => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
        res.statusCode = 666;
        res.end('File created');
      });// helper case - create file

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;


