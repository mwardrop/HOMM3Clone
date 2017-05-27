function Map(engine) {

    this.engine = null;

    this.current = null;

    this.name = 'default';

    this.__construct = function (engine) {

        this.engine = engine;
    }

    this.initialize = function () {

        this.get_map(this.name);

    }

    this.initialize_images = function () {

        for (r = 0; r < this.current.length; r++) {

            for (c = 0; c < this.current[r].length; c++) {

                this.current[r][c].passable = true;

                this.current[r][c].foreground = false;

                this.current[r][c].terrain = false;

                this.current[r][c].background_image = this.engine.images['background'][this.current[r][c].background].image;

            }

        }

    }

    this.render_background = function () {

        if (this.current) {

            for (r = 0; r < this.current.length - 1; r++) {

                for (c = 0; c < this.current[r].length - 1; c++) {

                    try {

                        this.engine.context.drawImage(this.current[r][c].background_image, (r * 32), (c * 32), 32, 32);

                    } catch (err) {

                        //console.log("Could not render background tile (" + r + ", " + c + ")");

                    }

                }

            }

        }

    }

    this.load_map = function (map) {

        this.current = map;

        this.initialize_images();

    }

    this.update_tile = function (map, x, y, tile) {

        if (this.name == map) {

            this.current[x][y] = tile;

            this.refresh_tile(x, y);

        }

    }

    this.get_map = function (map) {

        this.engine.network.send_msg({ command: 'get_map', name: map });

    }

    this.refresh_tile = function (x, y) {

        this.current[x][y].background_image = this.engine.images['background'][this.current[r][c].background].image;

    };

    this.__construct(engine);

}