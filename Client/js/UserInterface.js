function UserInterface(engine) {

    this.column_count = 1;

    this.row_count = 1;

    this.canvas_height = 32;

    this.canvas_width = 32;

    this.engine = null;

    this.mouse = null;

    this.chat = null;

    this.__construct = function (engine) {

        this.engine = engine;

        this.mouse = new Mouse(engine);

        this.chat = new Chat(engine);

    }

    this.initialize = function () {

        var self = this;

        $(window).resize(function () {

            self.render_viewport();

        });

        $("#login_button").click(function () {

            var username = $("#login_username").val();

            var password = $("#login_password").val();

            self.engine.user.login(username, password);

        });

        $("#avatar_button").click(function () {

            alert('To do: Implement character screen.');

        });

        $("#modal").click(function() {

            $("#modal").hide();

        });

        $(window).resize();

        this.mouse.initialize();

        this.chat.initialize();

    }

    this.show_login = function () {

        if (this.engine.initialized()) {

            $("#loader").hide();

            $("#login").css("left", ($(window).width() / 2 - 145));

            $("#login").css("top", ($(window).height() / 2 - 96));

            $("#login").fadeIn();

        } else {

            var self = this;

            setTimeout(function () { self.show_login(); }, 500);

        }

    }

    this.show_notification = function (title, msg) {

        $("#title").text(title);

        $("#msg").text(msg);

        $("#modal").show();

    }

    this.add_column = function (count, reset) {

        this.column_count = $("#border_table").find("tr").first().find("td").length - 2;

        if (typeof count == 'undefined') { count = 1; }

        if (typeof reset != 'undefined') {

            if (reset == true) {

                this.column_count = 1;

            }

        }

        var top_row = "";

        var bottom_row = "";

        for (i = 0; i < this.column_count + count; i++) {

            top_row = top_row + "<td class='top'></td>";

            bottom_row = bottom_row + "<td class='bottom'></td>";

        }

        $('.top').not('.left, .right').remove();

        $('.bottom').not('.left, .right').remove();

        $("#border_table").find("tr").first().html("<td class='top left'></td>" + top_row + "<td class='top right'></td>");

        $("#border_table").find("tr").last().html("<td class='bottom left'></td>" + bottom_row + "<td class='bottom right'></td>");

        $("#viewport").attr("colspan", this.column_count + count);

        this.canvas_width = (this.column_count + count) * 32;

    }

    this.add_row = function (count, reset) {

        this.row_count = $("#border_table").find("tr").length - 2;

        if (typeof count == 'undefined') { count = 1; }

        if (typeof reset != 'undefined') {

            if (reset == true) {

                this.row_count = 1;

            }

        }

        var row = "";

        for (i = 0; i < ((this.row_count - 1) + count) ; i++) {

            row = row + "<tr class='row'><td class='left'></td><td class='right'></td></tr>";

        }

        $(".row").remove();

        $("#viewport").parent().after(row);

        $("#viewport").attr("rowspan", this.row_count + count);

        this.canvas_height = (this.row_count + count) * 32;

    }

    this.render_viewport = function () {

        var width = $(window).width();

        var height = $(window).height();

        this.add_column(Math.floor(width / 32) - 4, true);

        this.add_row(Math.floor(height / 32) - 4, true);

        this.render_borders();

        $("#canvas").css("width", this.canvas_width);

        $("#canvas").css("height", this.canvas_height);

        this.engine.context.canvas.width = this.canvas_width;

        this.engine.context.canvas.height = this.canvas_height;

        $("#avatar_button").css("left", $("#canvas").position().left + 5);

        $("#avatar_button").css("top", $("#canvas").position().top + 5);

        $("#notification").css("left", ($("#canvas").width() / 2 - 145));

        $("#notification").css("top", ($("#canvas").height() / 2 - 96));

        $("#modal").css("left", $("#canvas").position().left);

        $("#modal").css("top", $("#canvas").position().top);

        $("#modal").width($("#canvas").width());

        $("#modal").height($("#canvas").height());

        $("#editor_button").css("left", $("#canvas").position().left + 3);

        $("#editor_button").css("top", $("#canvas").position().top + 62);

        this.chat.window_resize();

    }

    this.render_borders = function () {

        var self = this;

        $(".left").each(function () {

            $(this).css("background-image", 'url("images/ui/left_' + (self.engine.random_number(4) + 1) + '.png")');

        });

        $(".right").each(function () {

            $(this).css("background-image", 'url("images/ui/right_' + (self.engine.random_number(4) + 1) + '.png")');

        });

        $(".top").each(function () {

            $(this).css("background-image", 'url("images/ui/top_' + (self.engine.random_number(4) + 1) + '.png")');

        });

        $(".bottom").each(function () {

            $(this).css("background-image", 'url("images/ui/bottom_' + (self.engine.random_number(4) + 1) + '.png")');

        });

        $(".top.left").css("background-image", 'url("images/ui/top_left.png")');

        $(".top.right").css("background-image", 'url("images/ui/top_right.png")');

        $(".bottom.left").css("background-image", 'url("images/ui/bottom_left.png")');

        $(".bottom.right").css("background-image", 'url("images/ui/bottom_right.png")');

    }

    this.show_map = function () {

        $("#window").fadeIn();

        $(window).resize();

    }

    this.update_load_display = function (msg, percentage) {

        if (percentage) {

            $("#loader_details").html(msg + " : " + parseInt(percentage) + "%");

        } else {

            $("#loader_details").html(msg);

        }
    }


    this.__construct(engine);

}