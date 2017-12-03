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
var screenBorder;

exports.create = function (game) {
  this.game = game;
  var cx = game.world.centerX;
  var cy = game.world.centerY;
  this.worldWidth = Config.width * 2;
  this.worldHeight = Config.width * 2;

  var music = game.add.audio('videogamesong1');
  music.loopFull();

  game.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
  game.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, 'background_tile');

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.7;

  game.screenBorderCollisionGroup = game.physics.p2.createCollisionGroup();
  game.playerCollisionGroup = game.physics.p2.createCollisionGroup();
  game.bulletCollisionGroup = game.physics.p2.createCollisionGroup();
  game.physics.p2.updateBoundsCollisionGroup();

  game.input.gamepad.start();
  var pad1 = game.input.gamepad.pad1;
  var pad2 = game.input.gamepad.pad2;

  var padding = 125;
  screenBorder = new ScreenBorder(game, 0, 0, Config.width + padding, Config.height + padding, padding);
  var player1 = new Player(game, cx - 150, cy, 'wayne_100x100', Keymap.PLAYER1, pad1);
  var player2 = new Player(game, cx + 150, cy, 'henri_100x100', Keymap.PLAYER2, pad2);

  var drawGroup = game.add.group();

  drawGroup.add(player1);
  drawGroup.add(player2);
  drawGroup.add(screenBorder);

  game.camera.follow(screenBorder, Phaser.Camera.FOLLOW_LOCKON, 1.0, 1.0);
};

exports.update = function() {

};

exports.render = function() {
  this.game.debug.text(this.game.time.suggestedFps, 32, 32);
};

//function calculate
