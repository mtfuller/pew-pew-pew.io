/**
 *
 * @param compName
 */
var component = function(compName) {
    this.name = compName;       // Name of component
    this.data = {};             // Data stored in the component
};

module.exports.newComponent = component;
