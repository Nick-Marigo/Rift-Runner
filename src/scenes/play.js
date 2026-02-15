class Play extends Phaser.Scene{
    constructor(){
        super()
    }

    preload() {

        this.load.path = "./assets/";
        this.load.image('groundPlatform', 'GroundPlatformDebug.png');
        this.load.image('platform', 'Platform.png');
        this.load.image('portal', 'debugportal.png');
        this.load.spritesheet('gravityArrow', 'GravityArrow.png', {
            frameWidth: 48,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('directionArrow', 'DirectionArrow.png', {
            frameWidth: 48,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 1
        });
        

    }

    create() {

        this.gravityArrow = this.add.sprite(width /2 - 50, height / 2, 'gravityArrow').setAngle(180).setVisible(false);
        this.directionArrow = this.add.sprite(width / 2 + 50, height / 2, 'directionArrow').setAngle(90).setVisible(false);
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

        this.ground = new Ground(this, 'groundPlatform', 200, height, width);

        this.nextAngle = 0;
        this.nextGravityKey = 'down';
        this.nextFlip = false;
        this.currentPortal = null;

        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,     // JUMP
            S: Phaser.Input.Keyboard.KeyCodes.S,     // SLIDE
            A: Phaser.Input.Keyboard.KeyCodes.A,     // LEFT
            D: Phaser.Input.Keyboard.KeyCodes.D,     // RIGHT
        });

        this.player = new Player(this, width / 2, 650, 'player', 0);
        this.player.setDisplaySize(48, 64);

        this.physics.add.collider(this.player, this.ground.group);

        this.input.keyboard.on('keydown-G', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);

        this.input.keyboard.on('keydown-R', () => {
            currentAngle += 90;
            this.cameras.main.setAngle(currentAngle);
        }, this);        

        this.input.keyboard.on('keydown-F', () => {
            if (this.cameras.main.zoomX === 1) {
                this.cameras.main.setZoom(-1, 1);
            } else {
                this.cameras.main.setZoom(1, 1);
            }
        }, this);

        this.testGroup = this.add.group();

    this.input.keyboard.on('keydown-E', () => {
        // Spawn at the right edge of the screen
        let testObj = this.physics.add.sprite(width + 50, height - 100, 'directionArrow');
        this.testGroup.add(testObj);
        
        // Set a constant velocity moving WORLD LEFT
        testObj.body.setAllowGravity(false);
        testObj.body.setVelocityX(-200); 
        
        console.log("Object spawned. Moving World Left.");
    }, this);

        this.physics.add.collider(this.player, this.platform)

        this.startCycle();

    }

    update(time, delta) {

        const dt = delta / 1000;

        this.ground.update(dt);
        this.playerFSM.step();

        if(this.currentPortal) {
            this.currentPortal.update(dt);
        }


    }

    pickNextPhase() {
        const gravityKeys = Object.keys(cameraAngles);
        const key = Phaser.Utils.Array.GetRandom(gravityKeys);

        this.nextGravityKey = key;
        this.nextAngle = cameraAngles[key];
        this.nextFlip = Phaser.Math.Between(0, 1) === 1;
    }

    applyNextPhase() {
        currentAngle = this.nextAngle;
        flip = this.nextFlip;

        this.cameras.main.setAngle(currentAngle);

        if(flip) {
            this.cameras.main.setZoom(-1, 1);
        } else {
            this.cameras.main.setZoom(1, 1);
        }
    }

    updateArrows() {
        this.gravityArrow.setAngle(this.nextAngle);
        this.directionArrow.setFlipX(this.nextFlip);
    }

    startCycle() {
        this.pickNextPhase();

        this.time.delayedCall(2000, () => {
            this.gravityArrow.setVisible(true);
            this.directionArrow.setVisible(true);
        });

        this.time.delayedCall(4000, () => {
            const spawnX = this.player.x + 500;
            const spawnY = this.player.y;

            this.currentPortal = new Portal(this, spawnX, spawnY, 'portal', this.player, 'entry', {
                onEnter: () => {
                    this.applyNextPhase();
                },
                onExitComplete: () => {
                    this.startCycle();
                }
            });
        });
    }
}