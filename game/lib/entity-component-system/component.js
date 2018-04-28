/**
 * Returns a function that will return a component object, containing a name and
 * default properties.
 *
 * @param name  The name of the component.
 * @param data  An object that contains the default properties of the component.
 * @returns {function(*)}
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
