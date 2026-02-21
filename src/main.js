// Name: Nick Marigo
// Project: Rift Runner
// Date: 2/2/2026

//Citations:
//Font: https://www.dafont.com/ethnocentric.font
//Music: https://opengameart.org/content/oves-essential-game-audio-pack-collection-160-files-updated
//Sound effects:
//Portal: https://opengameart.org/content/portal-sound
//UI: https://opengameart.org/content/4-sci-fi-menu-sounds
//Arrow Warning: https://opengameart.org/content/short-alarm
//Death sounds: https://opengameart.org/content/5-hit-sounds-dying

/*
Use multiple Scene classes (dictated by your game's style) (1) Done
Properly transition between Scenes and allow the player to restart w/out having to reload the page (1) Done
Include in-game instructions using text or other means (e.g., tooltips, tutorial, diagram, etc.) (1) Done
Have some form of player input/control appropriate to your game design (1) Done
Include one or more animated characters that use a texture atlas/sprite sheet* (1) Done
Simulate scrolling with a tileSprite (or equivalent means) (1) Done
Implement proper collision detection (via Arcade Physics or a custom routine) (1) Done
Have looping background music* (1) Done
Use a minimum of four sound effects for key mechanics, UI, and/or significant events appropriate to your game design (1) Done
Use randomness to generate escalating challenge, e.g. terrain, pickups, etc. (1) Done
Include some metric of accomplishment that a player can improve over time, e.g., score, survival time, etc. (1) Done
Be theoretically endless (1) Done
Be playable for at least 15 seconds for a new player of low to moderate skill (1) Done
Run without significant crashes or errors (1) Done
Include in-game credits for all roles, assets, music, etc. (1) Done
*/

//Creative Tilt:
//Technically interesting: I originally learned how to manipulate gravity with a bunch of math which can be see at this repository: https://github.com/Nick-Marigo/Endless-Runner After meeting with Nathan he recommended to see if I could manipulate the camera to create the illusion of graivty manipulation, which I was able to do and is a much more efficient way to achieve the same effect. To see camera manipulation in action, look at play.js in functions pickNextPhase and applyNextPhase (lines 214-244). It uses constants in the bottom of this file to store camera angles (gravity) and then a value that flips the camera (direction) using setZoom(-1, 1).


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
            debug: false
        }
    },
    scene: [ Load, Menu, Play, UIScene]
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