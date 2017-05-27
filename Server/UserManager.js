function UserManager(game) {

    this.game;

    this.users = {};

    this.__constructor = function (game) {

        this.game = game;

    }

    this.login = function (username, password, socket) {

        this.game.log_method_call("game.user_manager.login", [username, password], socket);

        try {

            if (username in game.user_manager.users) {

                if (game.user_manager.users[username].password == password) {

                    if (!game.user_manager.users[username].online) {

                        socket.set('username', username);

                        game.user_manager.users[username].login_count++;

                        game.user_manager.users[username].online = true;

                        game.user_manager.users[username].socket = null;

                        socket.emit('msg', { command: 'login', user_object: game.user_manager.users[username] });

                        game.user_manager.users[username].socket = socket;

                        game.chat_manager.user_connect(username);

                    } else {

                        socket.emit('msg', { command: 'error', title: "Login Failure", details: "User is already flagged as online" });

                    }

                } else {

                    socket.emit('msg', { command: 'error', title: "Login Failure", details: "The provided password was incorrect" });

                }

            } else {

                socket.set('username', username);

                game.user_manager.users[username] = new User();

                game.user_manager.users[username].username = username;

                game.user_manager.users[username].password = password;

                game.user_manager.users[username].online = true;

                socket.emit('msg', { command: 'login', user_object: game.user_manager.users[username] });

                game.user_manager.users[username].socket = socket;

            }

        } catch(err) {

            socket.emit('msg', { command: 'error', title: "Server Error", details: err.message });

        }



    }

    this.disconnect = function (username, socket) {

        this.game.log_method_call("game.user_manager.disconnect", [username], socket);

        if (username in game.user_manager.users) {

            this.users[username].online = false;

        }

    };

    this.__constructor(game);
}

function User() {

    this.username;

    this.password;

    this.online = false;

    this.login_count = 1;

    this.socket;

    this.admin = true;

    this.avatar_id = 1;

}