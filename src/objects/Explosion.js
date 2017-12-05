/*
 * Explosion
 * ====
 *
 */

'use strict';

function Explosion(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'explosion');
  this.animations.add('smoke', [0,1,2,3,4,5,6,7,8,9,10], 5, false);
  this.animations.play('smoke');
  this.alpha = 0.5;
  this.maxAge = 140;
  this.age = 0;
}

Explosion.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Explosion.prototype.constructor = Explosion;

Explosion.prototype.update = function () {
  this.age++;
  if (this.age > this.maxAge) this.destroy();
};

