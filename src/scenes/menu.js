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
        this.load.image('textBox', 'TextBox.png');

        //Loading bitmap Font
        this.load.bitmapFont('er_font', 'Font/ERFont.png', 'Font/ERFont.xml');

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
        this.textBox =this.add.image(100, 100, 'textBox').setOrigin(0).setVisible(false).setDepth(50);

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

        //Controls Text
        this.controlsText = this.add.bitmapText(width / 2, height - 200, "er_font", "Press E for Controls", 24).setOrigin(0.5);
        this.controlsTextOn = false;
        this.tweens.add({
            targets: this.controlsText,
            alpha: 0,
            duration: 600,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        this.movementText = this.add.bitmapText(width / 2, 150, "er_font", "Press D to go forward in\n the current direction.", 24).setOrigin(0.5).setVisible(false).setDepth(51);
        this.movementText2 = this.add.bitmapText(width / 2, 250, "er_font", "Press S to go backward in\n the current direction.", 24).setOrigin(0.5).setVisible(false).setDepth(51);
        this.jumpText = this.add.bitmapText(width / 2, 350, "er_font", "Press SPACE to Jump", 24).setOrigin(0.5).setVisible(false).setDepth(51);
        this.slideText = this.add.bitmapText(width / 2, 400, "er_font", "Press and Hold S to Slide", 24).setOrigin(0.5).setVisible(false).setDepth(51);
        this.arrowInfo = this.add.bitmapText(width / 2, 500, "er_font", "Before each portal a BLUE arrow\n and a PURPLE arrow will appear\n indicating the new gravity and\n direction. Pay attention to them!", 24).setOrigin(0.5).setVisible(false).setDepth(51);
        this.gArrow = this.add.image(width / 2 - 100, 625, 'gravityArrow').setScale(2).setVisible(false).setDepth(51);
        this.dArrow = this.add.image(width / 2 + 100, 625, 'directionArrow').setScale(2).setVisible(false).setDepth(51);
        this.gArrowText = this.add.bitmapText(width / 2 - 100, 725, "er_font", "Gravity", 24).setOrigin(0.5).setVisible(false).setDepth(51);
        this.dArrowText = this.add.bitmapText(width / 2 + 100, 725, "er_font", "Direction", 24).setOrigin(0.5).setVisible(false).setDepth(51);
        this.exitControlsText = this.add.bitmapText(width / 2, 775, "er_font", "Press E to Exit Controls", 24).setOrigin(0.5).setVisible(false).setDepth(51);
        this.tweens.add({
            targets: this.exitControlsText,
            alpha: 0,
            duration: 600,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        //Credits Text
        this.creditsText = this.add.bitmapText(width / 2, height - 90, "er_font", "Press C for Credits", 24).setOrigin(0.5);
        this.creditsTextOn = false;
        this.tweens.add({
            targets: this.creditsText,
            alpha: 0,
            duration: 600,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        //Font: https://www.dafont.com/ethnocentric.font

//Music: https://opengameart.org/content/oves-essential-game-audio-pack-collection-160-files-updated

//Sound effects:
//Portal: https://opengameart.org/content/portal-sound
//UI: https://opengameart.org/content/4-sci-fi-menu-sounds
//Arrow Warning: https://opengameart.org/content/short-alarm
//Death sounds: https://opengameart.org/content/5-hit-sounds-dying

        this.musicCredit = this.add.bitmapText(width / 2, 125, "er_font", "Music: Ove Melaa - Heaven Sings & Super Ninja Assasin\nhttps://opengameart.org/content/oves-essential-game-audio-pack-collection-160-files-updated", 16).setOrigin(0.5).setVisible(false);
        this.soundCredit1 = this.add.bitmapText(width / 2, 300, "er_font", "Portal Sound Effect by Ignas:\n https://opengameart.org/content/portal-sound", 16).setOrigin(0.5).setVisible(false).setDepth(51);
        this.soundCredit2 = this.add.bitmapText(width / 2, 400, "er_font", "UI Sound Effects by Tim Mortimer:\n https://opengameart.org/content/4-sci-fi-menu-sounds", 16).setOrigin(0.5).setVisible(false).setDepth(51);
        this.soundCredit3 = this.add.bitmapText(width / 2, 500, "er_font", "Arrow Warning Sound Effect by yd:\n https://opengameart.org/content/short-alarm", 16).setOrigin(0.5).setVisible(false).setDepth(51);
        this.soundCredit4 = this.add.bitmapText(width / 2, 600, "er_font", "Death Sound Effects by TinyWorlds:\n https://opengameart.org/content/5-hit-sounds-dying", 16).setOrigin(0.5).setVisible(false).setDepth(51);
        this.exitCreditText = this.add.bitmapText(width / 2, 775, "er_font", "Press C to Exit Credits", 24).setOrigin(0.5).setVisible(false).setDepth(51);
        this.tweens.add({
            targets: this.exitCreditText,
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
            if(!this.controlsTextOn) {
                this.controlsTextOn = true;
                this.textBox.setVisible(true);
                this.movementText.setVisible(true);
                this.movementText2.setVisible(true);
                this.jumpText.setVisible(true);
                this.slideText.setVisible(true);
                this.arrowInfo.setVisible(true);
                this.exitControlsText.setVisible(true);
                this.gArrow.setVisible(true);
                this.dArrow.setVisible(true);
                this.gArrowText.setVisible(true);
                this.dArrowText.setVisible(true);
            } else {
                this.controlsTextOn = false;
                this.textBox.setVisible(false);
                this.movementText.setVisible(false);
                this.movementText2.setVisible(false);
                this.jumpText.setVisible(false);
                this.slideText.setVisible(false);
                this.arrowInfo.setVisible(false);
                this.exitControlsText.setVisible(false);
                this.gArrow.setVisible(false);
                this.dArrow.setVisible(false);
                this.gArrowText.setVisible(false);
                this.dArrowText.setVisible(false);
            }
        });

        this.input.keyboard.on('keydown-C', () => {
            if(!this.creditsTextOn) { 
                this.creditsTextOn = true;
                this.textBox.setVisible(true);
                this.musicCredit.setVisible(true);
                this.soundCredit1.setVisible(true);
                this.soundCredit2.setVisible(true);
                this.soundCredit3.setVisible(true);
                this.soundCredit4.setVisible(true);
                this.exitCreditText.setVisible(true);
            } else {
                this.creditsTextOn = false;
                this.textBox.setVisible(false);
                this.musicCredit.setVisible(false);
                this.soundCredit1.setVisible(false);
                this.soundCredit2.setVisible(false);
                this.soundCredit3.setVisible(false);
                this.soundCredit4.setVisible(false);
                this.exitCreditText.setVisible(false);
            }
        });

    }
}