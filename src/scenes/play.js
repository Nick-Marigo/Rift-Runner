class Play extends Phaser.Scene{
    constructor(){
        super()
    }

    preload() {

        this.load.image('platform', './assets/Platform.png');
        this.load.image('gravityArrow', './assets/GravityArrow.png');
        this.load.image('directionArrow', './assets/DirectionArrow.png');
        

    }

    create() {

        this.platform = this.physics.add.sprite(width / 2, height, 'platform').setOrigin(0.5, 1);
        this.platform.body.setAllowGravity(false);
        this.platform.body.immovable = true;
        this.add.image(width /2 - 50, height / 2, 'gravityArrow').setAngle(180);
        this.add.image(width / 2 + 50, height / 2, 'directionArrow').setAngle(90);

        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,     // JUMP
            S: Phaser.Input.Keyboard.KeyCodes.S,     // SLIDE
            A: Phaser.Input.Keyboard.KeyCodes.A,     // LEFT
            D: Phaser.Input.Keyboard.KeyCodes.D,     // RIGHT
        });

        this.player = new Player(this, width / 2, 650, 'player', 0);
        this.player.setDisplaySize(48, 64);

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

    update() {

            this.playerFSM.step();

    }
}