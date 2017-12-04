/*
 * Pieces
 * ====
 *
 */

'use strict';

function Pieces(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'enemy_pieces');
  //this.maxAge = 140;
  //this.age = 0;
}

Pieces.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Pieces.prototype.constructor = Pieces;

Pieces.prototype.update = function () {
  //this.age++;
  //if (this.age > this.maxAge) this.destroy();
};

