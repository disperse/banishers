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
    key: 'SHURIKA',
    type: 'image'
  },
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
    key: '54321',
    type: 'spritesheet',
    frameMax: 5,
    frameWidth: 14,
    frameHeight: 20
  },
  {
    key: 'player',
    type: 'spritesheet',
    frameMax: 7,
    frameWidth: 14,
    frameHeight: 20
  },
  {
    key: 'smoke',
    type: 'spritesheet',
    frameMax: 11,
    frameWidth: 34,
    frameHeight: 34
  },
  {
    key: 'explosion',
    type: 'spritesheet',
    frameMax: 11,
    frameWidth: 10,
    frameHeight: 10
  },
  {
    key: 'hearts',
    type: 'spritesheet',
    frameMax: 3,
    frameWidth: 10,
    frameHeight: 10
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
    key: 'tile_pattern',
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
    key: 'enemy_pieces',
    type: 'image'
  },
  {
    key: 'videogamesong1',
    type: 'audio',
    urls: ['videogamesong1.ogg', 'videogamesong1.mp3'],
    autoDecode: true
  },
  {
    key: 'videogamesong2',
    type: 'audio',
    urls: ['videogamesong2.ogg', 'videogamesong2.mp3'],
    autoDecode: true
  },
  {
    key: 'videogamesong3',
    type: 'audio',
    urls: ['videogamesong3.ogg', 'videogamesong3.mp3'],
    autoDecode: true
  },
  {
    key: 'videogamesong4',
    type: 'audio',
    urls: ['videogamesong4.ogg', 'videogamesong4.mp3'],
    autoDecode: true
  },
  {
    key: 'videogamesong5',
    type: 'audio',
    urls: ['videogamesong5.ogg', 'videogamesong5.mp3'],
    autoDecode: true
  },
  {
    key: 'endgamesong',
    type: 'audio',
    urls: ['endgamesong.ogg', 'endgamesong.mp3'],
    autoDecode: true
  },
  {
    key: 'throw',
    type: 'audio',
    urls: ['throw.wav']
  },
  {
    key: 'dash',
    type: 'audio',
    urls: ['dash.wav']
  },
  {
    key: 'player_hurt',
    type: 'audio',
    urls: ['player_hurt.wav']
  },
  {
    key: 'enemy_hurt',
    type: 'audio',
    urls: ['enemy_hurt.wav']
  },
  {
    key: 'enemy_death',
    type: 'audio',
    urls: ['enemy_death.wav']
  },
  {
    key: 'player_death',
    type: 'audio',
    urls: ['player_death.wav']
  },
  {
    key: 'explosion',
    type: 'audio',
    urls: ['explosion.wav']
  }
];
