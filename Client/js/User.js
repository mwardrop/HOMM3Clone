function User(engine) {

    this.engine = null;

    this.username;

    this.online = false;

    this.admin = false;

    this.login_count = 0;

    this.avatar_id;

    this.__construct = function (engine) {

        this.engine = engine;
    }

    this.login = function (username, password) {

        this.engine.network.send_msg({ command: 'login', username: username, password: password });

    }

    this.login_success = function (data) {

        this.online = true;

        this.admin = data['user_object'].admin

        //this.admin = true;

        this.login_count = data['user_object'].login_count;

        if (this.admin == true) {

            $("#editor_button").show();

        }

        $("#login").hide();

        $("#avatar_button").show();

        this.engine.user_interface.show_map();
    }


    this.__construct(engine);

}