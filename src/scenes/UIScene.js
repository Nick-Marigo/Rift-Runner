class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene'});
    }

    create() {
        this.gravityArrow = this.add.sprite(width / 2 - 50, height / 2, 'gravityArrow').setVisible(false);
        this.directionArrow = this.add.sprite(width / 2 + 50, height / 2, 'directionArrow').setVisible(false);
        this.UIBorder = this.add.image(0, 0, 'UIBorder').setOrigin(0, 0);

        this.title = this.add.bitmapText(width / 2, 50, "er_font", "Rift Runner", 48).setOrigin(0.5);

        this.gravityText = this.add.bitmapText(250, 850, "er_font", "Gravity", 32).setOrigin(0.5);
        this.directionText = this.add.bitmapText(600, 850, "er_font", "Direction", 32).setOrigin(0.5);

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

            let forwardAngle = (90 + cameraAngle) % 360;
            if (flip) forwardAngle = (forwardAngle + 180) % 360;

            this.directionArrow.setAngle(forwardAngle);
    }
    
}