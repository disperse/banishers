/*
 * Enemy
 * ====
 *
 */

'use strict';

var Shuriken = require('../objects/Shuriken');

function Enemy(game, x, y, sprite, targets) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;
  this.body.mass = 50;
  this.body.setRectangle(8, 14, 2, 2);
  this.body.setCollisionGroup(game.enemyCollisionGroup);
  this.body.collides([game.shurikenCollisionGroup, game.playerCollisionGroup, game.wallCollisionGroup]);
  this.body.collideWorldBounds = true;
  this.game = game;
  this.faceRight = true;
  this.anchor.set(0.5);
  this.range = 100;
  this.rateOfFire = 20;
  this.timeSinceLastFire = this.rateOfFire;
  this.accelleration = 7;
  this.decelleration = 4;
  this.maxSpeed = 125;
  this.hitPoints = 3;
  this.invincibilityTime = 30;
  this.invincible = false;
  this.timeSinceInvincible = this.invincibilityTime;
  this.targets = targets;

  this.body.onBeginContact.add(enemyTouch, this);
}
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Enemy.prototype.constructor = Enemy;

Enemy.prototype.takeDamage = function () {
  if (!this.invincible) {
    this.timeSinceInvincible = 0;
    this.invincible = true;
    this.hitPoints --;
    this.alpha = 0.2;
    if (this.hitPoints < 1) {
      this.destroy();
    }
  }
};

function enemyTouch(body) {
  if (!this.invincible && body !== null && body.sprite !== null && body.sprite.key === 'shuriken') {
    this.takeDamage();
  }
}

function distanceToTarget(enemy, target) {
  return(Math.sqrt(Math.pow(target.x - enemy.x, 2) + Math.pow(target.y - enemy.y, 2)));
}

Enemy.prototype.update = function () {
  this.timeSinceLastFire++;
  this.timeSinceInvincible++;

  var target = null;
  var targetDistance = 10000;
  for (var i = 1; i < this.targets.length; i++) {
    var newTargetDistance = distanceToTarget(this, this.targets[i]);
    if (newTargetDistance < targetDistance) {
      target = this.targets[i];
      targetDistance = newTargetDistance;
    }
  }

  if (this.invincible && this.timeSinceInvincible > this.invincibilityTime) {
    this.invincible = false;
    this.alpha = 1;
  }

  if (this.invincible && (this.timeSinceInvincible % 10 === 0)) {
    this.alpha = (this.alpha === 1) ? 0.2 : 1;
  }

  var xDir = 0;
  var yDir = 0;
  var xFireDir = 0;
  var yFireDir = 0;

  if (xFireDir !== 0 || yFireDir !== 0) {
    fire(this, this.x, this.y, xFireDir, yFireDir);
  }

  move(this, xDir, yDir);

  if (xDir < 0 && !this.faceRight) {
    this.scale.x *= -1;
    this.faceRight = true;
  }
  if (xDir > 0 && this.faceRight) {
    this.scale.x *= -1;
    this.faceRight = false;
  }
};

function move(player, xDir, yDir) {
  var xDeceleration = Math.min(player.decelleration, Math.abs(player.body.velocity.x));
  if (player.body.velocity.x < 0) xDeceleration *= -1;

  var yDeceleration = Math.min(player.decelleration, Math.abs(player.body.velocity.y));
  if (player.body.velocity.y < 0) yDeceleration *= -1;

  player.body.velocity.x = Math.max(Math.min(player.accelleration * xDir + player.body.velocity.x - xDeceleration, player.maxSpeed), -1 * player.maxSpeed);
  player.body.velocity.y = Math.max(Math.min(player.accelleration * yDir + player.body.velocity.y - yDeceleration, player.maxSpeed), -1 * player.maxSpeed);
}

function fire(player, x, y, xSpeed, ySpeed) {
  if (player.timeSinceLastFire > player.rateOfFire) {
    var xStart = x;
    if (xSpeed !== 0) xStart += ((xSpeed > 0) ? 10 : -10);
    var yStart = y;
    if (ySpeed !==0) yStart += ((ySpeed > 0) ? 15 : -15);

    var shuriken = new Shuriken(player.game, xStart, yStart, xSpeed, ySpeed, player.range);
    player.game.shurikenGroup.add(shuriken);
    player.timeSinceLastFire = 0;
  }
}