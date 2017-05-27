function ChatManager(game) {

    this.game = null;

    this.__constructor = function (game) {

        this.game = game;

    }

    this.receive_msg = function (msg, socket) {

        this.send_msg(msg, socket);

    }

    this.send_msg = function (msg, socket) {

        var user;

        socket.get('username', function (err, username) {

            user = username;

        });

        this.game.network_manager.broadcast_msg({ command: 'chat', msg: msg, user: user });

    }

    this.user_connect = function (username) {

        this.game.network_manager.broadcast_msg({ command: 'chat', msg: username + " has joined the world.", user: username });

    }

    this.__constructor(game);
}