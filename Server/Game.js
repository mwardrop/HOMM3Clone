
var fs = require('fs');

// Client side style includes
eval(String(fs.readFileSync('Server/NetworkManager.js')));

eval(String(fs.readFileSync('Server/UserManager.js')));

eval(String(fs.readFileSync('Server/MapManager.js')));

eval(String(fs.readFileSync('Server/AdminManager.js')));

eval(String(fs.readFileSync('Server/ChatManager.js')));

var game = new Game();

exports.start = function (socket) {

    game.start(socket);

};

exports.receive_netmsg = function (socket, data) {

    game.network_manager.receive_msg(socket, data);

};

exports.client_disconnect = function (socket) {

    game.network_manager.client_disconnect(socket);

};

function Game() {

    this.count = 0;

    this.network_manager;

    this.user_manager;

    this.admin_manager;

    this.chat_manager;

    this.debug_data;

    this.socket;

    this.ansi_colors = {
        black: '\033[31m',
        red: '\033[31m',
        green: '\033[32m',
        yellow: '\033[33m',
        blue: '\033[34m',
        magenta: '\033[35m',
        cyan: '\033[36m',
        white: '\033[37m',
        reset: '\033[0m'
    }

    this.__constructor = function () {

        this.network_manager = new NetworkManager(this);

        this.user_manager = new UserManager(this);

        this.map_manager = new MapManager(this);

        this.admin_manager = new AdminManager(this);

        this.chat_manager = new ChatManager(this);

    }

    this.start = function (socket) {

        var self = this;

        this.socket = socket;

        this.log_method_call("game.start");

        this.map_manager.initialize();

       setInterval(function () {

           var date = new Date();

           self.network_manager.broadcast_msg({ command: 'chat', msg: "ping: " + date.getHours() + ":" + date.getMinutes(), user: "server" });

           self.log("message sent", 'info');

        }, 30000);

        this.main_loop();

    }

    this.main_loop = function () {

        var self = this;

        this.count++;

       setTimeout(function () { self.main_loop(); }, 100);
    }

    this.get_image_list = function (type, socket) {

        this.log_method_call("game.get_image_list", [type], socket);

        var path;

        switch (type) {

            case 'background':

                path = "Client/images/map/background";

                break;

            case 'terrain':

                path = "Client/images/map/terrain";

                break;
        }

        fs.readdir(path, function (err, files) {

            for (i = 0; i < files.length; i++) {

                var extension = files[i].split('.')[files[i].split('.').length - 1].toLowerCase();

                if (!(extension == 'gif' || extension == 'png')) {

                    files.splice(i, 1);

                    i--;


                }

            }

            socket.emit('msg', { command: 'image_list', type: type, list: files });

        });
    }

    this.debug_breakpoint = function (data) {
 
        this.debug_data = data;

    }

    this.log_method_call = function (method, params, socket) {

        var user = "";

        var param_string = "";

        if (socket) {

            socket.get('username', function (err, name) {

                user = " (" + name + ")";

            });

        }

        if (params) {

            for (i = 0; i < params.length; i++) {

                param_string += params[i]

                if (i != params.length - 1) {

                    param_string += ", ";

                }

            }

        }

        this.log("method call" + user + ": " + method + "(" + param_string + ")", 'debug');

    }

    this.log = function (msg, level) {

        var color = this.ansi_colors['reset'];

        switch (level.toLowerCase()) {

            case 'debug':

                color = this.ansi_colors['cyan'];

                break;

            case 'info':

                color = this.ansi_colors['green'];

                break;

            case 'error':

                color = this.ansi_colors['red'];

                break;

        }

        console.log(color + level + ": " + msg + this.ansi_colors['reset']);

    }


    this.__constructor();

}
