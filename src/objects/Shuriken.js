/*
 * Shuriken
 * ====
 *
 */

'use strict';

function Shuriken(game, x, y, xSpeed, ySpeed, range) {
  Phaser.Sprite.call(this, game, x, y, 'shuriken');
  this.animations.add('thrown', [0,1,2,3], 5, true);
  this.animations.play('thrown');
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;
  this.anchor.set(0.5);
  var baseSpeed = 200;
  this.body.velocity.x = xSpeed * baseSpeed;
  this.body.velocity.y = ySpeed * baseSpeed;
  this.body.mass = 50;
  this.body.setCollisionGroup(game.shurikenCollisionGroup);
  this.body.collides([game.playerCollisionGroup, game.wallCollisionGroup, game.enemyCollisionGroup]);
  this.body.collideWorldBounds = true;
  this.lastX = x;
  this.lastY = y;
  this.distanceTravelled = 0;
  this.range = range;
  this.maxLife = 600;
  this.age = 0;

  this.body.onBeginContact.add(shurikenTouch, this);
}

function shurikenTouch(body, bodyB, shapeA, shapeB, equation) {
  this.animations.stop('thrown');
  this.body.removeFromWorld();
}

Shuriken.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Shuriken.prototype.constructor = Shuriken;

Shuriken.prototype.update = function () {
  this.age++;
  this.distanceTravelled += Math.sqrt(Math.pow((this.x - this.lastX), 2) + Math.pow((this.y - this.lastY), 2));
  this.lastX = this.x;
  this.lastY = this.y;
  if (this.distanceTravelled > this.range || this.age > this.maxLife) {
    this.destroy();
  }
};
