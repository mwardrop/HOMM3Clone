var fs = require('fs');

function MapManager(game) {

    this.game;

    this.maps = {};

    this.__constructor = function (game) {

        this.game = game;

    }

    this.initialize = function () {

        this.game.log_method_call("game.map_manager.initialize");

        if (!this.load_state()) {

            this.maps['default'] = this.generate_blank_map(100, 100);
        }


    }

    this.save_state = function () {

        this.game.log_method_call("game.map_manager.save_state");

        var map_data = JSON.stringify(this.maps);

        fs.writeFile('./State/maps.json', map_data, function (err) {

            if (err) {

                this.game.log('could not save map state', 'error');

                this.game.log(err.message, 'error');

                return;
            }

            this.game.log('map state saved', 'info');

        });

    }

    this.load_state = function () {

        this.game.log_method_call("game.map_manager.load_state");

        try {

            var map_data = fs.readFileSync('./State/maps.json');

            this.maps = JSON.parse(map_data);

            this.game.log('map state loaded', 'info');

            return true;

        } catch (err) {

            this.game.log('could not load map state', 'error');

            this.game.log(err.message, 'error');

            return false;

        }

    }

    this.get_map = function (name, socket) {

        this.game.log_method_call("game.map_manager.get_map", [name], socket);

        socket.emit('msg', { command: 'load_map', map: this.maps[name] });

    }

    this.generate_blank_map = function (width, height) {

        this.game.log_method_call("game.map_manager.generate_blank_map", [width, height]);

        var map = new Array;

        for (r = 0; r < width; r++) {

            map[r] = new Array();

            for (c = 0; c < height; c++) {

                map[r][c] = new Tile();

                map[r][c].passable = true;

                map[r][c].foreground = false;

                map[r][c].terrain = false;

                map[r][c].background = "tgrb014.png";

            }

        }

        return map;

    }

    this.__constructor(game);

}



function Tile() {

    this.background;

    this.terrain;

    this.foreground;

    this.passable;

}