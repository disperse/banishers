/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

'use strict';

var Player = require('../objects/Player');
var Keymap = require('../util/Keymap');

exports.create = function (game) {
  this.game = game;
  var cx = game.world.centerX;
  var cy = game.world.centerY;
  game.add.tileSprite(0, 0, 800, 600, 'background_tile');
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.7;

  game.playerCollisionGroup = game.physics.p2.createCollisionGroup();
  game.bulletCollisionGroup = game.physics.p2.createCollisionGroup();
  game.physics.p2.updateBoundsCollisionGroup();

  game.input.gamepad.start();
  var pad1 = game.input.gamepad.pad1;
  var pad2 = game.input.gamepad.pad2;

  var player1 = new Player(game, cx - 150, cy, 'wayne_100x100', Keymap.PLAYER1, pad1);
  var player2 = new Player(game, cx + 150, cy, 'henri_100x100', Keymap.PLAYER2, pad2);

  game.add.existing(player1);
  game.add.existing(player2);
};

exports.render = function() {
  this.game.debug.text(this.game.time.suggestedFps, 32, 32);
};
