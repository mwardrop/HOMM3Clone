function Editor(engine) {

    this.engine = null;

    this.active = false;

    this.image_list = {
        terrain: {loaded: false},
        background: { loaded: false }
    };

    this.load_count = 0;

    this.mode;

    this.submode;

    this.edit_tile;

    this.initialized = false;

    this.__constructor = function (engine) {

        this.engine = engine;

    }

    this.initialize = function () {

        var self = this;

        this.update_load_status();

        this.load_image_list('background');

        this.load_image_list('terrain');

        $("#editor").draggable({ handle: "span" });;

        $("#editor_button").click(function () {

            self.active = true;

            $('#editor_control option').eq(0).attr('selected', 'selected');

            $('#editor_control').change();

            $("#editor").show();

        });

        $("#editor_control").change(function () {

            self.set_mode($(this).val());

        }).change();

        $("#map_editor_control").change(function () {

            self.set_submode($(this).val());

        }).change();


    }

    this.update_load_status = function () {

        var self = this;

        if (!this.initialized) {

            var total = 0;

            for (var key in this.image_list) {

                total += this.engine.images[key].length;

            }

            this.engine.user_interface.update_load_display("Loading Editor", ((this.load_count / total) * 100));

            setTimeout(function () { self.update_load_status(); }, 1000);

        } else {

            $('.editor_background_tile').click(function() {

                    $('.editor_background_tile').removeClass('editor_background_tile_selected');

                    $(this).addClass('editor_background_tile_selected');

                    self.edit_tile = $(this).attr("name");


                });

            this.engine.user_interface.update_load_display("Initializing Map");

            console.log("Initializing Map");

            this.engine.map.initialize();

        }



    }

    this.set_mode = function (mode) {

        $("#editor > div").hide();

        this.mode = mode;

        switch (mode) {
            
            case 'map':

                $("#map_editor").show();

                break;

            case 'player':

                $("#player_editor").show();

                break;

            case 'event':

                $("#event_editor").show();

                break;

            case 'options':

                $("#options_editor").show();

                break;

            case 'close':

                this.active = false;

                $("#editor").hide();

                break;

        }

    }

    this.set_submode = function (mode) {

        this.submode = mode;

        if (this.mode == 'map') {

            $("#map_background_editor").hide();

            $("#map_terrain_editor").hide();

            $("#map_foreground_editor").hide();

            $("#map_passable_editor").hide();


            switch (mode) {

                case 'background':

                    $("#map_background_editor").show();

                    break;

                case 'terrain':

                    $("#map_terrain_editor").show();

                    break;

            }

        }

    }

    this.load_image_list = function (type, count) {

        var self = this;

        if (!count) {

            count = 1;

        }

        var key_index;

        var key_count = 0;

        for (var key in this.engine.images[type]) {

            if(count == key_count) {

                key_index = key;

                break;

            }

            key_count++;

        }
            
       // $("#map_" + type + "_editor").html($("#map_" + type + "_editor").html() + '<img src="images/map/' + type + '/' + this.engine.images[type][count].name + '" class="editor_' + type + '_tile" name="' + this.engine.images[type][count].name + '" />');

        $("#map_" + type + "_editor").append('<img src="images/map/' + type + '/' + this.engine.images[type][key_index].name + '" class="editor_' + type + '_tile" name="' + this.engine.images[type][key_index].name + '" />');
        //if (i % 3 == 0) {

        //    $("#map_" + type + "_editor").html($("#map_" + type + "_editor").html() + '<br />');

        //}

        count++;

        this.load_count++;

        if (count < this.engine.images[type].length) {

            setTimeout(function () { self.load_image_list(type, count); }, 5); // 50 milliseconds = 20 FPS

        } else {

            this.image_list[type].loaded = true;

            var initialized = true;

            for (var key in this.image_list) {

                if (!this.image_list[key].loaded) {

                    initialized = false;

                }

            }

            this.initialized = initialized;

        }

    }

    //this.load_image_list = function (type) {

    //    for (i = 0; i < this.engine.images[type].length - 1; i++) {

    //        $("#map_" + type + "_editor").html($("#map_" + type + "_editor").html() + '<img src="images/map/' + type + '/' + this.engine.images[type][i].name + '" class="editor_' + type + '_tile" name="' + this.engine.images[type][i].name + '" />');

    //        if (i % 3 == 0) {

    //            $("#map_" + type + "_editor").html($("#map_" + type + "_editor").html() + '<br />');

    //        }
    //    }

    //    var self = this;

    //    $('.editor_' + type + '_tile').click(function() {

    //        $('.editor_' + type + '_tile').removeClass('editor_' + type + '_tile_selected');

    //        $(this).addClass('editor_' + type + '_tile_selected');

    //        self.edit_tile = $(this).attr("name");
            

    //    });

    //}



    this.tile_click = function (x, y) {

        if (this.mode == 'map') {

            if (this.submode == 'background') {

                this.engine.map.current[x][y].background = this.edit_tile;

            }

        }

        this.update_tile(this.engine.map.name, x, y, this.engine.map.current[x][y]);

    }

    this.update_tile = function (map, x, y, tile) {

        var msg_tile = {
            background: tile.background,
            terrain: tile.terrain,
            foreground: tile.foreground,
            passable: tile.passable
        }

        this.engine.network.send_msg({ command: 'update_tile', map: map, tile: msg_tile, x: x, y: y });

    }

    this.__constructor(engine);
}
