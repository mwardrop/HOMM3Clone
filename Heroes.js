var fs = require('fs');

var http = require('http').createServer(handler).listen(80);

function handler(req, res) {

    if (req.url == '/') {

        req.url = '/index.html';

    }

    fs.readFile(__dirname + '/Client' + req.url, function (err, data) {

        if (err) {

            res.writeHead(500);

            return res.end('Could not load requested file.');

        }

        var content_type = 'text/plain';

        switch (req.url.split('.')[req.url.split('.').length - 1].toLowerCase()) {

            case 'html':

                content_type = 'text/html';

                break;

            case 'css':

                content_type = 'text/css';

                break;

            case 'js':

                content_type = 'application/javascript';

                break;

            case 'png':

                content_type = 'image/png';

                break;

            case 'gif':

                content_type = 'image/gif';

                break;

        }

        res.writeHead(200, { 'Content-Type': content_type });

        res.end(data);

    });
}

var io = require('socket.io').listen(http, { log: false });

io.sockets.on('connection', function (socket) {

    socket.on('msg', function (data) {

        game.receive_netmsg(socket, data);

    });

    socket.on('disconnect', function () {

        game.client_disconnect(socket);

    });


});

var game = require('./Server/Game.js')

game.start(io.sockets);

