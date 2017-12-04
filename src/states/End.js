/*
 * End state
 * ===============
 *
 */

'use strict';

exports.create = function (game) {
  game.add.sprite(0, 0, 'SHURIKA');
  var endgamesong = game.add.audio('endgamesong');
  endgamesong.loopFull();
};
