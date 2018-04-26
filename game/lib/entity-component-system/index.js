// Require ECS modules
const Entity = require('./entity');
const Component = require('./component');
const System = require('./system');

// Exports each base class/function
module.exports.Entity = Entity;
module.exports.Component = Component;
module.exports.System = System;

class Manager {
    /**
     * Instantiates a ECS manager object that contains empty sets for systems
     * and entities.
     */
    constructor(gameManager) {
        this.systems = [];
        this.entities = {};
        this.game = gameManager;
    }

    /**
     * Adds the given system to the list of systems within the ECS.
     *
     * @param system {System}   The System object that is to be added.
     */
    addSystem(system) {
        system.game = this.game;
        system.setup();
        this.systems.push(system);
    }

    /**
     * Returns the entity under the given ID. If it doesn't exist, it will
     * return undefined.
     *
     * @param id    The unique ID that refers to the entity being requested.
     * @returns {*}
     */
    getEntity(id) {
        return this.entities[id];
    }

    /**
     * Adds the given Entity object under the specified ID.
     *
     * @param id        The unique ID of the new Entity.
     * @param entity    The Entity object to be stored in the ECS.
     */
    addEntity(id, entity) {
        if (!this.entities.hasOwnProperty(id))
            this.entities[id] = entity;
    }

    /**
     * Removes the Entity object stored under the given ID.
     *
     * @param id    The ID of the entity that will be removed.
     */
    removeEntity(id) {
        delete this.entities[id];
    }

    /**
     * Updates each Entity using each System added to the ECS.
     */
    update() {
        for (let system of this.systems) {
            for (let id in this.entities) {
                system.update(id, this.entities[id]);
            }
        }
    }
}

module.exports.Manager = Manager;