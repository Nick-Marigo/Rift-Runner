class Play extends Phaser.Scene{
    constructor(){
        super()
    }

    preload() {

        this.load.path = "./assets/";
        this.load.image('groundPlatform', 'GroundPlatformDebug.png');
        this.load.image('platform', 'Platform.png');
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

        this.add.sprite(width /2 - 50, height / 2, 'gravityArrow').setAngle(180);
        this.add.sprite(width / 2 + 50, height / 2, 'directionArrow').setAngle(90);

        this.ground = new Ground(this, 'groundPlatform', 200, height, width);

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

    }

    update(time, delta) {

        const dt = delta / 1000;
        this.ground.update(dt);

            this.playerFSM.step();

    }
}