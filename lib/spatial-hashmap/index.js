class SpatialHashmap {
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

    hash(x, y, normalize=true) {
        if (x < 0) x = this.config.width + x;
        if (y < 0) y = this.config.height + y;

        if (normalize) {
            x = Math.floor(x / this.cell_width);
            y = Math.floor(y / this.cell_height);
        }

        return (y*this.config.cellSize + x);
    }

    addEntity(id, coor) {
        let hashedCoor = this.hash(coor.x, coor.y);
        console.log("i: "+hashedCoor);
        console.log(this.hashMap2d[hashedCoor]);
        this.hashMap2d[hashedCoor].push(id);
        this.entities[id] = hashedCoor;
    }

    hasEntity(id) {
        return this.entities.hasOwnProperty(id);
    }

    removeEntity(id) {
        if (this.hasEntity(id)) {
            let hashedCoor = this.entities[id];
            let i = this.hashMap2d[hashedCoor].indexOf(id);
            this.hashMap2d[hashedCoor].splice(i, 1);
            return true;
        } else return false;
    }

    getNearbyEntities(id) {
        let hashedCoor = this.entities[id];
        let nearbyEntities = this.hashMap2d[hashedCoor].slice(0);
        nearbyEntities.splice(nearbyEntities.indexOf(id), 1);
        let entityX = (hashedCoor % this.config.cellSize);
        let entityY = (hashedCoor / this.config.cellSize);

        for (let gridIndex = 0; gridIndex < 9; gridIndex++) {
            if (gridIndex === 4) continue;


            let x = ((Math.floor(gridIndex % 3)) - 1) + entityX;
            let y = ((Math.floor(gridIndex / 3)) - 1) + entityY;
            let entities = this.hashMap2d[this.hash(x, y, false)];

            if (entities && entities.length > 0)
                nearbyEntities.push(entities);
        }

        return nearbyEntities;
    }
}

module.exports = SpatialHashmap;