function NetworkManager(game) {

    this.game;

    this.__constructor = function(game) {

        this.game = game;

    }

    this.client_disconnect = function (socket) {

        var self = this;

        socket.get('username', function (err, username) {

            self.game.user_manager.disconnect(username, socket);

        });

    };

    this.broadcast_msg = function (msg, username) {

        if (!username) {

            this.game.socket.emit('msg', msg);

        } else {

            if (this.game.user_manager.users['username'].online) {

                this.game.user_manager.users['username'].socket.emit('msg', msg);

            }

        }

    }

    this.receive_msg = function (socket, data) {

        var command = data['command'];

        switch (command.toLowerCase()) {

            case 'login':

                game.user_manager.login(data['username'], data['password'], socket);

                break;

            case 'image_list':

                game.get_image_list(data['type'], socket);

                break;

            case 'update_tile':

                game.admin_manager.update_tile(data['map'], data['x'], data['y'], data['tile'], socket);

                break;

            case 'get_map':

                game.map_manager.get_map(data['name'], socket);

                break;

            case 'chat':

                game.chat_manager.receive_msg(data['msg'], socket);

                break;

            default:

                this.game.log("Unknown Network Command: " + command.toLowerCase(), 'error');

                socket.emit('msg', { command: 'error', title: "Unknown Network Command", details: command.toLowerCase() });

                break;

        }

    }

    this.__constructor(game);

}