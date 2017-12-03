/*
 * Bullet
 * ====
 *
 */

'use strict';

function ScreenBorder(game, x, y, width, height, depth) {
  Phaser.Sprite.call(this, game, x, y, null);
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;
  this.body.addPolygon(
    {
      optimalDecomp: false,
      skipSimpleCheck: false,
      removeCollinearPoints: false
    },
    [
      [x,y],
      [x+width,y],
      [x+width,y+depth],
      [x+depth,y+depth],
      [x+depth,y+height-depth],
      [x+width-depth,y+height-depth],
      [x+width-depth,y+depth+1],
      [x+width,y+depth+1],
      [x+width,y+height],
      [x,y+height],
      [x,y]
    ]);
  this.body.debug = true;
  //this.anchor.set(0.5);
  this.body.mass = 1;
  this.body.setCollisionGroup(game.screenBorderCollisionGroup);
  this.body.collides([game.playerCollisionGroup]);
  this.body.collideWorldBounds = false;
  this.body.damping = 1;
}
ScreenBorder.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = ScreenBorder.prototype.constructor = ScreenBorder;

ScreenBorder.prototype.update = function () {};
