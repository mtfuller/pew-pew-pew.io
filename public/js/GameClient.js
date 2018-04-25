var GameClient = {
    player: {
        uuid: null,
        token: null,
        theta: 0,
    },
    entities: [],

    /**
     *
     * @param id
     */
    init: function (id="gameWindow") {
        this.id = id;
        this.canvas = document.getElementById(this.id);
        this.context = this.canvas.getContext("2d");
        this.socket = io();
        GameClient.log("Connecting to server...");
        GameClient.log("Connected.");
    },

    /**
     *
     */
    run: function() {
        GameClient.log("Joining game...");
        GameClient.socket.on('join', function(data){
            GameClient.player.token = data.token;
            GameClient.log("Client has joined game.");

            GameClient.log(GameClient.id);
            $("#"+GameClient.id).mousemove(function(evt) {
                GameClient.log("Sending input...");
                GameClient.socket.emit('input', {
                    token: GameClient.player.token,
                    input: GameClient.getPlayerInput(evt),
                });
            });

            GameClient.socket.on('update', function (data) {
                GameClient.log("Received game data...");
                entities = data.data;
            });

            setInterval(function() {
                GameClient.renderGame();
            }, 1000);
        });
    },

    /**
     *
     * @param evt
     * @returns {{id: *, theta: number}}
     */
    getPlayerInput: function (evt) {
        var screen = this.canvas.getBoundingClientRect();
        var x = (evt.clientX - screen.left) - (screen.width / 2);
        var y = (evt.clientY - screen.top) - (screen.height / 2);
        var new_theta = Math.round(Math.atan2(y,x)*(180/Math.PI));
        if (new_theta < 0) Math.abs(new_theta += 360);
        if (new_theta === -0) new_theta = 0;
        this.player.theta = new_theta;
        return {
            theta: this.player.theta
        };
    },

    /**
     *
     */
    renderGame: function() {
        this.context.lineWidth=5;
        this.context.lineJoin="round";
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle="#000000";
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fill();
        this.context.strokeStyle="#00FF00";
        for (i = 0; i < this.entities.length; i++) {
            var entity = this.entities[i];
            this.drawShip(entity);
        }
        this.drawShip({
            x: 0,
            y: 0,
            theta: this.player.theta
        })
    },

    drawShip: function(obj) {
        var theta = obj.theta;
        var radius = 35;
        var radiansToDegrees = Math.PI / 180.0 ;
        var x = obj.x + (this.canvas.width / 2);
        var y = obj.y + (this.canvas.height / 2);

        var pointA_x = x + (radius * Math.cos(theta * radiansToDegrees));
        var pointA_y = y + (radius * Math.sin(theta * radiansToDegrees));

        var pointB_x = x + (radius * Math.cos((theta + 140) * radiansToDegrees));
        var pointB_y = y + (radius * Math.sin((theta + 140) * radiansToDegrees));

        var pointC_x = x + (radius * Math.cos((theta + 220) * radiansToDegrees));
        var pointC_y = y + (radius * Math.sin((theta + 220) * radiansToDegrees));

        this.context.beginPath();
        this.context.moveTo(pointA_x, pointA_y);
        this.context.lineTo(pointB_x, pointB_y);
        this.context.lineTo(pointC_x, pointC_y);
        this.context.lineTo(pointA_x, pointA_y);
        this.context.lineTo(pointB_x, pointB_y);
        this.context.stroke();
    },

    /**
     *
     * @param string
     */
    log: function(string) {
        var d = new Date();
        console.log("[" + d.toLocaleString() + "] - DEBUG: " + string)
    }
};