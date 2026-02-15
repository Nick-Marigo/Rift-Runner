class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player, type = 'entry', opts = {}) {
        super(scene, x, y, texture)
        
        this.scene = scene;
        this.player = player;
        this.type = type;

        this.onEnter = opts.onEnter ?? (() => {});
        this.onExitComplete = opts.onExitComplete ?? (() => {});

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.setImmovable(true);

        if(this.type === 'entry') {
            scene.physics.add.overlap(player, this, this.handleEnter, null, this);
        }
    }

    handleEnter() {
        if(this.type !== 'entry') return;

        this.disableBody(true, true);
        this.startTransition();
    }

    startTransition() {
        this.player.body.setVelocity(0, 0);
        this.player.body.moves = false;

        this.scene.time.delayedCall(350, () => {
            this.spawnExit();
        })
    }

    spawnExit() {
        const exitX = this.player.x + 120;
        const exitY = this.player.y - 40;

        const exitPortal = new Portal(this.scene, exitX, exitY, 'portal', this.player, 'exit');

        this.player.x = exitX;
        this.player.y = exitY;

        this.player.body.moves = true;

        this.scene.time.delayedCall(1500, ()=> {
            exitPortal.destroy();
        })
    }

    update(dt) {
        this.x -= 100 * dt;

        if(this.x + this.width < 0) {
            this.destroy();
        }
    }
}