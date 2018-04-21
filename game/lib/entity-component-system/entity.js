class Entity {
    /**
     * Instantiates a new Entity and gives each component initial data values.
     * At the beginning of this constructor, the setup method is invoked.
     *
     * @param data  A data object that contains initial values for any of the
     *              components in the entity. To set the data of an entity, it
     *              must have the component specified. For example, if the
     *              entity has a "Position" component with the name "position"
     *              and x-y coordinates, then you can instantiate the entity at
     *              position (3,5) with:
     *                  let entity = new MyEntity({
     *                      position: {x: 3, y: 5}
     *                  });
     */
    constructor(data) {
        this.setup();
        for (let property in data) {
            if (this.hasOwnProperty(property)) {
                for (let item in data[property]) {
                    if (this[property].hasOwnProperty(item)) {
                        this[property][item] = data[property][item];
                    }
                }
            }
        }
    }

    /**
     * A method used to setup the Entity, specifically using the addComponent()
     * method. This method is to be implemented by a subclass.
     */
    setup() {
        throw Error("You must instantiate the setup() method.");
    }

    /**
     * Returns true if the entity has the component, under the given name.
     *
     * @param componentName {string}    The name of the component to search for.
     * @returns {boolean}
     */
    hasComponent(componentName) {
        return this.hasOwnProperty(componentName);
    }

    /**
     * Adds the given Component to the entity.
     *
     * @param Component     A Component object that must be in the following
     *                      form:
     *                          {
     *                              name: <NAME OF COMPONENT>,
     *                              data: {...}
     *                          }
     */
    addComponent(Component) {
        this[Component.name] = Component.data;
    }
}

module.exports = Entity;
