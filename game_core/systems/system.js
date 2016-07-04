var System = function(compName) {
    this.entities = [];
    this.componentName = compName;
    this.paused = false;
    this.pause = function() {this.paused = true;};
    this.resume = function() {this.paused = false;};
    this.addEntity = function(entity_name) {this.entities.push(entity_name);};
    this.removeEntity = function(target_entity_name) {
        var index = this.entities.indexOf(target_entity_name)
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    };
    this.init = function() {console.log("SYSTEM INIT!");};
    this.update = function() {console.log("SYSTEM UPDATE!");};
}

module.exports.System = System;
