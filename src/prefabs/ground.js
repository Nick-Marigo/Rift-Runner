class Ground {
    constructor(scene, texture, scrollSpeed, height, width) {
        this.scene = scene;

        this.texture = texture;
        this.scrollSpeed = scrollSpeed;
        this.height = height;
        this.width = width;

        this.group = scene.physics.add.group({ immovable: true, allowGravity: false});

        this.ground1 = this.group.create(0, this.height, texture).setOrigin(0, 1);
        this.ground2 = this.group.create(this.width, this.height, texture).setOrigin(0, 1);

        this.ground1.body.moves = false;
        this.ground2.body.moves = false;
    }

    update(dt) {
        const moveAmount = this.scrollSpeed * dt;
        this.ground1.x -= moveAmount;
        this.ground2.x -= moveAmount;

        if(this.ground1.x <= -this.width + 100) {
            this.ground1.x = this.ground2.x + this.width;
        }

        if(this.ground2.x <= -this.width + 100) {
            this.ground2.x = this.ground1.x + this.width;
        }

        this.ground1.refreshBody();
        this.ground2.refreshBody();

    }
}