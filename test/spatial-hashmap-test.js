const chai = require('chai');
const SpatialHashmap = require('./../lib/spatial-hashmap');

chai.should();

const testHashmap = new SpatialHashmap({
    width: 100,
    height: 100,
    cellSize: 5,
    entitySize: 1,
});

let entities = [
    {
        id: "abc123",
        coor: {x: 5.2, y: 34}
    },
    {
        id: "def456",
        coor: {x: 5, y: 34.3}
    }
];

let farAwayEntity = {
    id: "ghi789",
    coor: {x: 50, y: 50}
};

describe("Spatial Hashmap", function () {
    it("can add new entities", function () {
        entities.forEach((entity, index) => {
            testHashmap.addEntity(entity.id, entity.coor);
        });

        entities.forEach((entity, index) => {
            testHashmap.hasEntity(entity.id).should.be.true;
        });
    });

    it("detects collision between nearby entities", function () {
        let nearbyEntities = testHashmap.getNearbyEntities("abc123");
        nearbyEntities.should.have.lengthOf(1);
        nearbyEntities.should.include.members(["def456"]);
    });

    it("ignores far away entities", function () {
        testHashmap.addEntity(farAwayEntity.id, farAwayEntity.coor);
        let nearbyEntities = testHashmap.getNearbyEntities("ghi789");
        nearbyEntities.should.have.lengthOf(0);
    });
});