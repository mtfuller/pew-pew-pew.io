class SpatialHashmap {
    /**
     * Instantiates a 2D spatial hashmap with a config object.
     *
     * @param config    An object used to pass in config values to the spatial
     *                  hashmap. Available config values:
     *                      {
     *                          width: The width of the hashmap grid.
     *                          height: The height of the hashmap grid.
     *                          cellSize: The number of cell rows and columns in
     *                                    the spatial hashmap.
     *                          entitySize: The size of each entity on the
     *                                      board. If the distance between two
     *                                      entities is greater or equal to this
     *                                      value, then the objects have
     *                                      "collided".
     *                      }
     */
    constructor(config = {}) {
        this.config = Object.assign({
            width: 100,
            height: 100,
            cellSize: 10,
            entitySize: 1
        }, config);

        this.cell_height = this.config.height / this.config.cellSize;
        this.cell_width = this.config.width / this.config.cellSize;
        this.entities = {};

        this.hashMap2d = new Array(this.config.cellSize*this.config.cellSize);
        for (let i=0; i < this.hashMap2d.length; i++)
            this.hashMap2d[i] = [];
    }

    /**
     * Returns the coordinate hash for a given x-y pair.
     *
     * @param x         A float that represents the x coordinate.
     * @param y         A float that represents the y coordinate.
     * @param pixels    A boolean that specifies whether the x-y pair is in
     *                  pixels, or is cell indicies. By default, it is set to
     *                  true.
     * @returns {*}     An integer that represents the coordinate hash for the
     *                  x-y pairs.
     */
    hash(x, y, pixels=true) {
        if (x < 0) x = this.config.width + x;
        if (y < 0) y = this.config.height + y;

        if (pixels) {
            x = Math.floor(x / this.cell_width);
            y = Math.floor(y / this.cell_height);
        }

        x = x % this.config.cellSize;
        y = y % this.config.cellSize;

        return (y*this.config.cellSize + x);
    }

    /**
     * Adds an entity to the spatial hashmap manager, under the given id.
     *
     * @param id    The unique ID given to the new entity.
     * @param coor  An object that contains an x and y value (ex. {x:2, y:5});
     */
    addEntity(id, coor) {
        if (this.hasEntity(id)) return;
        let hashedCoor = this.hash(coor.x, coor.y);
        this.hashMap2d[hashedCoor].push(id);
        this.entities[id] = hashedCoor;
    }

    /**
     * Returns true if the spatial hashmap has an entity associated with the
     * given id.
     *
     * @param id    A unique ID that corresponds to an entity in the spatial
     *              hashmap.
     * @returns {boolean}
     */
    hasEntity(id) {
        return this.entities.hasOwnProperty(id);
    }

    /**
     * Removes the entity from the spatial hashmap if it exists. Returns true if
     * the remove was successful.
     *
     * @param id    The ID of the entity you wish to remove.
     * @returns {boolean}
     */
    removeEntity(id) {
        if (this.hasEntity(id)) {
            let hashedCoor = this.entities[id];
            let i = this.hashMap2d[hashedCoor].indexOf(id);
            this.hashMap2d[hashedCoor].splice(i, 1);
            return true;
        } else return false;
    }

    /**
     * Returns an array of IDs that are close to the entity of the given ID.
     *
     * @param id    The ID of the entity you to use.
     * @returns {Array.<string>}
     */
    getNearbyEntities(id) {
        if (!this.hasEntity(id)) return [];

        let hashedCoor = this.entities[id];

        let nearbyEntities = this.hashMap2d[hashedCoor].slice(0);
        nearbyEntities.splice(nearbyEntities.indexOf(id), 1);

        let entityX = (hashedCoor % this.config.cellSize);
        let entityY = Math.floor(hashedCoor / this.config.cellSize);

        for (let gridIndex = 0; gridIndex < 9; gridIndex++) {
            if (gridIndex === 4) continue;

            let x = ((Math.floor(gridIndex % 3)) - 1) + entityX;
            let y = ((Math.floor(gridIndex / 3)) - 1) + entityY;
            let entities = this.hashMap2d[this.hash(x, y, false)];

            if (entities && entities.length > 0)
                nearbyEntities = nearbyEntities.concat(entities);
        }

        return nearbyEntities;
    }
}

module.exports = SpatialHashmap;