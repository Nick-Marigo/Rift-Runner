class Ground {
    constructor(scene, texture, speed, height, width) {
        this.scene = scene;

        this.texture = texture;
        this.speed = speed;
        this.height = height;
        this.width = width;

        this.group = scene.physics.add.group({ immovable: true, allowGravity: false});

        this.ground1 = this.group.create(0, this.height, texture).setOrigin(0, 1);
        this.ground2 = this.group.create(this.width, this.height, texture).setOrigin(0, 1);

        this.ground1.body.moves = false;
        this.ground2.body.moves = false;
    }

    update(dt) {
        this.ground1.x -= this.speed * dt;
        this.ground2.x -= this.speed * dt;

        if(this.ground1.x + this.width < 0) {
            this.ground1.x = this.ground2.x + this.width;
        }

        if(this.ground2.x + this.width < 0) {
            this.ground2.x = this.ground1.x + this.width;
        }

    }
}