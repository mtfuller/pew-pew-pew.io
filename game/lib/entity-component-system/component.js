/**
 *
 * @param name
 * @param data
 * @returns {function(*)}
 * @constructor
 */
const Component = (name, data) => {
    return () => {
        return {
            name: name,
            data: Object.assign({}, data)
        }
    };
};

module.exports = Component;
