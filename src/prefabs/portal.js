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


    update(dt) {
        this.x -= 200 * dt;

        if(this.x + this.width < -200) {
            this.destroy();
        }
    }
}