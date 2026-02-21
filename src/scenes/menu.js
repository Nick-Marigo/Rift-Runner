class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    preload() {

        this.load.path = "./assets/";

        //Loading obstacles and ground
        this.load.image('groundPlatform', 'Ground.png');
        this.load.image('spikeOne', '/obstacles/SpikeOne.png');
        this.load.image('spikeFour', '/obstacles/SpikeFour.png');
        this.load.image('spikeEight', '/obstacles/SpikeEight.png');
        this.load.image('platform', '/obstacles/Platform.png');
        this.load.image('platformLong', '/obstacles/PlatformLong.png');

        //Loading player, portal, and arrow spritesheets
        this.load.spritesheet('gravityArrow', 'GravityArrow.png', {
            frameWidth: 48,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('portal', 'Portal.png', {
            frameWidth: 48,
            frameHeight: 128,
            startFrame: 0,
            endFrame: 3
        });
        this.load.spritesheet('directionArrow', 'DirectionArrow.png', {
            frameWidth: 48,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('playerIdle', '/Runner/RunnerIdle.png', {
            frameWidth: 48,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 3
        });
        this.load.spritesheet('playerRun', '/Runner/RunnerRunning.png', {
            frameWidth: 48,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 3
        });
        this.load.spritesheet('playerSlide', '/Runner/RunnerSlide.png', {
            frameWidth: 64,
            frameHeight: 24,
            startFrame: 0,
            endFrame: 2
        });

        //Loading UI assets (Two arrow spritesheets are above)
        this.load.image('UIBorder', '/UIBorder.png');

        //Loading background layers
        this.load.image('background', 'Background.png');
        this.load.image('backgroundMiddle', 'BackgroundMiddle.png');
        this.load.image('backgroundFront', 'BackgroundFront.png');

        //Loading menu assets
        this.load.image('menuBackground', 'Menu.png');

        //Loading bitmap Font
        this.load.bitmapFont('er_font', 'font/ER-Font.png', 'font/ER-Font.xml');

        //Loading audio
        this.load.audio('menuMusic', '/Sound/Ove Melaa - Heaven Sings.mp3');
        this.load.audio('gameMusic', '/Sound/Ove Melaa - Super Ninja Assasin.mp3');
        this.load.audio('portalSound', '/Sound/porta.ogg');
        this.load.audio('uiSound', '/Sound/Flashpoint001d.flac');
        this.load.audio('arrowSound', '/Sound/alarm.ogg');
        this.load.audio('deathSound', '/Sound/die1.ogg');

    }

    create() {

        //Creating all animations
        this.anims.create({
            key: 'portalanims',
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 3}),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 3}),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'player-slide',
            frames: this.anims.generateFrameNumbers('playerSlide', { start: 0, end: 2}),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'gravityArrowBlink',
            frames: this.anims.generateFrameNumbers('gravityArrow', {start: 0, end: 1}),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'directionArrowBlink',
            frames: this.anims.generateFrameNumbers('directionArrow', {start: 0, end: 1}),
            frameRate: 6,
            repeat: -1
        });

        this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
        this.menuMusic.play();

        this.add.image(0, 0, 'menuBackground').setOrigin(0);

        this.add.sprite(width - 150, height / 2 - 100, 'portal').play('portalanims').setScale(3);
        this.add.sprite(width / 6, height / 2 - 100, 'playerIdle').play('player-idle').setScale(3);
        this.add.image(width / 6, height / 2, 'platform').setScale(2).setOrigin(0.5, 0);

        this.title = this.add.bitmapText(width / 2, height - 800, "er_font", "Rift Runner", 80).setOrigin(0.5);

        this.startText = this.add.bitmapText(width / 2, height - 300, "er_font", "Press SPACE to Start", 32).setOrigin(0.5);

        this.tweens.add({
            targets: this.startText,
            alpha: 0,
            duration: 600,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        this.controlsText = this.add.bitmapText(width / 2, height - 200, "er_font", "Press E for Controls", 24).setOrigin(0.5);

        this.tweens.add({
            targets: this.controlsText,
            alpha: 0,
            duration: 600,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        this.creditsText = this.add.bitmapText(width / 2, height - 90, "er_font", "Press C for Credits", 24).setOrigin(0.5);

        this.tweens.add({
            targets: this.creditsText,
            alpha: 0,
            duration: 600,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.menuMusic.stop();
            this.scene.start('Play');
        })

        this.input.keyboard.on('keydown-E', () => {

        });

        this.input.keyboard.on('keydown-C', () => {

        });

    }
}