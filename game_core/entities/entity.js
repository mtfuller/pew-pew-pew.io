var Entity = function(id) {
    this.id = id;
    this.components = {};
    this.addComponent = function(comp) {
        this.components[comp.name] = comp.data;
    };
}

module.exports.Entity = Entity;
