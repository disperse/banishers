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
  this.body.mass = 50;
  this.body.setRectangle(8, 14, 2, 2);
  this.body.setCollisionGroup(game.playerCollisionGroup);
  this.body.collides([game.bulletCollisionGroup, game.playerCollisionGroup, game.screenBorderCollisionGroup]);
  this.body.collideWorldBounds = true;
  this.game = game;
  this.faceRight = true;
  this.gamepad = gamepad;
  this.dashing = false;
  this.dashSpeed = 400;
  this.dashDirection = [0,0];
  this.rateOfDash = 0;
  this.timeSinceLastDash = this.rateOfDash;
  this.dashLength = 10;
  this.anchor.set(0.5);
  this.range = 100;
  this.rateOfFire = 20;
  this.timeSinceLastFire = this.rateOfFire;
  this.Keymap = Keymap;
  this.accelleration = 7;
  this.decelleration = 4;
  this.maxSpeed = 125;
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Player.prototype.constructor = Player;

Player.prototype.update = function () {
  this.timeSinceLastFire++;
  this.timeSinceLastDash++;

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

  if ((this.game.input.keyboard.isDown(this.Keymap.DASH) ||
      this.gamepad.isDown(Phaser.Gamepad.XBOX360_A)) &&
      !this.dashing &&
      this.timeSinceLastDash > this.rateOfDash) {
    this.dashing = true;

    this.timeSinceLastDash = 0;
    console.log('this.game.world.getLocalBounds');
    console.log(this.game.world.getLocalBounds());
    this.dashDirection = [xDir, yDir];
  }

  if (this.dashing && this.timeSinceLastDash > this.dashLength) {
    this.dashing = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.timeSinceLastDash = 0;
  }

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
  if (player.dashing) {
    var xSpeed = player.dashDirection[0] * player.dashSpeed;
    var ySpeed = player.dashDirection[1] * player.dashSpeed;
    /*
    if (
      (player.x + xSpeed) > (player.game.screenBorder.x + player.game.camera.width) ||
      (player.x + xSpeed) < (player.game.screenBorder.x) ||
      (player.y + ySpeed) > (player.game.screenBorder.y + player.game.camera.height) ||
      (player.y + ySpeed) < (player.game.screenBorder.y)
    ) {
      console.log(player.x + xSpeed);
      console.log(player.game.screenBorder.x + player.game.camera.width);
      console.log(player.x + xSpeed);
      console.log(player.game.screenBorder.x);
      console.log(player.y + ySpeed);
      console.log(player.game.screenBorder.y + player.game.camera.height);
      console.log(player.y + ySpeed);
      console.log(player.game.screenBorder.y);
      player.body.velocity.x = 0;
      player.body.velocity.y = 0;
      player.dashing = false;
      player.timeSinceLastDash = 0;
    } else {
      player.body.velocity.x = xSpeed;
      player.body.velocity.y = ySpeed;
    }
    */
    player.body.velocity.x = xSpeed;
    player.body.velocity.y = ySpeed;

  } else {
    var xDeceleration = Math.min(player.decelleration, Math.abs(player.body.velocity.x));
    if (player.body.velocity.x < 0) xDeceleration *= -1;

    var yDeceleration = Math.min(player.decelleration, Math.abs(player.body.velocity.y));
    if (player.body.velocity.y < 0) yDeceleration *= -1;

    player.body.velocity.x = Math.max(Math.min(player.accelleration * xDir + player.body.velocity.x - xDeceleration, player.maxSpeed), -1 * player.maxSpeed);
    player.body.velocity.y = Math.max(Math.min(player.accelleration * yDir + player.body.velocity.y - yDeceleration, player.maxSpeed), -1 * player.maxSpeed);
  }
}

function fire(player, x, y, xSpeed, ySpeed) {
  if (player.timeSinceLastFire > player.rateOfFire) {
    var xStart = x;
    if (xSpeed !== 0) xStart += ((xSpeed > 0) ? 7 : -7);
    var yStart = y;
    if (ySpeed !==0) yStart += ((ySpeed > 0) ? 12 : -12);

    var bullet = new Bullet(player.game, xStart, yStart, xSpeed, ySpeed, player.range);
    player.game.add.existing(bullet);
    player.timeSinceLastFire = 0;
  }
}
