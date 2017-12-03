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
    key: 'henri_100x100',
    type: 'image'
  },
  {
    key: 'wayne_100x100',
    type: 'image'
  },
  {
    key: 'background_tile',
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
  }
  ];
