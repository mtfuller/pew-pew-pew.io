const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Player = require('./../game/entities').Player;

chai.should();
chai.use(chaiAsPromised);

describe("Player", function () {
    it("multiple players should be initialized with default components", function() {
        let player1 = new Player();

        // Make sure player 1 has correct defaults
        player1.position.should.deep.equal({x: 0, y: 0});
        player1.velocity.should.deep.equal({magnitude: 0, theta: 0});
        player1.collision.should.deep.equal({isCollidable: true});

        // Modify player 1
        player1.position.x = 15;
        player1.position.y = 42;

        // Create new player
        let player2 = new Player();

        // Check that the modification of player 1 didn't affect player 2
        player2.position.should.deep.equal({x: 0, y: 0});
        player2.velocity.should.deep.equal({magnitude: 0, theta: 0});
        player2.collision.should.deep.equal({isCollidable: true});
    });
});