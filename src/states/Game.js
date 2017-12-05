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
  game.input.keyboard.addKeyCapture([32,37,38,39,40]);
  this.game = game;
  var statusBarWidth = 64;
  var cx = ((game.world.width - statusBarWidth) / 2) + statusBarWidth;
  var cy = game.world.centerY;
  this.worldWidth = Config.width * 2;
  this.worldHeight = Config.width * 2;
  this.wave = 0;
  this.waveEnemies = [3, 7, 10, 15, 20];
  //this.waveEnemies = [1, 1, 1, 1, 1];
  this.waveMusic = ['videogamesong1', 'videogamesong2', 'videogamesong3', 'videogamesong4', 'videogamesong5'];
  this.game.enemyCount = this.waveEnemies[this.wave];

  game.add.tileSprite(statusBarWidth, 0, this.worldWidth - statusBarWidth, this.worldHeight, 'floor');

  for (var tx = statusBarWidth; tx < this.worldWidth; tx += 50) {
    for (var ty = 0; ty < this.worldHeight; ty += 50) {
      if (Math.random() < 0.3) {
        if (Math.random() < 0.1) {
          game.add.sprite(tx, ty, 'floor_cracked');
        } else {
          if (Math.random() < 0.4) {
            game.add.sprite(tx, ty, 'floor_gem');
          } else {
            game.add.sprite(tx, ty, 'tile_pattern');
          }
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
    var topWall = new Wall(game, wx, 2, true);
    var bottomWall = new Wall(game, wx, this.worldHeight - 5, true);
    game.add.existing(topWall);
    game.add.existing(bottomWall);
  }

  // Left and right wall
  for (var wy = 6; wy < this.worldHeight - 6; wy += 5) {
    var leftWall = new Wall(game, statusBarWidth + 3, wy, false);
    var rightWall = new Wall(game, this.worldWidth, wy, false);
    game.add.existing(leftWall);
    game.add.existing(rightWall);
  }

  game.input.gamepad.start();
  var pad1 = game.input.gamepad.pad1;
  var pad2 = game.input.gamepad.pad2;

  var padding = 30;
  game.screenBorder = new ScreenBorder(game, 0, 0, Config.width + padding, Config.height + padding, padding, statusBarWidth);

  this.game.shurikenGroup = game.add.group();
  this.game.playerGroup = game.add.group();
  this.game.statusBarGroup = game.add.group();
  this.game.heartsGroup = game.add.group();

  var statusBar = new StatusBar(this.game, this.game.heartsGroup);
  this.game.player1 = new Player(game, cx - 30, cy, 1, Keymap.PLAYER1, pad1, statusBar, true);
  this.game.player2 = new Player(game, cx + 30, cy, 0, Keymap.PLAYER2, pad2, statusBar, false);

  this.game.playerGroup.add(this.game.player1);
  this.game.playerGroup.add(this.game.player2);
  this.game.playerGroup.add(game.screenBorder);
  this.game.statusBarGroup.add(statusBar);

  game.camera.width = Config.width - statusBarWidth;
  game.camera.x -= statusBarWidth;
  game.camera.follow(game.screenBorder, Phaser.Camera.FOLLOW_LOCKON, 1.0, 1.0);

  this.game.music = game.add.audio(this.waveMusic[this.wave]);
  this.game.music.loopFull();
  spawnEnemies(this, this.waveEnemies[this.wave]);
  //player1.body.collides(game.shurikenCollisionGroup, assignDamage, this);
  //player2.body.collides(game.shurikenCollisionGroup, assignDamage, this);

  game.world.setBounds(0, 0, this.worldWidth, this.worldHeight);


};

exports.update = function() {
  if (this.game.enemyCount === 0) {
    if (this.wave === 4) {
      this.game.music.stop();

      this.game.state.start('End');
      //var endgamesong = this.game.add.audio('endgamesong');
      //endgamesong.loopFull();
    } else {
      this.wave++;
      if (this.wave > 0) {
        this.game.player1.boomerangShurikens = true;
        this.game.player2.boomerangShurikens = true;
      }
      if (this.wave > 1) {
        this.game.player1.starShurikens = true;
        this.game.player2.starShurikens = true;
      }
      if (this.wave > 2) {
        this.game.player1.explodingShurikens = true;
        this.game.player2.explodingShurikens = true;
      }
      spawnEnemies(this, this.waveEnemies[this.wave]);
      this.game.enemyCount = this.waveEnemies[this.wave];
      this.game.music.stop();
      this.game.music = this.game.add.audio(this.waveMusic[this.wave]);
      this.game.music.loopFull();
    }
  }
};

exports.render = function() {
  //this.game.debug.text(this.game.time.suggestedFps, 32, 32);
};


function spawnEnemies(_this, n) {
  for (var i = 0; i < n; i++) {
    // 0-0.25: top, 0.25 - 0.5: right, 0.5 - 0.75: bottom, 0.75 - 1.0: left
    var wall = Math.random();
    var x = 0;
    var y = 0;
    if (wall < 0.25) { // top
      x = (Math.random() * (_this.worldWidth - 94)) + 64;
      y = 30;
    } else if (wall < 0.5) { // right
      y = Math.random() * (_this.worldHeight - 60);
      x = _this.worldWidth - 30;
    } else if (wall < 0.75) { // bottom
      x = (Math.random() * (_this.worldWidth - 94)) + 64;
      y = _this.worldHeight - 30;
    } else { //left
      y = Math.random() * (_this.worldHeight - 60);
      x = 94;
    }
    var enemy = new Enemy(_this.game, x, y, 'enemy', [_this.game.player1, _this.game.player2]);
    _this.game.playerGroup.add(enemy);
  }
}

