const chai = require('chai');
const ecs = require('../game/lib/entity-component-system');

chai.should();

const Entity = ecs.Entity;
const Component = ecs.Component;
const System = ecs.System;

/**
 * Defining the Position component. It is used to keep track of x-y coordinates.
 */
const Position = Component("position", {
    x: 0,
    y: 0
});

/**
 * A Life component that keeps track of the "alive" state.
 */
const Life = Component("life", {
    isAlive: true
});

/**
 * A simple entity that contains a Position component.
 */
class PlayerEntity extends Entity {
    setup() {
        this.addComponent(Position());
        this.addComponent(Life());
    }
}

/**
 * A simple system used to move all entities at a constant speed.
 */
class VelocitySystem extends System {
    setup() {
        this.speed = 1;
    }

    update(id, entity) {
        if (entity.life.isAlive) {
            entity.position.x += this.speed;
            entity.position.y -= this.speed;
        }
    }
}

/**
 * A simple system used to check if a condition had occurred
 */
class SimpleCollisionSystem extends System {
    setup() {
        this.minX = 0;
        this.minY = 0;
        this.maxX = 10;
        this.maxY = 10;
    }

    update(id, entity) {
        if (entity.position.x < this.minX || entity.position.x > this.maxX ||
            entity.position.y < this.minY || entity.position.y > this.maxY) {
            entity.life.isAlive = false;
        }
    }
}

// Setting up the ECS manager, system, and entity
const myNewManager = new ecs.Manager();
let velocity = new VelocitySystem();
let collision = new SimpleCollisionSystem();
let player = new PlayerEntity();

// Add system and entity to manager
myNewManager.addSystem(velocity);
myNewManager.addSystem(collision);
myNewManager.addEntity("abc123", player);

describe("Entity Component System", function () {
    describe("Entities", function () {
        it("should allow the user to set default values upon creation", function () {
            let newPlayer = new PlayerEntity({
                position: {x: 5, y: 8}
            });
            myNewManager.addEntity("testPlayer123", newPlayer);

            newPlayer.position.x.should.equal(5);
            newPlayer.position.y.should.equal(8);
        });

        it("should allow the user to check if a component exists", function() {
            player.hasComponent("position").should.be.true;
            player.hasComponent("invalidComponent").should.be.false;
        });
    });

    describe("Systems", function() {
        it("should update entities within the ECS system", function() {
            let newPlayer = new PlayerEntity({
                position: {x: -4, y:0}
            });
            myNewManager.addEntity("aNewPlayer123", newPlayer);

            newPlayer.life.isAlive.should.be.true;
            myNewManager.update();
            newPlayer.life.isAlive.should.be.false;
        });
    });

    describe("Manager", function() {
        it("should be able to return the entity of a given id", function() {
            const id = "abc123";
            let receivedEntity = myNewManager.getEntity(id);
            receivedEntity.should.deep.equal(player);
        });
    })
});