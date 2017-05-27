function Mouse(engine) {

    this.engine = null;

    this.x = null;

    this.y = null;

    this.click_x = null;

    this.click_y = null;

    this.highlight = null;

    this.__construct = function (engine) {

        this.engine = engine;

    }

    this.initialize = function () {

        var self = this;

        $('#canvas').mousemove(function (e) {

            self.x = e.pageX - $(this).position().left;

            self.y = e.pageY - $(this).position().top;

        });

        $('#canvas').click(function (e) {

            self.click_x = e.pageX - $(this).position().left;

            self.click_y = e.pageY - $(this).position().top;

            self.tile_click((Math.floor((self.click_x / 32))), (Math.floor(self.click_y / 32)));

        });



        this.highlight = new Image();

        this.highlight.src = '/images/ui/mouse_highlight.png';

    }

    this.tile_click = function (x, y) {

        if (this.engine.editor.active == true) {

            this.engine.editor.tile_click(x, y);

        } else {

            alert(x + ' - ' + y);

        }

        

    }

    this.render_highlight = function () {

        this.engine.context.drawImage(this.highlight, Math.floor((this.x / 32)) * 32, Math.floor(this.y / 32) * 32, 32, 32);

    }


    this.__construct(engine);

}