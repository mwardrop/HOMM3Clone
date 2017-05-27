function AdminManager(game) {

    this.game = null;

    this.__construct = function (game) {

        this.game = game;

    }

    this.update_tile = function (map, x, y, tile, socket) {

        if (this.is_admin(socket)) {

            this.game.log_method_call("game.admin_manager.update_tile", [map, x, y, tile], socket);

            this.game.map_manager.maps[map][x][y] = tile;

            this.game.network_manager.broadcast_msg({ command: 'update_tile', map: map, x: x, y: y, tile: tile });

        }
    }

    this.is_admin = function (socket, noResponse) {

        var username;

        socket.get('username', function (err, name) {

            username = name;

        });

        if (username in this.game.user_manager.users) {

            if (this.game.user_manager.users[username].admin) {

                return true;

            } 

        } 

        if(!noResponse) {

            socket.emit('msg', { command: 'error', title: "Admin Control", details: "This functionality is restricted to administrative users." });

        }

        return false;

    }

    this.__construct(game);

}