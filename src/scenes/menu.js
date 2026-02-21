class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    create() {

        this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.4 });
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

        this.musicCredit = this.add.bitmapText(width / 2 + 25, 175, "er_font", "Music: Ove Melaa - Heaven Sings & \nSuper Ninja Assasin\nhttps://opengameart.org/content/oves\n-essential-game-audio-pack-collection-160\n-files-updated", 16).setOrigin(0.5).setVisible(false).setDepth(51).setLeftAlign(true);
        this.soundCredit1 = this.add.bitmapText(width / 2 + 25, 265, "er_font", "Portal Sound Effect by Ignas:\n https://opengameart.org/content\n/portal-sound", 16).setOrigin(0.5).setVisible(false).setDepth(51).setLeftAlign(true);
        this.soundCredit2 = this.add.bitmapText(width / 2 + 25, 350, "er_font", "UI Sound Effects by Tim Mortimer:\n https://opengameart.org/content/4-sci-fi\n-menu-sounds", 16).setOrigin(0.5).setVisible(false).setDepth(51).setLeftAlign(true);
        this.soundCredit3 = this.add.bitmapText(width / 2 + 25, 450, "er_font", "Arrow Warning Sound Effect by yd:\n https://opengameart.org/content\n/short-alarm", 16).setOrigin(0.5).setVisible(false).setDepth(51).setLeftAlign(true);
        this.soundCredit4 = this.add.bitmapText(width / 2 + 25, 550, "er_font", "Death Sound Effects by TinyWorlds:\n https://opengameart.org/content/5-hit\n-sounds-dying", 16).setOrigin(0.5).setVisible(false).setDepth(51).setLeftAlign(true);
        this.fontCredit = this.add.bitmapText(width / 2 + 25, 650, "er_font", "Font: Ethnocentric by Ray Larabie:\n https://www.dafont.com/ethnocentric.font", 16).setOrigin(0.5).setVisible(false).setDepth(51).setLeftAlign(true);
        this.artCredit = this.add.bitmapText(width / 2 + 25, 700, "er_font", "Art: Created by Nick Marigo", 16).setOrigin(0.5).setVisible(false).setDepth(51).setLeftAlign(true);
        this.exitCreditText = this.add.bitmapText(width / 2, 750, "er_font", "Press C to Exit Credits", 24).setOrigin(0.5).setVisible(false).setDepth(51);
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
                this.fontCredit.setVisible(true);
                this.artCredit.setVisible(true);
                this.exitCreditText.setVisible(true);
            } else {
                this.creditsTextOn = false;
                this.textBox.setVisible(false);
                this.musicCredit.setVisible(false);
                this.soundCredit1.setVisible(false);
                this.soundCredit2.setVisible(false);
                this.soundCredit3.setVisible(false);
                this.soundCredit4.setVisible(false);
                this.fontCredit.setVisible(false);
                this.artCredit.setVisible(false);
                this.exitCreditText.setVisible(false);
            }
        });

    }
}