class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player = null, type = 'entry', opts = {}) {
        super(scene, x, y, texture)
        
        this.scene = scene;
        this.type = type;

        this.onEnter = opts.onEnter ?? (() => {});
        this.onExitComplete = opts.onExitComplete ?? (() => {});

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.setImmovable(true);

        this.overlapCollider = null;

        if(this.type === 'entry') {
            scene.physics.add.overlap(player, this, this.handleEnter, null, this);
        }
    }

    handleEnter() {
        if(this.type !== 'entry') return;

        if(this.overlapCollider) {
            this.scene.physics.world.removeCollider(this.overlapCollider);
            this.overlapCollider = null;
        }

        this.body.enable = false;
        this.setVisible(false);

        this.onEnter();

        this.scene.time.delayedCall(0, () => {
            if (this.active) this.destroy();
        });
    }

    /*startTransition() {

        this.onEnter();

        this.player.body.setVelocity(0, 0);
        this.player.body.moves = false;

        this.scene.time.delayedCall(350, () => {
            this.spawnExit();
        });
    }

    spawnExit() {
        const cam = this.scene.cameras.main;
        const exitX = cam.scrollX + (this.scene.scale.width * .25);
        const exitY = this.player.y;

        const exitPortal = new Portal(this.scene, exitX, exitY, 'portal', this.player, 'exit');

        this.player.x = exitX;
        this.player.y = exitY;
        this.player.body.moves = true;

        this.scene.time.delayedCall(1500, ()=> {
            exitPortal.destroy();
            this.onExitComplete();
        });

        this.destroy();
    }*/

    update(dt) {
        this.x -= 200 * dt;

        if(this.x + this.width < -200) {
            this.destroy();
        }
    }
}