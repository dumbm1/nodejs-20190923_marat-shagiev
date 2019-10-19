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

            try {
                if (pathname.includes('/')) {
                    res.statusCode = 400;
                    res.end('Bad Request');
                    throw new Error('Вложенные папки не поддерживаются');
                }

                if (!fs.existsSync(filepath)) {
                    res.statusCode = 404;
                    res.end('Not Found');
                    throw new Error('Файл не найден');
                }

                /*fs.unlink(filepath, (err) => {
                    if (err) throw err;
                    res.statusCode = 200;
                    console.log('Файл удален!');
                    res.end('OK');
                });*/
                fs.unlinkSync(filepath);
                res.statusCode = 200;
                console.log('Файл удален!');
                res.end('OK');
            } catch (e) {
                console.log(e.message);
            }

            //endregion
            break;

        case 'PUT': // helper case - create the file
            try {
                if (!fs.existsSync(filepath)) {
                    fs.writeFileSync(filepath, 'Hell node.js', 'utf-8');
                    res.statusCode = 666;
                    res.end('File Created');
                    console.log('Файл создана');
                } else {
                    res.statusCode = 777;
                    res.end('File Exists');
                    throw new Error('Файл уже есть');
                }
            } catch (e) {
                console.log(e.message);
            }
            break; // helper case - create the file

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;


