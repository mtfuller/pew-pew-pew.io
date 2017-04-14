// =============================================================================
// Author:  Thomas Fuller
// File:    system.js
// =============================================================================
// Description:
//
// =============================================================================

// =============================================================================
// System
// =============================================================================
var System = function(systemName) {
    // List of all the entity id's that have subscribed to this system
    this.entities = [];

    this.systemName = systemName;     // Name of the component
    this.paused = false;              // Boolean to tell if system is paused

    // Pauses the system, so it won't update
    this.pause = function() {this.paused = true;};

    // Resumes the system, so it will update
    this.resume = function() {this.paused = false;};

    // Adds an entity id to the list of entities subscribed to the system
    this.addEntity = function(entity_name) {
      this.entities.push(entity_name);
    };

    // Removes an entity id from the list of entities subscribed to the system
    this.removeEntity = function(target_entity_name) {
        var index = this.entities.indexOf(target_entity_name)
        if (index > -1) {this.entities.splice(index, 1);}
    };

    // Default initialization of a system
    this.init = function() {console.log("SYSTEM INIT!");};

    // Default update of a system
    this.update = function() {console.log("SYSTEM UPDATE!");};
}

module.exports.System = System;
