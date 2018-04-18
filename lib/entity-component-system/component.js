/**
 *
 * @param name
 * @param data
 * @returns {function(*)}
 * @constructor
 */
const Component = (name, data) => {
    return {name: name, data: data};
};

module.exports = Component;
