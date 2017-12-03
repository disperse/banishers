/*
 * `assets` module
 * ===============
 *
 * Declares static asset packs to be loaded using the `Phaser.Loader#pack`
 * method. Use this module to declare game assets.
 */

'use strict';

//  -- Splash screen assets used by the Preloader.
exports.preloaderAssets = [{
  key: 'splash-screen',
  type: 'image'
}, {
  key: 'progress-bar',
  type: 'image'
}];

//  -- General assets used throughout the game.
exports.gameAssets = [
  {
    key: 'player1',
    type: 'image'
  },
  {
    key: 'player2',
    type: 'image'
  },
  {
    key: 'blue_ninja',
    type: 'image'
  },
  {
    key: 'green_ninja',
    type: 'image'
  },
  {
    key: 'shuriken1',
    type: 'image'
  },
  {
    key: 'shuriken2',
    type: 'image'
  },
  {
    key: 'shuriken3',
    type: 'image'
  },
  {
    key: 'shuriken4',
    type: 'image'
  },
  {
    key: 'shuriken',
    type: 'spritesheet',
    url: 'shuriken_spritesheet_2.png',
    frameMax: 4,
    frameWidth: 7,
    frameHeight: 7
  },
  {
    key: 'wall',
    type: 'spritesheet',
    url: 'wall_spritesheet.png',
    frameMax: 3,
    frameWidth: 5,
    frameHeight: 5
  },
  {
    key: 'enemy',
    type: 'image'
  },
  {
    key: 'floor',
    type: 'image'
  },
  {
    key: 'floor_gem',
    type: 'image'
  },
  {
    key: 'floor_cracked',
    type: 'image'
  },
  {
    key: 'status_bar',
    type: 'image'
  },
  {
    key: 'bullet_16x16',
    type: 'image'
  },
  {
    key: 'videogamesong1',
    type: 'audio',
    urls: ['videogamesong1.ogg', 'videogamesong1.mp3'],
    autoDecode: true
  },
  {
    key: 'endgamesong',
    type: 'audio',
    urls: ['endgamesong.ogg', 'endgamesong.mp3'],
    autoDecode: true
  }
  ];
