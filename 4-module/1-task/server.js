const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', /*async*/ (req, res) => {

    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'GET':
            try {
                if (pathname.includes('/')) {
                    res.statusCode = 400;
                    res.end();
                    throw new Error('Вложенные пути не поддерживаются');
                }
                if (!fs.existsSync(filepath)) {
                    res.statusCode = 404;
                    res.end();
                    throw new Error('Файл не найден');
                }

                res.statusCode = 200;
                fs.createReadStream(filepath).pipe(res);

                /* const body = [];
                   const content = fs.createReadStream(filepath);
                   for await (const chunk of content) {
                       body.push(chunk.toString());
                   }
                   res.end(body);*/

            } catch (e) {
                console.log(e);
            }
            res.statusCode = 200;
            break;

        default:
            res.statusCode = 500;
            res.end('Not implemented');
            break;
    }
});

module.exports = server;
