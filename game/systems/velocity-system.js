const System = require('./../lib/entity-component-system').System;

class VelocitySystem extends System {
  setup() {
      this.MIN_X = 0;
      this.MIN_Y = 0;
      this.MAX_X = game_manager.config_data.universe_width;
      this.MAX_Y = game_manager.config_data.universe_height;
  }

  update(id, entity) {
      let x = entity.position.x;
      let y = entity.position.y;
      let old_hash_index = this.game.spatialHashMap.hash(x,y);

      // Move entity's x position using their speed and direction
      entity.position.x += Math.round(entity.velocity.speed
          * Math.cos(entity.velocity.theta * (Math.PI / 180)));

      // Move entity's y position using their speed and direction
      entity.position.y += Math.round(entity.velocity.speed
          * Math.sin(entity.velocity.theta * (Math.PI / 180)));

      // If the entity moves past an edge on the map, the entity's position is
      // "wrapped" to the opposite edge. Just like in Astroids.
      if (entity.position.x >= this.MAX_X) {
          entity.position.x = this.MIN_X
      } else if (entity.position.x <= this.MIN_X) {
          entity.position.x = this.MAX_X-1
      }
      if (entity.position.y >= this.MAX_Y) {
          entity.position.y = this.MIN_Y
      } else if (entity.position.y <= this.MIN_Y) {
          entity.position.y = this.MAX_Y-1
      }

      x = entity.position.x;
      y = entity.position.y;
      var new_hash_index = this.game.spatialHashMap.hash(x,y);

      if (old_hash_index !== new_hash_index) {
          game_manager.spatialHashMap.removeEntity(name.id);
          game_manager.spatialHashMap.addEntity(name.id, x, y);
      }
  }
}

module.exports = VelocitySystem;
