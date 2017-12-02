/*
 * Player
 * ====
 *
 */

'use strict';

var Bullet = require('../objects/Bullet');

function Player(game, x, y, sprite, Keymap, gamepad) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;
  this.body.mass = 100;
  this.body.setCollisionGroup(game.playerCollisionGroup);
  this.body.collides([game.bulletCollisionGroup, game.playerCollisionGroup]);
  this.body.collideWorldBounds = true;
  this.game = game;
  this.gamepad = gamepad;
  this.speed = 500;
  this.anchor.set(0.5);
  this.range = 400;
  this.rateOfFire = 10;
  this.timeSinceLastFire = 0;
  this.Keymap = Keymap;
  this.accelleration = 30;
  this.decelleration = 15;
  this.maxSpeed = 500;
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Player.prototype.constructor = Player;

Player.prototype.update = function () {
  this.timeSinceLastFire++;

  var xDir = 0;
  var yDir = 0;
  if (this.game.input.keyboard.isDown(this.Keymap.UP)) yDir -= 1;
  if (this.game.input.keyboard.isDown(this.Keymap.DOWN)) yDir += 1;
  if (this.game.input.keyboard.isDown(this.Keymap.LEFT)) xDir -= 1;
  if (this.game.input.keyboard.isDown(this.Keymap.RIGHT)) xDir += 1;

  var xFireDir = 0;
  var yFireDir = 0;
  if (this.game.input.keyboard.isDown(this.Keymap.FIRE_UP)) yFireDir -= 1;
  if (this.game.input.keyboard.isDown(this.Keymap.FIRE_DOWN)) yFireDir += 1;
  if (this.game.input.keyboard.isDown(this.Keymap.FIRE_LEFT)) xFireDir -=1;
  if (this.game.input.keyboard.isDown(this.Keymap.FIRE_RIGHT)) xFireDir += 1;


  if (this.gamepad.connected) {
    var leftStickX = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    var leftStickY = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);

    if (leftStickX) xDir = leftStickX;
    if (leftStickY) yDir = leftStickY;

    var rightStickX = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
    var rightStickY = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

    if (rightStickX) xFireDir = (rightStickX > 0) ? 1 : -1;
    if (rightStickY) yFireDir = (rightStickY > 0) ? 1 : -1;
  }

  if (xFireDir !== 0 || yFireDir !== 0) {
    fire(this, this.x, this.y, xFireDir, yFireDir);
  }

  move(this, xDir, yDir);
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
    if (xSpeed !== 0) xStart += ((xSpeed > 0) ? 50 : -50);
    var yStart = y;
    if (ySpeed !==0) yStart += ((ySpeed > 0) ? 50 : -50);

    var bullet = new Bullet(player.game, xStart, yStart, xSpeed, ySpeed, player.range);
    player.game.add.existing(bullet);
    player.timeSinceLastFire = 0;
  }
}
