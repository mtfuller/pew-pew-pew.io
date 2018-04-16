/**
 *
 * @param systemName
 * @returns {{}}
 * @constructor
 */
var System = function(systemName) {
    var retObj = {};

    // List of all the entity id's that have subscribed to this system
    retObj.entities = [];

    retObj.systemName = systemName;     // Name of the component
    retObj.paused = false;              // Boolean to tell if system is paused

    // Pauses the system, so it won't update
    retObj.pause = function() {this.paused = true;};

    // Resumes the system, so it will update
    retObj.resume = function() {this.paused = false;};

    // Adds an entity id to the list of entities subscribed to the system
    retObj.addEntity = function(entity_name) {
      retObj.entities.push(entity_name);
    };

    // Removes an entity id from the list of entities subscribed to the system
    retObj.removeEntity = function(target_entity_name) {
        var index = retObj.entities.indexOf(target_entity_name)
        if (index > -1) {retObj.entities.splice(index, 1);}
    };

    // Default initialization of a system
    retObj.init = function() {console.log("SYSTEM INIT!");};

    // Default update of a system
    retObj.update = function() {console.log("SYSTEM UPDATE!");};

    return retObj;
};

module.exports.System = System;
