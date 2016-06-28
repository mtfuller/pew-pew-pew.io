# Pew-Pew-Pew.io

## Overview

Pew-Pew-Pew.io is a web-based game that can be played in your browser, following in the spirit of other browser games, like agar.io, diep.io, and slither.io.

These types of web games are extremely popular for their simplicity and fast-paced action. A type of “just drop in and play” experience.

### Goal:
The goal of this project is to create a browser-based game mirroring the basic gameplay of the classic arcade game, Asteroid.

## Installation

#### Dependencies:
+ Node.js - Web server
+ express.js - Web framework
+ socket.io - Quick, real-time client/server communication.

Currently, all source code is used in the same root directory where server.js is located. No steps or dependencies have been documented yet.

## Milestones

### Milestone 1: "Space Explorer"

Create a server that is able to receive players and be able to move/orient their ships in real time. Here are some main objectives:
+ Create basic server that receives clients requests to join, move their ship, orient their ship, and leave.
+ Create the basic client code to display the proper game objects sent.
+ Create the foundational, real-time communication between client and server.

### Milestone 2: “Simple Space Battle”

Build on the previous client/server system, but this time add some more game functionality (health, shooting). Here are some main objectives:
+ Add extra game rules, like health/death, shooting, "physical space" (ships cannot occupy the same space).

### Milestone 3: “Full Asteroids”

Build on the previous system, add asteroids into the mix along with other improvements. Some added functionality:

+ Asteroids, duh...
+ The 3-stage asteroid system (smaller asteroids spawn after asteroid is destroyed).

### Milestone 4: “Modded Space Wars”

Finalize the system by adding an easy way to add mods to change and alter the functionality, like team battles, different skins, etc. Some added functionality:

+ Add an easy way for developers to add scripts, configurations, etc. to a server game.
+ Allow system to be EASILY deployed to any server with the right requirements.
