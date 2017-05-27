function Network(engine) {

    this.engine = null;

    this.socket = null;

    this.__construct = function (engine) {

        this.engine = engine;
    }

    this.connect = function connect() {

        this.socket = io.connect('http://clippy.cudd.li/');

        var self = this;

        this.socket.on('msg', function (data) {

            var command = data['command'].toLowerCase();

            switch (command) {
                
                case 'login':

                    self.engine.user.login_success(data);

                    break;

                case 'image_list':

                    self.engine.load_image_list(data['type'], data['list']);

                    break;

                case 'error':

                    self.engine.user_interface.show_notification(data['title'], data['details']);

                    break;

                case 'update_tile':

                    self.engine.map.update_tile(data['map'], data['x'], data['y'], data['tile']);

                    break;

                case 'load_map':

                    self.engine.map.load_map(data['map']);

                    break;

                case 'chat':

                    self.engine.user_interface.chat.receive_msg(data['msg'], data['user']);

                    break;

                default:

                    console.log("Unknown Network Command: " + command);

                    break;

            }

        });
    }

    this.send_msg = function (data) {

        this.socket.emit('msg', data);

    }

this.__construct(engine);

}