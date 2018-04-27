var GameClient = {
    player: {
        uuid: null,
        token: null,
        alive: true,
        score: 0,
        position: {x: 0, y: 0},
        velocity: {magnitude: 0, theta: 0},
        health: {life: 20},
        control: {theta: 0}
    },
    entities: [],
    gameInfo: {
        width: 1000,
        height: 1000,
        maxHealth: 100,
    },

    /**
     *
     * @param id
     */
    init: function (id="gameWindow") {
        this.id = id;
        this.canvas = document.getElementById(this.id);
        this.context = this.canvas.getContext("2d");
        GameClient.log("Connecting to server...");
        this.socket = io();
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
                if (GameClient.player.alive) {
                    GameClient.log("Sending input...");
                    GameClient.socket.emit('input', {
                        token: GameClient.player.token,
                        input: GameClient.getPlayerMouse(evt),
                    });
                }
            });

            $("#"+GameClient.id).click(function(evt) {
                if (GameClient.player.alive) {
                    GameClient.log("Sending input...");
                    GameClient.socket.emit('input', {
                        token: GameClient.player.token,
                        input: {trigger: true}
                    });
                }
            });

            GameClient.socket.on('update', function (res) {
                GameClient.player.position = res.player.position;
                GameClient.player.velocity = res.player.velocity;
                GameClient.player.health = res.player.health;
                GameClient.player.score = res.score;
                GameClient.entities = res.entities;
            });

            GameClient.socket.on('game_over', function (res) {
                GameClient.player.alive = false;
                GameClient.socket.close(true);
                setTimeout(function() {
                    GameClient.player.alive = true;
                    GameClient.socket = io();
                    GameClient.run();
                }, 5000);
            });

            GameClient.renderGame();
        });
    },

    /**
     *
     * @param evt
     * @returns {{id: *, theta: number}}
     */
    getPlayerMouse: function (evt) {
        var screen = this.canvas.getBoundingClientRect();
        var x = (evt.clientX - screen.left) - (screen.width / 2);
        var y = (evt.clientY - screen.top) - (screen.height / 2);
        var new_theta = Math.round(Math.atan2(y,x)*(180/Math.PI));
        if (new_theta < 0) Math.abs(new_theta += 360);
        if (new_theta === -0) new_theta = 0;
        this.player.control.theta = new_theta;
        return {
            theta: this.player.control.theta
        };
    },

    /**
     *
     */
    renderGame: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.beginPath();
        this.context.fillStyle="#000000";
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fill();

        for (i = 0; i < this.entities.length; i++) {
            this.drawEntity(this.entities[i]);
        }
        this.drawEntity(this.player);
        this.drawMinimap();
        this.drawScore(this.player.score);
        this.drawHealthBar(this.player.health.hp);

        var game = this;

        setTimeout(function() {
            if (game.player.alive) {
                GameClient.renderGame();
            } else {
                GameClient.drawHealthBar(0);
                GameClient.drawGameOver();
            }

        }, 30);
    },

    /**
     *
     * @param obj
     */
    drawEntity: function(obj) {
        var SCALE_FACTOR = 4;
        var theta = obj.velocity.theta;

        var relX = obj.position.x - this.player.position.x;
        var relY = obj.position.y - this.player.position.y;

        if (Math.abs(relX) > this.gameInfo.width/2) {
            relX -= this.gameInfo.width;
            if (Math.abs(relX) > this.gameInfo.width/2)
                relX = relX.mod(this.gameInfo.width);
        }

        if (Math.abs(relY) > this.gameInfo.height/2) {
            relY -= this.gameInfo.height;
            if (Math.abs(relY) > this.gameInfo.height/2)
                relY = relY.mod(this.gameInfo.height);
        }

        var x = relX*SCALE_FACTOR + (this.canvas.width / 2);
        var y = relY*SCALE_FACTOR + (this.canvas.height / 2);

        if (obj.hasOwnProperty("health")) {
            this.drawShip(x, y, theta);
        } else if (obj.hasOwnProperty("bullet")) {
            this.drawBullet(x, y);
        } else {
            this.context.beginPath();
            this.context.fillStyle="#0000FF";
            this.context.arc(x, y, 5, 0, 2 * Math.PI);
            this.context.fill();
        }
    },

    drawShip: function(x, y, theta) {
        var radius = 15;
        var radiansToDegrees = Math.PI / 180.0 ;

        var pointA_x = x + (radius * Math.cos(theta * radiansToDegrees));
        var pointA_y = y + (radius * Math.sin(theta * radiansToDegrees));

        var pointB_x = x + (radius * Math.cos((theta + 140) * radiansToDegrees));
        var pointB_y = y + (radius * Math.sin((theta + 140) * radiansToDegrees));

        var pointC_x = x + (radius * Math.cos((theta + 220) * radiansToDegrees));
        var pointC_y = y + (radius * Math.sin((theta + 220) * radiansToDegrees));

        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.lineJoin="round";
        this.context.strokeStyle="#FFFFFF";
        this.context.moveTo(pointA_x, pointA_y);
        this.context.lineTo(pointB_x, pointB_y);
        this.context.lineTo(pointC_x, pointC_y);
        this.context.lineTo(pointA_x, pointA_y);
        this.context.lineTo(pointB_x, pointB_y);
        this.context.stroke();
    },

    drawBullet: function (x, y) {
        var radius = 2;
        this.context.beginPath();
        this.context.fillStyle="#FFFFFF";
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
        this.context.fill();
    },

    /**
     *
     */
    drawMinimap: function () {
        var x = 10,
            y = 10,
            h = this.canvas.height*0.3,
            w = h;

        var playerX = this.player.position.x / this.gameInfo.width;
        var playerY = this.player.position.y / this.gameInfo.height;

        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.lineJoin="round";
        this.context.strokeStyle="#FFFFFF";
        this.context.rect(x-5, y-5, w+10, h+10);
        this.context.stroke();

        this.drawBlip(x + w*playerX, y + h*playerY, true);
        for (var i = 0; i < this.entities.length; i++) {
            if (!this.entities[i].hasOwnProperty("health")) continue;
            var entityX = this.entities[i].position.x / this.gameInfo.width;
            var entityY = this.entities[i].position.y / this.gameInfo.height;
            this.drawBlip(x + w*entityX, y + h*entityY);
        }


    },

    /**
     *
     * @param x
     * @param y
     * @param isPlayer
     */
    drawBlip: function(x, y, isPlayer=false) {
        var radius = 2;
        this.context.beginPath();
        if (isPlayer)
            this.context.fillStyle="#00FF00";
        else
            this.context.fillStyle="#FF0000";
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
        this.context.fill();
    },

    drawHealthBar: function(health) {
        health /= this.gameInfo.maxHealth;

        var h = 15,
            w = 200,
            x = this.canvas.width - (10 + w),
            y = 10;

        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.lineJoin="round";
        this.context.fillStyle="#000000";
        this.context.rect(x, y, w, h);
        this.context.fill();

        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.lineJoin="round";
        this.context.fillStyle="#FF0000";
        this.context.rect(x, y, w*health, h);
        this.context.fill();

        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.lineJoin="round";
        this.context.strokeStyle="#FFFFFF";
        this.context.rect(x, y, w, h);
        this.context.stroke();
    },

    /**
     *
     */
    drawScore(score) {
        var h = 15,
            w = 200,
            x = this.canvas.width - (10 + w),
            y = 10;
        this.context.font = "18px Monospace";
        this.context.fillStyle = "#FFFFFF";
        this.context.textAlign = "left";
        this.context.fillText("Score: " + score, 10, this.canvas.height - 18);
    },

    /**
     *
     */
    drawGameOver() {
        this.context.font = "64px Monospace";
        this.context.fillStyle = "#00FF00";
        this.context.textAlign = "center";
        this.context.fillText("GAME OVER", this.canvas.width/2, (this.canvas.height/2)-10);
        this.context.font = "36px Monospace";
        this.context.fillText("Rejoining game...", this.canvas.width/2, (this.canvas.height/2)+50);
    },

    /**
     *
     * @param obj
     */
    log: function(obj) {
        var d = new Date();
        if (typeof obj === 'object') {
            console.log("[" + d.toLocaleString() + "] - DEBUG: ");
            console.log(obj);
        } else {
            console.log("[" + d.toLocaleString() + "] - DEBUG: " + obj);
        }

    }
};