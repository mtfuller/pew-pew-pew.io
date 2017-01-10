var Entity = function(id) {
    this.id = id;
    this.components = {};
    this.getComponent = function(name) {
      return this.components[name];
    }
}

module.exports.Entity = Entity;

module.exports.addComponent = function(entity, comp) {
    entity.components[comp.name] = comp.data;
}
