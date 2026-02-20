class Play extends Phaser.Scene{
    constructor(){
        super()
    }

    preload() {

        this.load.path = "./assets/";
        this.load.image('groundPlatform', 'GroundPlatformDebug.png');
        this.load.spritesheet('portal', 'Portal.png', {
            frameWidth: 48,
            frameHeight: 128,
            startFrame: 0,
            endFrame: 3
        });
        this.load.image('spikeOne', '/obstacles/SpikeOne.png');
        this.load.image('spikeFour', '/obstacles/SpikeFour.png');
        this.load.image('spikeEight', '/obstacles/SpikeEight.png');
        this.load.image('platform', '/obstacles/Platform.png');
        this.load.image('platformLong', '/obstacles/PlatformLong.png')
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
        this.load.image('UIBorder', '/UIBorder.png');

        this.load.image('background', 'Background.png');
        this.load.image('backgroundMiddle', 'BackgroundMiddle.png');
        this.load.image('backgroundFront', 'BackgroundFront.png');

        this.load.bitmapFont('er_font', 'font/ER-Font.png', 'font/ER-Font.xml');
        
    }

    create() {

        //Everything here will be moved to loading screen
        this.anims.create({
            key: 'portalanims',
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        });
        //----------------------------

        this.GAME_WIDTH = 700;
        this.GAME_HEIGHT = 700;

        this.nextAngle = 0;
        this.nextGravityKey = 'down';
        this.nextFlip = false;
        this.currentPortal = null;
        this.isTransitioning = false;
        this.exitPortal = null;
        this.arrowTimer = null;
        this.portalTimer = null;
        this.lastGravityKey = null;
        this.lastFlip = null;

        this.scrollSpeed = 100;
        this.chunksPerCycle = this.getChunksPerCycle();
        this.chunksThisCycle = 0;
        this.portalPlanned = false;
        this.portalXPlanned = 0;
        this.portalYPlanned = 0;

        this.CHUNK_WIDTH = 1250;
        this.PORTAL_OFFSET_IN_CHUNK = 1000;
        this.distanceThisCycle = 0;
        this.warningFired = false;

        this.scene.launch('UIScene');
        this.ui = this.scene.get('UIScene');

        this.background = this.add.tileSprite(0, 0, 900, 900, 'background').setOrigin(0);
        this.backgroundMiddle = this.add.tileSprite(0, 0, 900, 900, 'backgroundMiddle').setOrigin(0);
        this.backgroundFront = this.add.tileSprite(0, 0, 900, 900, 'backgroundFront').setOrigin(0);

        this.ground = new Ground(this, 'groundPlatform', this.scrollSpeed, this.GAME_HEIGHT + 100, this.GAME_WIDTH);

        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,     // JUMP
            S: Phaser.Input.Keyboard.KeyCodes.S,     // SLIDE
            A: Phaser.Input.Keyboard.KeyCodes.A,     // LEFT
            D: Phaser.Input.Keyboard.KeyCodes.D,     // RIGHT
        });

        this.player = new Player(this, this.GAME_WIDTH / 4, 550, 'player', 0, this.scrollSpeed);
        this.player.setDisplaySize(48, 64);

        this.physics.add.collider(this.player, this.ground.group);

        this.input.keyboard.on('keydown-G', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);


        this.obstacles = new ObstacleManager(this, this.GAME_HEIGHT, this.scrollSpeed);
        this.physics.add.collider(this.player, this.obstacles.platformGroup);

        this.physics.add.overlap(this.player, this.obstacles.hazardGroup, () => {
            console.log("Game Over");
        });

        this.physics.world.setBounds(100, 100, 800, 800);
        this.player.body.onWorldBounds = true;

        this.physics.world.setBoundsCollision(true, true, true, true);

        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if(body.gameObject === this.player) {
                console.log("Game Over!");
            }
        })

        this.startCycle();

             /*   this.input.keyboard.on('keydown-R', () => {
            currentAngle += 90;
            this.cameras.main.setAngle(currentAngle);
        }, this);        

        this.input.keyboard.on('keydown-F', () => {
            if (this.cameras.main.zoomX === 1) {
                this.cameras.main.setZoom(-1, 1);
            } else {
                this.cameras.main.setZoom(1, 1);r
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
    }, this);*/

    }

    update(time, delta) {

        const dt = delta / 1000;

        this.backgroundMiddle.tilePositionX += (this.scrollSpeed * 0.1) * dt;
        this.backgroundFront.tilePositionX += (this.scrollSpeed * 0.3) * dt;

        this.ground.update(dt);
        this.playerFSM.step();

        this.handleChunkCycle(dt);

        //if(this.player.x < )

        if(this.currentPortal) {
            this.currentPortal.setScrollSpeed(this.scrollSpeed);
            this.currentPortal.update(dt);
        }

        if(this.currentPortal && !this.warningFired) {
            const distanceToPlayer = this.currentPortal.x - this.player.x;

            if(distanceToPlayer < 300) {
                this.ui.events.emit('phaserWarning', {
                gravityKey: this.nextGravityKey,
                flip: this.nextFlip
                });

                this.warningFired= true;
            }

        }

        if(this.exitPortal) {
            this.exitPortal.setScrollSpeed(this.scrollSpeed);
            this.exitPortal.update(dt);
        }


        //this.obstacles.update(dt);

    }

    handleChunkCycle(dt) {

        this.obstacles.scrollSpeed = this.scrollSpeed;

        const remaining = this.chunksPerCycle - this.chunksThisCycle;
        const spawnedNow = this.obstacles.update(dt, remaining);

        this.chunksThisCycle += spawnedNow;

        this.distanceThisCycle += this.scrollSpeed * dt;

        //const portalTriggerDistance = (this.chunksPerCycle - 1) * this.CHUNK_WIDTH + this.PORTAL_OFFSET_IN_CHUNK;


        if(!this.isTransitioning && !this.currentPortal && !this.portalPlanned) {
            if(this.distanceThisCycle >= this.chunksPerCycle) {
                if(this.obstacles.nextSpawnX < this.scale.width + 100) {
                    this.spawnPortalAtOffscreenRight();
                }
            }
        }

    }

    spawnPortalAtOffscreenRight() {

        this.obstacles.spawningEnabled = false;

        this.portalPlanned = true;

        /*const info = this.obstacles.lastSpawnInfo;
        if (!info) return;

        const portalX = info.chunkEndX - this.CHUNK_WIDTH + this.PORTAL_OFFSET_IN_CHUNK;*/
        const portalX = this.obstacles.nextSpawnX + 200;
        const portalY = this.GAME_HEIGHT - 150;

            this.currentPortal = new Portal(this, portalX, portalY, 'portal', this.scrollSpeed, this.player, 'entry', { 
                onEnter: () => this.enterPortalTransition()
            });

    }

    pickNextPhase() {
        const gravityKeys = Object.keys(cameraAngles);

        let key, flipChoice;

        do {
            key = Phaser.Utils.Array.GetRandom(gravityKeys);
            flipChoice = Phaser.Math.Between(0, 1) === 1;
        } while (key === this.lastGravityKey && flipChoice === this.lastFlip);

        this.nextGravityKey = key;
        this.nextAngle = cameraAngles[key];
        this.nextFlip = flipChoice;
        //this.nextFlip = Phaser.Math.Between(0, 1) === 1;

        this.lastGravityKey = key;
        this.lastFlip = flipChoice;
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

        this.directionArrow.setAngle(this.nextFlip ? 270 : 90);
        this.directionArrow.setFlipX(false);
    }

    enterPortalTransition() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.portalPlanned = false;
        this.currentPortal = null;

        this.obstacles.platformGroup.clear(true, true);
        this.obstacles.hazardGroup.clear(true, true);

        this.ui.events.emit('hideWarning');

        this.cameras.main.fadeOut(500);

        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.applyNextPhase();

            const safeX = this.cameras.main.scrollX + (this.scale.width * 0.25);

            const safeY = this.GAME_HEIGHT - 150;

            this.player.setPosition(safeX, safeY);
            this.player.body.setVelocity(0, 0);

            this.cameras.main.fadeIn(500);

            this.spawnExitPortal(safeX, safeY);
        })
    }

    spawnExitPortal(x, y) {
        const exit = new Portal(this, x, y, 'portal', this.scrollSpeed, null, 'exit');
        exit.setDepth(100);

        exit.setScale(0);
        this.tweens.add({
            targets: exit,
            scale: 1,
            duration: 200
        });

        this.exitPortal = exit;

        const check = this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                if(!this.exitPortal || !this.exitPortal.active) {
                    check.remove(false);

                    this.exitPortal = null;
                    this.isTransitioning = false;

                    this.scrollSpeed += 25;
                    this.ground.scrollSpeed = this.scrollSpeed;
                    this.obstacles.scrollSpeed = this.scrollSpeed;

                    this.startCycle();
                }
            }
        });

    }

    startCycle() {

        this.currentPortal = null;
        this.portalPlanned = false;

        //this.cycleStartX = this.cameras.main.scrollX;

        this.obstacles.platformGroup.clear(true, true);
        this.obstacles.hazardGroup.clear(true, true);

        this.chunksPerCycle = this.getChunksPerCycle();
        this.chunksThisCycle = 0;

        this.distanceThisCycle = 0;
        this.warningFired = false;

        this.obstacles.spawningEnabled = true;

        this.obstacles.nextSpawnX = this.scale.width + 200;
        this.cycleStartX = this.obstacles.nextSpawnX;
        this.distanceThisCycle = 0;

        this.pickNextPhase();

        this.ui.events.emit('hideWarning');

    }

    /*startCycle() {

        this.chunksPerCycle = this.getChunksPerCycle();
        this.chunksThisCycle = 0;
        this.portalPlanned = false;
        this.portalXPlanned = 0;
        this.portalYPlanned = 0;

        if (this.arrowTimer) this.arrowTimer.remove(false);
        if (this.portalTimer) this.portalTimer.remove(false);

        this.pickNextPhase();

        this.arrowTimer = this.time.delayedCall(8000, () => {
            this.ui.events.emit('phaserWarning', {
                gravityKey: this.nextGravityKey,
                angle: this.nextAngle,
                flip: this.nextFlip
            });
        });

        this.portalTimer = this.time.delayedCall(10000, () => {
            const spawnX = this.player.x + 500;
            const spawnY = this.player.y;

            this.currentPortal = new Portal(this, spawnX, spawnY, 'portal', this.scrollSpeed, this.player, 'entry', {
                //player: this.player,
                onEnter: () => this.enterPortalTransition()
            });
        });
    }*/

    getChunksPerCycle() {
        return 1 + Math.floor((this.scrollSpeed - 100) / 50);
    }
}