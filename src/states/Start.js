/*
 * Start state
 * ===============
 *
 */

'use strict';

exports.create = function (game) {
  game.add.sprite(0, 0, 'SHURIKA');
  this.game.endgamesong = game.add.audio('endgamesong');
  this.game.endgamesong.loopFull();
};

exports.update = function(game) {
  this.game.input.keyboard.onDownCallback = function() { return startGame(game); }
};

function startGame(game) {
  game.input.keyboard.onDownCallback = null;
  game.endgamesong.stop();
  game.state.start('Game');
}
