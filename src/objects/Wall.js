/*
 * Wall
 * ====
 *
 */

'use strict';

function Wall(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'wall');
  this.frame = Math.floor(Math.random() * 16);
  game.physics.p2.enable(this);
  this.body.setCollisionGroup(game.wallCollisionGroup);
  this.body.collides([game.playerCollisionGroup, game.shurikenCollisionGroup, game.enemyCollisionGroup]);
  this.body.fixedRotation = true;
  this.body.static = true;
}

Wall.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Wall.prototype.constructor = Wall;

