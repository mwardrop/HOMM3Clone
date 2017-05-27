function Engine() {

    this.user_interface = null;

    this.editor = null;

    this.network = null;

    this.map = null;

    this.user = null;

    this.canvas = null;

    this.context = null;

    this.fps_count = 0;

    this.fps = 0;

    this.images = {
        background: { length: 0 },
        terrain: { length: 0 }
    }

    this.__construct = function () {

        this.user_interface = new UserInterface(this);

        this.network = new Network(this);

        this.map = new Map(this);

        this.user = new User(this);

        this.editor = new Editor(this);

        this.canvas = document.getElementById("canvas");

        this.context = this.canvas.getContext("2d");

    }

    this.start = function () {

        this.user_interface.update_load_display("Initializing User Interface");

        this.user_interface.initialize();

        this.user_interface.update_load_display("Initializing Network Interface");

        this.network.connect();

        this.user_interface.update_load_display("Preloading Images");

        this.preload();  

    }

    this.loaded = function () {

        this.editor.initialize();

        

        

        //this.state_loop();

        this.render_loop();

        this.fps_loop();

        this.user_interface.show_login();

    }

    this.preload = function (loop) {

        var self = this;

        if (loop) {

            var loaded = true;

            try {

                var load_count = 0;

                var total_count = 0;

                for (var key in this.images) {

                    if (this.images[key].length > 0) {

                        total_count += this.images[key].length;

                        for (var ikey in this.images[key]) {

                            if (this.images[key][ikey].loaded == false) {

                                loaded = false;

                            } else {

                                load_count++;

                            }

                        }


                    } else {

                        loaded = false;

                    }

                }

                this.user_interface.update_load_display("Preloading Images", ((load_count / total_count) * 100));

            } catch (err) {

                loaded = false;

                console.log(err);

            }

            loading = !loaded

            if (!loaded) {

                setTimeout(function () { self.preload(true); }, 25);

            } else {

                this.loaded();

            }

        } else {

            for (var key in this.images) {

                this.network.send_msg({ command: 'image_list', type: key });

            }

            setTimeout(function () { self.preload(true); }, 25);

        }

    }

    this.initialized = function () {

        if (this.editor.initialized) {

            return true;

        }

        return false;

    }

    this.state_loop = function () {

        var self = this;

        setTimeout(function () { self.state_loop(); }, 25);

    }

    this.render_loop = function () {

        var self = this;

        this.fps_count++;

        this.map.render_background();

        this.user_interface.mouse.render_highlight();

        setTimeout(function () { self.render_loop(); }, 50); // 50 milliseconds = 20 FPS

    }

    this.fps_loop = function () {

        this.fps = this.fps_count;

        this.fps_count = 0;

        var self = this;

        setTimeout(function () { self.fps_loop(); }, 1000);

    }

    this.random_number = function(max) {

        return Math.floor(Math.random() * max);

    }

    this.load_image_list = function (type, list) {

        for (i = 0; i < list.length; i++) {

            switch (type) {

                case 'background':

                    this.images[type][list[i]] = new GameImage(list[i], "images/map/background");

                    break;

                case 'terrain':

                    this.images[type][list[i]] = new GameImage(list[i], "images/map/terrain");

                    break;
            }

            this.images[type].length++;

            this.images[type][list[i]].load();

        }

    }

    this.__construct();

}

function GameImage(name, path) {

    this.name;

    this.image;

    this.path;

    this.loaded = false;

    this.__construct = function (name, path) {
      
        if (name) {

            this.name = name;

        }

        if (path) {

            this.path = path;

        }

    }

    this.load = function () {

        var self = this;

        this.image = new Image();

        this.image.src = path + "/" + name;

        this.image.onload = function () {

            self.loaded = true;

        }

    }

    this.__construct(name, path);

}

