# Pew-Pew-Pew.io
![demo](https://raw.githubusercontent.com/mtfuller/pew-pew-pew.io/master/docs/img/demo.gif "pew-pew-pew.io Demo")

## Overview
Pew-Pew-Pew.io is a web-based game that can be played in your browser, following in the spirit of other browser games, like agar.io, diep.io, and slither.io.

These types of web games are extremely popular for their simplicity and fast-paced action. A type of “just drop in and play” experience.

## Features
Here are just some of the features that have been completed thus far:
+ Players are able to join a game.
+ Players can move their mouse and click to move their ship and fire their weapon!
+ Players have regenerative health.
+ Players get points when their bullets hit an enemy ship and when they destroy a ship.
+ Collision system kills players that crash into each other.
+ Server can be configured to allow only a certain amount of players in a game.


## Architecture and Design

Pew-pew-pew.io uses a client/server architecture to facilitate the multiplayer game. It makes use of express.js to serve the game view (`index.html`) and the game client script (`GameClient.js`). Socket.io handles the real-time, client/server messaging.

![architecture](https://raw.githubusercontent.com/mtfuller/pew-pew-pew.io/master/docs/img/architecture.png "pew-pew-pew.io Architecture")

In terms of the design for the actual game, I implemented a simple Entity Component System (ECS) framework in JavaScript. When the server launches it creates a new `Game` instance which manages players as well as several ECS systems (e.g. `CollisionSystem`, `HealthSystem`, etc.). 

The `Game` instance also makes use of a `SpatialHashmap` that employs simply spatial hashing for more efficient collision detection.

## Installation
#### Download repository
To download the repo, simply run
`git clone https://github.com/mtfuller/pew-pew-pew.io.git`.

#### Install Dependencies
Pew-pew-pew.io makes use of several packages to facilitate client/server communication, logging, JWT generation, etc. To install all dependencies, run `npm install` within the `/pew-pew-pew.io` directory.

#### Running the Server
Before running the server, you can modify the `config.json` file if you feel you need to change the maximum number of players or port. To run the server simply run `node app.js`;
