class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene'});
    }

    create() {
        this.UIBorder = this.add.image(0, 0, 'UIBorder').setOrigin(0, 0);
        this.gravityArrow = this.add.sprite(width / 2 - 50, height / 2, 'gravityArrow').setVisible(false);
        this.directionArrow = this.add.sprite(width / 2 + 50, height / 2, 'directionArrow').setVisible(false);
        this.gravityArrowBottom = this.add.image(375, 850, 'gravityArrow').setOrigin(0.5).setAngle(180);
        this.directionArrowBottom = this.add.image(725, 850, 'directionArrow').setOrigin(0.5).setAngle(90);

        this.title = this.add.bitmapText(250, 50, "er_font", "Rift Runner", 48).setOrigin(0.5);

        this.gravityText = this.add.bitmapText(225, 850, "er_font", "Gravity", 32).setOrigin(0.5);
        this.directionText = this.add.bitmapText(550, 850, "er_font", "Direction", 32).setOrigin(0.5);
        this.scoreText = this.add.bitmapText(700, 50, 'er_font', "Score: 0", 32).setOrigin(0.5);

        /*this.anims.create({
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
        });*/

        this.gravityArrow.play('gravityArrowBlink');
        this.directionArrow.play('directionArrowBlink');

        this.events.on('phaserWarning', (data) => {
            this.setArrows(data.gravityKey, data.flip);
            this.gravityArrow.setVisible(true);
            this.directionArrow.setVisible(true);
        });

        this.events.on('hideWarning', () => {
            this.gravityArrow.setVisible(false);
            this.directionArrow.setVisible(false);
        });
    }

    setArrows(gravityKey, flip) {
            const cameraAngle = { up: 0, right: 90, down: 180, left: 270}[gravityKey];

            const gravityArrowAngle = (cameraAngle + 180) % 360
            this.gravityArrow.setAngle(gravityArrowAngle);
            this.gravityArrowBottom.setAngle(gravityArrowAngle);

            let forwardAngle = (90 + cameraAngle) % 360;
            if (flip) forwardAngle = (forwardAngle + 180) % 360;

            this.directionArrow.setAngle(forwardAngle);
            this.directionArrowBottom.setAngle(forwardAngle);
    }

    updateScore(score) {
        this.scoreText.setText(`Score: ${Math.floor(score)}`);
    }
    
}