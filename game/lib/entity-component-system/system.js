class System {
    /**
     * Initializes the System object by calling the implemented setup() method.
     */
    constructor() {}

    /**
     * An "abstract" method to be implemented by a subclass that is called after
     * the System is created.
     */
    setup() {}

    /**
     * Updates the data of the given entity that is passed in. To be implemented
     * by a subclass.
     *
     * @param id        The ID associated with the entity.
     * @param entity    An Entity object that contains several components.
     */
    update(id, entity) {
        throw Error("You must instantiate the update() method.");
    }
}

module.exports = System;
