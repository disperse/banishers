/*
 * Shuriken
 * ====
 *
 */

'use strict';

var Explosion = require('../objects/Explosion');

function Shuriken(game, x, y, xSpeed, ySpeed, range, player, boomerang, star, explodes) {
  Phaser.Sprite.call(this, game, x, y, 'shuriken');
  this.animations.add('thrown', [0,1,2,3], 5, true);
  this.animations.play('thrown');
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;
  this.anchor.set(0.5);
  this.maxSpeed = (boomerang) ? 100 : 200;
  this.body.velocity.x = xSpeed * this.maxSpeed;
  this.body.velocity.y = ySpeed * this.maxSpeed;
  this.body.mass = 50;
  this.body.setCollisionGroup(game.shurikenCollisionGroup);
  this.body.collides([game.playerCollisionGroup, game.wallCollisionGroup, game.enemyCollisionGroup]);
  this.body.collideWorldBounds = true;
  this.lastX = x;
  this.lastY = y;
  this.distanceTravelled = 0;
  this.range = range;
  this.boomerangRange = this.range * 3;
  this.explodes = explodes;
  this.damage = (explodes) ? 3 : 1;
  this.maxLife = 600;
  this.age = 0;
  this.boomerang = boomerang;
  this.star = star;
  this.isStar = false;
  this.starCountDown = 30;
  this.player = player;
  this.deceleration = 5;
  this.acceleration = 5;
  this.shurikenSounds = {};
  this.shurikenSounds.explosion = game.add.audio('explosion');

  this.body.onBeginContact.add(shurikenTouch, this);
}

function shurikenTouch(body, bodyB, shapeA, shapeB, equation) {

  if (this.explodes) {
    var explosion = new Explosion(this.game, this.x - 3, this.y - 3);
    this.game.add.existing(explosion);
    this.shurikenSounds.explosion.play();
    this.visible = false;
  }
  this.animations.stop('thrown');
  this.body.removeFromWorld();
}

Shuriken.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Shuriken.prototype.constructor = Shuriken;

function star(shuriken) {
  shuriken.isStar = true;
  shuriken.body.velocity.x = 0;
  shuriken.body.velocity.y = 0;
  for (var x = -1; x < 2; x++) {
    for (var y = -1; y < 2; y++) {
      var s = new Shuriken(shuriken.player.game, shuriken.x, shuriken.y, x, y, shuriken.player.range, shuriken.player, shuriken.boomerang, false, shuriken.explodes);
      shuriken.player.game.shurikenGroup.add(s);
    }
  }
}

Shuriken.prototype.update = function () {
  this.age++;
  this.distanceTravelled += Math.sqrt(Math.pow((this.x - this.lastX), 2) + Math.pow((this.y - this.lastY), 2));
  if (this.explodes) {
    this.tint = 0xFF0000;
  }
  this.lastX = this.x;
  this.lastY = this.y;
  if (this.isStar) this.starCountDown--;
  if (this.isStar && this.starCountDown < 0) this.visible = false;
  if (this.age > this.maxLife) {
    this.destroy();
  } else {
    if (this.distanceTravelled > this.range) {
      if (this.boomerang) {
        if (this.distanceTravelled > this.boomerangRange) {
          if (this.star) {
            this.star = false;
            star(this);
          } else {
            this.animations.stop('thrown');
            this.body.removeFromWorld();
          }
        } else {
          var xDiff = this.x - this.player.x;
          var yDiff = this.y - this.player.y;
          var xDir = (xDiff < 0) ? Math.abs(xDiff/yDiff) : -1 * Math.abs(xDiff/yDiff);
          var yDir = (yDiff < 0) ? Math.abs(1/xDir) : -1 * Math.abs(1/xDir);
          this.body.velocity.x = Math.max(Math.min(this.acceleration * xDir + this.body.velocity.x, this.maxSpeed), -1 * this.maxSpeed);
          this.body.velocity.y = Math.max(Math.min(this.acceleration * yDir + this.body.velocity.y, this.maxSpeed), -1 * this.maxSpeed);
          //this.body.velocity.x = this.maxSpeed * xDir;
          //this.body.velocity.y = this.maxSpeed * yDir;
        }
        /*
        var xDeceleration = Math.min(this.deceleration, Math.abs(this.body.velocity.x));
        if (this.body.velocity.x < 0) xDeceleration *= -1;
        var yDeceleration = Math.min(this.deceleration, Math.abs(this.body.velocity.y));
        if (this.body.velocity.y < 0) yDeceleration *= -1;

        this.body.velocity.x = Math.max(Math.min(this.acceleration * xDir + this.body.velocity.x - xDeceleration, this.maxSpeed), -1 * this.maxSpeed);
        this.body.velocity.y = Math.max(Math.min(this.acceleration * yDir + this.body.velocity.y - yDeceleration, this.maxSpeed), -1 * this.maxSpeed);
        */
      } else {
        if (this.star) {
          star(this);
        } else {
          this.animations.stop('thrown');
          this.body.removeFromWorld();
        }
      }
    }
  }
};
