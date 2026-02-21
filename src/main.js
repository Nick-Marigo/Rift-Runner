// Code: Endless Runner
// Name: Nick Marigo
// Date: 2/2/2026

//Font: https://www.dafont.com/ethnocentric.font

//Music: https://opengameart.org/content/oves-essential-game-audio-pack-collection-160-files-updated

//Sound effects:
//Portal: https://opengameart.org/content/portal-sound
//UI: https://opengameart.org/content/4-sci-fi-menu-sounds
//Arrow Warning: https://opengameart.org/content/short-alarm
//Death sounds: https://opengameart.org/content/5-hit-sounds-dying



"use strict"

let config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { 
                x: 0,
                y: 500 
            },
            debug: true
        }
    },
    scene: [ Menu, Play, UIScene]
}

let game = new Phaser.Game(config)

let cursors = null
let { height, width } = game.config

let currentAngle = 0;
let cameraAngles = {
    up: 0,
    right: 90,
    down: 180,
    left: 270
};
let flip = false;