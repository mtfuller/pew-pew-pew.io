var GameClient = {
    // Player information for the Game Client
    player: {
        uuid: null,
        token: null,
        alive: true,
        joined: false,
        score: 0,
        position: {x: 0, y: 0},
        velocity: {magnitude: 0, theta: 0},
        health: {life: 20},
        control: {theta: 0}
    },

    // Collection of entities received from Game Server
    entities: [],

    // Game information for the Game Client
    gameInfo: {
        width: 1000,
        height: 1000,
        maxHealth: 100,
        gameFull: false
    },

    /**
     * Inits the game client, creating a new Socket.io connection, creating a 2D
     * context for the canvas, etc.
     *
     * @param id    The ID of the HTML5 canvas element.
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
     * Starts the Game Client
     */
    run: function() {
        GameClient.log("Joining game...");

        // Tell the Socket.io client to display "Game Full", if the server emits
        // a "game_full" message.
        GameClient.socket.on('game_full', function () {
            GameClient.log("GAME IS FULL");
            GameClient.gameInfo.gameFull = true;
        });

        // Tell the Socket.io client to start the game when the server emits
        // "join".
        GameClient.socket.on('join', function(data){
            GameClient.player.joined = true;
            GameClient.player.token = data.token;
            GameClient.log("Client has joined game.");

            // Create mouse event handler that sends mouse info to Game Server
            $("#"+GameClient.id).mousemove(function(evt) {
                if (GameClient.player.alive) {
                    GameClient.log("Sending input...");
                    GameClient.socket.emit('input', {
                        token: GameClient.player.token,
                        input: GameClient.getPlayerMouse(evt),
                    });
                }
            });

            // Create a click event handler that sends click info to Game Server
            $("#"+GameClient.id).click(function(evt) {
                if (GameClient.player.alive) {
                    GameClient.log("Sending input...");
                    GameClient.socket.emit('input', {
                        token: GameClient.player.token,
                        input: {trigger: true}
                    });
                }
            });

            // If game server emits "update", then update GameClient info.
            GameClient.socket.on('update', function (res) {
                GameClient.player.position = res.player.position;
                GameClient.player.velocity = res.player.velocity;
                GameClient.player.health = res.player.health;
                GameClient.player.score = res.score;
                GameClient.entities = res.entities;
            });

            // If game server emits "game_over" message, update GameClient and
            // reset connection after 5 seconds.
            GameClient.socket.on('game_over', function (res) {
                GameClient.player.alive = false;
                GameClient.socket.close(true);
                setTimeout(function() {
                    GameClient.player.alive = true;
                    GameClient.socket = io();
                    GameClient.run();
                }, 5000);
            });
        });

        // Start rendering the game
        GameClient.renderGame();
    },

    /**
     * Returns the angle, in degrees, that the mouse pointer is making with the
     * center of the screen.
     *
     * @param evt   A mousemove event object.
     * @returns {{theta: number}}
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
     * Renders the entier game screen every 30 millis.
     */
    renderGame: function() {
        // Clear game screen
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw black background
        this.context.beginPath();
        this.context.fillStyle="#000000";
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fill();

        // Draw all of the entities received from the game server
        for (i = 0; i < this.entities.length; i++) {
            this.drawEntity(this.entities[i]);
        }

        // Draw several game screen components
        this.drawEntity(this.player);
        this.drawMinimap();
        this.drawScore(this.player.score);
        this.drawHealthBar(this.player.health.hp);

        // Re-render the game screen in 30 millis
        var game = this;
        setTimeout(function() {
            if (game.gameInfo.gameFull) {
                game.drawGameFull();
            } else if (!game.player.joined) {
                game.drawJoinGame();
            } else if (game.player.alive) {
                game.renderGame();
            } else {
                game.drawHealthBar(0);
                game.drawGameOver();
            }
        }, 30);
    },

    /**
     * Draw an entity to the screen.
     *
     * @param obj
     */
    drawEntity: function(obj) {
        var SCALE_FACTOR = 4;

        // Get theta from obj
        var theta = obj.velocity.theta;

        // Compute relative position between this entity and the player
        var relX = obj.position.x - this.player.position.x;
        var relY = obj.position.y - this.player.position.y;

        // Adjust the relative position so that entity positions appear to
        // "wrap" around the borders. That way entities on opposite sides of the
        // board will appear close.
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

        // Scale the relative position to display on the screen
        var x = relX*SCALE_FACTOR + (this.canvas.width / 2);
        var y = relY*SCALE_FACTOR + (this.canvas.height / 2);

        // Draw the entity based on whether it is a ship, bullet, etc.
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

    /**
     * Draws a ship on the screen at the given position, angle, and radius.
     *
     * @param x
     * @param y
     * @param theta     Angle of the ship in degrees
     * @param radius
     */
    drawShip: function(x, y, theta, radius=15) {
        var radiansToDegrees = Math.PI / 180.0 ;

        // Calculate point A
        var pointA_x = x + (radius * Math.cos(theta * radiansToDegrees));
        var pointA_y = y + (radius * Math.sin(theta * radiansToDegrees));

        // Calculate point B
        var pointB_x = x + (radius * Math.cos((theta + 140) * radiansToDegrees));
        var pointB_y = y + (radius * Math.sin((theta + 140) * radiansToDegrees));

        // Calculate point C
        var pointC_x = x + (radius * Math.cos((theta + 220) * radiansToDegrees));
        var pointC_y = y + (radius * Math.sin((theta + 220) * radiansToDegrees));

        // Draw the ship
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

    /**
     * Draws a Bullet entity at the given x-y coordinates.
     *
     * @param x
     * @param y
     */
    drawBullet: function (x, y) {
        var radius = 2;
        this.context.beginPath();
        this.context.fillStyle="#FFFFFF";
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
        this.context.fill();
    },

    /**
     * Draws the minimap on the game screen.
     */
    drawMinimap: function () {
        // Initializes the dimensions of the minimap border
        var x = 10,
            y = 10,
            h = this.canvas.height*0.3,
            w = h;

        // Draws the minimap border
        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.lineJoin="round";
        this.context.strokeStyle="#FFFFFF";
        this.context.rect(x-5, y-5, w+10, h+10);
        this.context.stroke();

        // Draws the player blip
        var playerX = this.player.position.x / this.gameInfo.width;
        var playerY = this.player.position.y / this.gameInfo.height;
        this.drawBlip(x + w*playerX, y + h*playerY, true);

        // Draws all of the enemy blips
        for (var i = 0; i < this.entities.length; i++) {
            if (!this.entities[i].hasOwnProperty("health")) continue;
            var entityX = this.entities[i].position.x / this.gameInfo.width;
            var entityY = this.entities[i].position.y / this.gameInfo.height;
            this.drawBlip(x + w*entityX, y + h*entityY);
        }
    },

    /**
     * Draws a blip (minimap object) on to the game screen at the given
     * position. The isPlayer boolean determines the color of the blip. Green
     * for the player, red for an enemy. By default isPlayer is set to false.
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

    /**
     * Draws the health bar on the screen.
     *
     * @param health    The HP value of the player.
     */
    drawHealthBar: function(health) {
        health /= this.gameInfo.maxHealth;

        // Initialize the health bar dimensions
        var h = 15,
            w = 200,
            x = this.canvas.width - (10 + w),
            y = 10;

        // Draw black background underneath the health bar
        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.lineJoin="round";
        this.context.fillStyle="#000000";
        this.context.rect(x, y, w, h);
        this.context.fill();

        // Draw the health percentage bar in red
        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.lineJoin="round";
        this.context.fillStyle="#FF0000";
        this.context.rect(x, y, w*health, h);
        this.context.fill();

        // Draw the white border of the health bar
        this.context.beginPath();
        this.context.lineWidth=2;
        this.context.lineJoin="round";
        this.context.strokeStyle="#FFFFFF";
        this.context.rect(x, y, w, h);
        this.context.stroke();
    },

    /**
     * Draws the player's score to the screen.
     *
     * @param score {number}    The current score of the player.
     */
    drawScore(score) {
        // Initialize the dimensions of the score text
        var h = 15,
            w = 200,
            x = this.canvas.width - (10 + w),
            y = 10;

        // Display the score on the game screen
        this.context.font = "18px Monospace";
        this.context.fillStyle = "#FFFFFF";
        this.context.textAlign = "left";
        this.context.fillText("Score: " + score, 10, this.canvas.height - 18);
    },

    /**
     * Display the "Game Over" text
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
     * Display the "Joining Game..." text
     */
    drawJoinGame() {
        this.context.font = "64px Monospace";
        this.context.fillStyle = "#00FF00";
        this.context.textAlign = "center";
        this.context.fillText("Joining Game...", this.canvas.width/2, (this.canvas.height/2));
    },

    /**
     * Display the "Game Full" text
     */
    drawGameFull() {
        this.context.font = "64px Monospace";
        this.context.fillStyle = "#00FF00";
        this.context.textAlign = "center";
        this.context.fillText("Game Full", this.canvas.width/2, (this.canvas.height/2)-10);
        this.context.font = "36px Monospace";
        this.context.fillText("Please refresh...", this.canvas.width/2, (this.canvas.height/2)+50);
    },

    /**
     * Display the given object in the console, along with a timestamp.
     *
     * @param obj {string|object}
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