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

exports.create = function (game) {
  this.game = game;
  var cx = game.world.centerX;
  var cy = game.world.centerY;
  this.worldWidth = Config.width * 2;
  this.worldHeight = Config.width * 2;

  var music = game.add.audio('videogamesong1');
  music.loopFull();

  game.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
  game.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, 'floor');

  for (var tx = 0; tx < this.worldWidth; tx += 50) {
    for (var ty = 0; ty < this.worldHeight; ty += 50) {
      if (Math.random() < 0.05) {
        game.add.sprite(tx, ty, 'floor_cracked');
      } else {
        game.add.sprite(tx, ty, 'floor_gem');
      }
    }
  }

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.2;

  game.screenBorderCollisionGroup = game.physics.p2.createCollisionGroup();
  game.playerCollisionGroup = game.physics.p2.createCollisionGroup();
  game.bulletCollisionGroup = game.physics.p2.createCollisionGroup();
  game.physics.p2.updateBoundsCollisionGroup();

  game.input.gamepad.start();
  var pad1 = game.input.gamepad.pad1;
  var pad2 = game.input.gamepad.pad2;

  var padding = 30;
  game.screenBorder = new ScreenBorder(game, 0, 0, Config.width + padding, Config.height + padding, padding);
  var player1 = new Player(game, cx - 30, cy, 'green_ninja', Keymap.PLAYER1, pad1);
  var player2 = new Player(game, cx + 30, cy, 'blue_ninja', Keymap.PLAYER2, pad2);

  var drawGroup = game.add.group();

  drawGroup.add(player1);
  drawGroup.add(player2);
  drawGroup.add(game.screenBorder);

  game.camera.follow(game.screenBorder, Phaser.Camera.FOLLOW_LOCKON, 1.0, 1.0);
};

exports.update = function() {

};

exports.render = function() {
  //this.game.debug.text(this.game.time.suggestedFps, 32, 32);
};

//function calculate
