function Chat(engine) {

    this.engine = null;

    this.display_timeout;

    this.__constructor = function (engine) {

        this.engine = engine;

    }

    this.initialize = function () {

        var self = this;

        $(document).keypress(function (e) {

            if (e.which == 13) {

                if ($("#chat_input > input").is(':focus')) {

                    if ($.trim($("#chat_input > input").val()) != "") {

                        self.send_msg($("#chat_input > input").val());

                    }

                    $("#chat_input > input").val("");

                    $("#chat_input").fadeOut();

                    $("#chat_input > input").blur();

                   

                } else {

                    self.show(true);

                }

            }

        });

        $("#chat_input > input").keypress(function (e) {

            self.reset_timeout();

        });

    }

    this.reset_timeout = function (type) {

        var self = this;

        clearTimeout(this.display_timeout);

        this.display_timeout = setTimeout(function () { self.hide(); }, 5000);

    }

    this.window_resize = function () {

        $("#chat").css("left", $("#canvas").position().left + 60);

        $("#chat").css("top", $("#canvas").position().top + 5);

        $("#chat").css("width", $("#canvas").width() - 68)

        $("#chat_input > input").css("width", $("#chat").width() - 4)
        

    }

    this.receive_msg = function (msg, user) {

        this.render_msg(msg, user);

    }

    this.render_msg = function (msg, user) {

        var msg_win = $("#chat_msg").clone();

        msg_win.attr("id", "chat_msg_clone");

        msg_win.find(".chat_msg_username").html(user);

        msg_win.find(".chat_msg_body").html(msg);

        $("#chat_output").append(msg_win);

        if (user == this.engine.user.username) {

            msg_win.find(".chat_msg_username").addClass("chat_msg_username_self");
            
        } else if (user == 'server') {

            msg_win.find(".chat_msg_username").addClass("chat_msg_username_server");

        }

        msg_win.show();

        this.show();

        
    }

    this.send_msg = function (msg) {

        this.engine.network.send_msg({ command: 'chat', msg: msg});

    }

    this.hide = function (hideInput) {

        $("#chat_output").fadeOut();

        $("#chat_input").fadeOut();

        $("#chat").fadeOut();

    }

    this.show = function (showInput) {

        if (this.engine.user.online) {

            if (showInput) {

                $("#chat_input").show();

            }

            this.reset_timeout();

            $("#chat_output").show();



            $("#chat").fadeIn(function () {

                $("#chat_output").scrollTop($('#chat_output')[0].scrollHeight);

                if (showInput) {

                    $("#chat_input > input").focus();

                }

            });

        }

    }


    this.__constructor(engine);
}