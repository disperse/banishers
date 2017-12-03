/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

'use strict';

var Player = require('../objects/Player');
var ScreenBorder = require('../objects/ScreenBorder');
var Keymap = require('../util/Keymap');
var Config = require('../config.js');
var StatusBar = require('../objects/StatusBar');
var Wall = require('../objects/Wall');
var Enemy = require('../objects/Enemy');

exports.create = function (game) {
  this.game = game;
  var statusBarWidth = 64;
  var cx = ((game.world.width - statusBarWidth) / 2) + statusBarWidth;
  var cy = game.world.centerY;
  this.worldWidth = Config.width * 2;
  this.worldHeight = Config.width * 2;

  var music = game.add.audio('endgamesong');
  music.loopFull();

  game.add.tileSprite(statusBarWidth, 0, this.worldWidth - statusBarWidth, this.worldHeight, 'floor');

  for (var tx = statusBarWidth; tx < this.worldWidth; tx += 50) {
    for (var ty = 0; ty < this.worldHeight; ty += 50) {
      if (Math.random() < 0.3) {
        if (Math.random() < 0.5) {
          game.add.sprite(tx, ty, 'floor_cracked');
        } else {
          game.add.sprite(tx, ty, 'floor_gem');
        }
      }
    }
  }

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.restitution = 0.2;

  game.screenBorderCollisionGroup = game.physics.p2.createCollisionGroup();
  game.wallCollisionGroup = game.physics.p2.createCollisionGroup();
  game.playerCollisionGroup = game.physics.p2.createCollisionGroup();
  game.enemyCollisionGroup = game.physics.p2.createCollisionGroup();
  game.shurikenCollisionGroup = game.physics.p2.createCollisionGroup();
  game.physics.p2.updateBoundsCollisionGroup();

  // Top and bottom wall
  for (var wx = statusBarWidth; wx < this.worldWidth; wx += 5) {
    var topWall = new Wall(game, wx, 2);
    var bottomWall = new Wall(game, wx, this.worldHeight - 5);
    game.add.existing(topWall);
    game.add.existing(bottomWall);
  }

  // Left and right wall
  for (var wy = 6; wy < this.worldHeight - 6; wy += 5) {
    var leftWall = new Wall(game, statusBarWidth + 3, wy);
    var rightWall = new Wall(game, this.worldWidth, wy);
    game.add.existing(leftWall);
    game.add.existing(rightWall);
  }

  game.input.gamepad.start();
  var pad1 = game.input.gamepad.pad1;
  var pad2 = game.input.gamepad.pad2;

  var padding = 30;
  game.screenBorder = new ScreenBorder(game, 0, 0, Config.width, Config.height, padding, statusBarWidth);
  var player1 = new Player(game, cx - 30, cy, 'green_ninja', Keymap.PLAYER1, pad1);
  var player2 = new Player(game, cx + 30, cy, 'blue_ninja', Keymap.PLAYER2, pad2);
  var enemy = new Enemy(game, cx + 30, cy + 30, 'enemy', [player1, player2]);
  var statusBar = new StatusBar(game);

  this.game.shurikenGroup = game.add.group();
  this.game.playerGroup = game.add.group();
  this.game.statusBarGroup = game.add.group();

  this.game.playerGroup.add(player1);
  this.game.playerGroup.add(player2);
  this.game.playerGroup.add(game.screenBorder);
  this.game.playerGroup.add(enemy);
  this.game.statusBarGroup.add(statusBar);

  game.camera.width = Config.width - statusBarWidth;
  game.camera.x -= statusBarWidth;
  game.camera.follow(game.screenBorder, Phaser.Camera.FOLLOW_LOCKON, 1.0, 1.0);

  //player1.body.collides(game.shurikenCollisionGroup, assignDamage, this);
  //player2.body.collides(game.shurikenCollisionGroup, assignDamage, this);

  game.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
};

exports.update = function() {

};

exports.render = function() {
  //this.game.debug.text(this.game.time.suggestedFps, 32, 32);
};

