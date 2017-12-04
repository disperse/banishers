/*
 * Player
 * ====
 *
 */

'use strict';

var Shuriken = require('../objects/Shuriken');
var Smoke = require('../objects/Smoke');

function Player(game, x, y, spriteFrame, Keymap, gamepad, statusBar, playerOne) {
  Phaser.Sprite.call(this, game, x, y, 'player');
  this.frame = spriteFrame;
  this.spriteFrame = spriteFrame;
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;
  this.body.mass = 50;
  this.body.setRectangle(8, 14, 2, 2);
  this.body.setCollisionGroup(game.playerCollisionGroup);
  this.body.collides([game.shurikenCollisionGroup, game.playerCollisionGroup, game.screenBorderCollisionGroup, game.wallCollisionGroup, game.enemyCollisionGroup]);
  this.body.collideWorldBounds = true;
  this.game = game;
  this.faceRight = false;
  this.gamepad = gamepad;
  this.statusBar = statusBar;
  this.playerOne = playerOne;
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
  this.maxHitPoints = 5;
  this.hitPoints = this.maxHitPoints;
  this.invincibilityTime = 90;
  this.invincible = false;
  this.timeSinceInvincible = this.invincibilityTime;
  this.dead = false;
  this.deadTime = 0;
  this.playerSounds = {};
  this.playerSounds.playerHurt = game.add.audio('player_hurt');
  this.playerSounds.dash = game.add.audio('dash');
  this.playerSounds.throw = game.add.audio('throw');
  this.playerSounds.death = game.add.audio('player_death');

  this.body.onBeginContact.add(playerTouch, this);
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Player.prototype.constructor = Player;

Player.prototype.takeDamage = function () {
  if (!this.invincible && !this.dead) {
    this.timeSinceInvincible = 0;
    this.invincible = true;
    this.hitPoints --;
    this.statusBar.playerHitPoints(this.playerOne, this.hitPoints);
    this.playerSounds.playerHurt.play();
    this.alpha = 0.2;
    if (this.hitPoints < 1) {
      this.dead = true;
      this.playerSounds.death.play();
      if (this.faceRight) {
        this.faceRight = false;
        this.scale.x *= -1;
      }
      //this.body.removeFromWorld();
      this.frame = 2;
      this.deadTime = 300;
    }
  }
};

function playerTouch(body) {
  if (!this.invincible && body !== null && body.sprite !== null && (body.sprite.key === 'shuriken' || body.sprite.key === 'enemy')) {
    this.takeDamage();
  }
}

Player.prototype.update = function () {
  this.timeSinceLastFire++;
  this.timeSinceLastDash++;
  this.timeSinceInvincible++;

  if (this.dead) {
    if (this.deadTime < 0) {
      this.dead = false;
      this.hitPoints = this.maxHitPoints;
      this.statusBar.playerHitPoints(this.playerOne, this.hitPoints);
      this.frame = this.spriteFrame;
      //this.body.addToWorld();
    } else {
      // [green, blue, 5, 4, 3, 2, 1]
      this.frame = 6 - Math.floor(this.deadTime/60);
      this.deadTime--;
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
    this.playerSounds.dash.play();

    var smoke = new Smoke(this.game, this.x - 12, this.y - 20);
    this.game.add.existing(smoke);

    this.timeSinceLastDash = 0;
    this.dashDirection = [xDir, yDir];
  }

  if (this.dashing && this.timeSinceLastDash > this.dashLength) {
    this.dashing = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.timeSinceLastDash = 0;
  }

  if (!this.dead && (xFireDir !== 0 || yFireDir !== 0)) {
    fire(this, this.x, this.y, xFireDir, yFireDir);
  }

  if (! this.dead) {
    move(this, xDir, yDir);

    if (xDir < 0 && this.faceRight) {
      this.scale.x *= -1;
      this.faceRight = false;
    }
    if (xDir > 0 && !this.faceRight) {
      this.scale.x *= -1;
      this.faceRight = true;
    }
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
    if (xSpeed !== 0) xStart += ((xSpeed > 0) ? 10 : -10);
    var yStart = y;
    if (ySpeed !==0) yStart += ((ySpeed > 0) ? 15 : -15);

    player.playerSounds.throw.play();
    var shuriken = new Shuriken(player.game, xStart, yStart, xSpeed, ySpeed, player.range);
    player.game.shurikenGroup.add(shuriken);
    player.timeSinceLastFire = 0;
  }
}
