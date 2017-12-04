/*
 * Smoke
 * ====
 *
 */

'use strict';

function Smoke(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'smoke');
  this.animations.add('smoke', [0,1,2,3,4,5,6,7,8,9,10], 5, false);
  this.animations.play('smoke');
  this.alpha = 0.5;
  this.maxAge = 140;
  this.age = 0;
}

Smoke.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Smoke.prototype.constructor = Smoke;

Smoke.prototype.update = function () {
  this.age++;
  if (this.age > this.maxAge) this.destroy();
};

