class Play extends Phaser.Scene{
    constructor(){
        super({ key: 'Play' });
    }

    preload() {
        
    }

    create() {

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

        this.actualGameSpeed = 100;
        this.scrollSpeed = 0;
        this.chunksPerCycle = this.getChunksPerCycle();
        this.chunksThisCycle = 0;
        this.portalPlanned = false;
        this.portalXPlanned = 0;
        this.portalYPlanned = 0;
        this.score = 0;
        this.isGameStarted = false;
        this.isGameOver = false;

        this.CHUNK_WIDTH = 1250;
        this.PORTAL_OFFSET_IN_CHUNK = 1000;
        this.distanceThisCycle = 0;
        this.warningFired = false;

        this.startText = this.add.bitmapText(width / 2, height / 2, 'er_font', 'Press D to Start!', 32).setOrigin(0.5).setCenterAlign().setDepth(100);

        this.tweens.add({
            targets: this.startText,
            alpha: 0,
            duration: 500,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        })

        this.scene.launch('UIScene');
        this.ui = this.scene.get('UIScene');

        this.gameMusic = this.sound.add('gameMusic', { loop: true, volume: 0.4 });
        this.gameMusic.play();

        this.deathSound = this.sound.add('deathSound', { volume: 0.5 });
        this.portalSound = this.sound.add('portalSound', { volume: 0.5 });
        this.arrowSound = this.sound.add('arrowSound', { volume: 0.3 });


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

        this.player = new Player(this, this.GAME_WIDTH / 4, this.GAME_HEIGHT - 50, 'player', 0, this.actualGameSpeed);

        this.physics.add.collider(this.player, this.ground.group);

        this.input.keyboard.on('keydown-G', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? true : false;
            this.physics.world.debugGraphic.clear();
        }, this);


        this.obstacles = new ObstacleManager(this, this.GAME_HEIGHT, this.scrollSpeed);
        this.physics.add.collider(this.player, this.obstacles.platformGroup);

        this.physics.add.overlap(this.player, this.obstacles.hazardGroup, () => {
            this.deathSound.play();
            console.log("Game Over");
            this.gameOver();
        });

        this.physics.world.setBounds(100, 100, 800, 800);
        this.player.body.onWorldBounds = true;

        this.physics.world.setBoundsCollision(true, true, true, true);

        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if(body.gameObject === this.player && left) {
                this.deathSound.play();
                console.log("Game Over!");
                this.gameOver();
            }
        })

        this.startCycle();

    }

    update(time, delta) {

        if(this.isGameOver) return;

        const dt = delta / 1000;

        this.backgroundMiddle.tilePositionX += (this.scrollSpeed * 0.1) * dt;
        this.backgroundFront.tilePositionX += (this.scrollSpeed * 0.3) * dt;

        this.ground.update(dt);
        this.playerFSM.step();

        this.handleChunkCycle(dt);

        if(this.isGameStarted && !this.isTransitioning) {
            const multiplier = this.scrollSpeed / 100;
            this.score += (5 * multiplier) * dt;
            this.ui.updateScore(this.score);
        }

        if(this.currentPortal) {
            this.currentPortal.setScrollSpeed(this.scrollSpeed);
            this.currentPortal.update(dt);
        }

        if(this.currentPortal && !this.warningFired) {
            const distanceToPlayer = this.currentPortal.x - this.player.x;

            if(distanceToPlayer < 300) {
                this.sound.play('arrowSound');
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

    }

    startGame() {
        this.isGameStarted = true;
        if(this.scrollSpeed > 0) return;

        this.scrollSpeed = this.actualGameSpeed;
        this.ground.scrollSpeed = this.scrollSpeed;
        this.obstacles.scrollSpeed = this.scrollSpeed;

        this.startText.setVisible(false);
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

        this.sound.play('portalSound');

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

    getChunksPerCycle() {
        return 1 + Math.floor((this.scrollSpeed - 100) / 50);
    }

    gameOver() {

        if(this.isGameOver) return;
        this.isGameOver = true;

        this.sound.play('deathSound');

        this.scrollSpeed = 0;
        this.ground.scrollSpeed = 0;''
        this.physics.pause();
        this.player.anims.stop();
        this.player.setTint(0Xff0000);

        this.ui.showGameOver(this.score);

        this.keys.D.once('down', () => {
            this.gameMusic.stop();
            this.scene.restart();
        });

        this.keys.A.once('down', () => {
            this.gameMusic.stop();
            this.scene.stop('UIScene');
            this.scene.start('Menu');
        });

    }
}