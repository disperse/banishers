/*
 * Bullet
 * ====
 *
 */

'use strict';

function Bullet(game, x, y, xSpeed, ySpeed, range) {
  Phaser.Sprite.call(this, game, x, y, 'shuriken');
  this.animations.add('thrown', [0,1,2,3], 5, true);
  this.animations.play('thrown');
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;
  this.anchor.set(0.5);
  var baseSpeed = 100;
  this.body.velocity.x = xSpeed * baseSpeed;
  this.body.velocity.y = ySpeed * baseSpeed;
  this.body.mass = 10;
  this.body.setCollisionGroup(game.bulletCollisionGroup);
  this.body.collides([game.playerCollisionGroup]);
  this.body.collideWorldBounds = true;
  this.lastX = x;
  this.lastY = y;
  this.distanceTravelled = 0;
  this.range = range;
  this.maxLife = 600;
  this.age = 0;
}
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
  this.age++;
  this.distanceTravelled += Math.sqrt(Math.pow((this.x - this.lastX), 2) + Math.pow((this.y - this.lastY), 2));
  this.lastX = this.x;
  this.lastY = this.y;
  if (this.distanceTravelled > this.range || this.age > this.maxLife) {
    this.destroy();
  }
};
