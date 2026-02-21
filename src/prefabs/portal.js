class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, scrollSpeed, player = null, type = 'entry', opts = {}) {
        super(scene, x, y, texture)
        
        this.scene = scene;
        this.type = type;
        this.scrollSpeed = scrollSpeed;

        this.onEnter = opts.onEnter ?? (() => {});
        this.onExitComplete = opts.onExitComplete ?? (() => {});

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.play('portalanims')

        this.body.setSize(this.width, 256);
        this.body.setOffset(0, 0);
        this.body.setAllowGravity(false);
        this.setImmovable(true);

        this.overlapCollider = null;

        if(this.type === 'entry') {
            this.overlapCollider = scene.physics.add.overlap(player, this, this.handleEnter, null, this);
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

    setScrollSpeed(speed) {
        this.scrollSpeed = speed;
    }

    update(dt) {
        this.x -= this.scrollSpeed * dt;

        //const camLeft = this.scene.cameras.main.scrollX;
        if(this.x + this.width < -200) {
            this.destroy();
        }
    }
}