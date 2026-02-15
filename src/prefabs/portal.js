class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player, type = 'entry') {
        super(scene, x, y, texture)
        
        this.scene = scene;
        this.player = player;
        this.type = type;

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
        
    }
}