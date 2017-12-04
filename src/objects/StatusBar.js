/*
 * Shuriken
 * ====
 *
 */

'use strict';

function StatusBar(game, heartsGroup) {
  Phaser.Sprite.call(this, game, 0, 0, 'status_bar');
  this.fixedToCamera = true;

  this.playerOneHearts = [];
  this.playerTwoHearts = [];
  for (var i = 0; i < 5; i++) {
    var heart = game.add.sprite(5 + i * 10, 85, 'hearts');
    heart.fixedToCamera = true;
    this.playerOneHearts[i] = heart;
    heartsGroup.add(heart);
  }

  for (var j = 0; j < 5; j++) {
    var heart2 = game.add.sprite(5 + j * 10, 160, 'hearts');
    heart2.fixedToCamera = true;
    this.playerTwoHearts[j] = heart2;
    heartsGroup.add(heart2);
  }
}

StatusBar.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = StatusBar.prototype.constructor = StatusBar;

StatusBar.prototype.playerHitPoints = function (playerOne, hitPoints) {
  var playerHearts = (playerOne) ? this.playerOneHearts : this.playerTwoHearts;
  for (var i = 0; i < 5; i++) {
    if (i < hitPoints) {
      playerHearts[i].frame = 0;
    } else {
      playerHearts[i].frame = 2;
    }
  }
};

StatusBar.prototype.update = function (game) {
};


