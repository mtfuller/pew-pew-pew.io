// =============================================================================
// Author:  Thomas Fuller
// File:    entity.js
// =============================================================================
// Description:
//
// =============================================================================

// =============================================================================
// Entity
// =============================================================================
var Entity = function(id) {
    this.id = id;             // Id of entity
    this.components = {};     // List of components apart of the entity

    // Returns the component at the specified name
    this.getComponent = function(name) {
      return this.components[name];
    };

    // Adds the given component to the entity
    this.addComponent = function(comp) {
      this.components[comp.name] = comp.data;
    };
}

module.exports.Entity = Entity;
