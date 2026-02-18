class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame, scrollSpeed) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;

        this.w = 48;
        this.h = 64;
        //this.direction = direction;
        
        this.speedMultiplier = 1.0;
        this.scrollSpeed = scrollSpeed;
        this.playerMoveVelocity = 100;

        this.jumpSpeed = 450;
        this.isSliding = false;
        
        scene.playerFSM = new StateMachine('run', {
            run: new RunState(),
            jump: new JumpState(),
            slide: new SlideState(),
        }, [scene, this]);
    }

    applyRunVelocity(scene) {
        const { A, D } = scene.keys;
        let vx = 0;

        if (A.isDown) vx -= this.playerMoveVelocity;
        if (D.isDown) vx += this.playerMoveVelocity;

        this.setVelocityX(vx);
    }

    applyJump() {
        this.setVelocityY(-this.jumpSpeed);
    }

    isGrounded() {
        return this.body.blocked.down || this.body.touching.down || 
               this.body.blocked.up || this.body.touching.up ||
               this.body.blocked.left || this.body.touching.left ||
               this.body.blocked.right || this.body.touching.right;
    }
}

class RunState extends State {

    enter(scene, player) {
        player.body.setSize(player.width, player.height);
        player.body.setOffset(0, 0);
    }

    execute(scene, player) {
        const { W, S } = scene.keys;
        player.applyRunVelocity(scene);

        if (Phaser.Input.Keyboard.JustDown(W) && player.isGrounded()) {
            player.applyJump();
            this.stateMachine.transition('jump');
        }

        if (S.isDown && player.isGrounded()) {
            this.stateMachine.transition('slide');
        }
    }
}

class JumpState extends State {
    execute(scene, player) {

        const { S } = scene.keys;

        player.applyRunVelocity(scene);

        if(player.isGrounded()) {
            if (S.isDown) {
                 this.stateMachine.transition('slide');
            } else {
                this.stateMachine.transition('run');
            }
        }
    }
}

class SlideState extends State {
    enter(scene, player) {
        // Shrink the height by half
        player.body.setSize(player.width, player.height / 2);
        
        // Offset the hitbox so it stays on the floor
        // This still depends on gravity direction!
        //if (currentGravity === 'down') player.body.setOffset(0, player.height / 2);
        //else if (currentGravity === 'up') player.body.setOffset(0, 0);
    }

    execute(scene, player) {
        const { S } = scene.keys;
        player.applyRunVelocity(scene);

        if (!S.isDown) {
            this.stateMachine.transition(player.isGrounded() ? 'run' : 'jump');
        }
    }
}