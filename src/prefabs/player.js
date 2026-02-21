class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame, scrollSpeed) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;

        this.w = 48;
        this.newWidth = 30;
        this.h = 64;
        
        this.speedMultiplier = 1.0;
        this.scrollSpeed = scrollSpeed;
        this.playerMoveVelocity = 200;

        this.jumpSpeed = 450;
        this.fallSpeed = 450;
        
        scene.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            run: new RunState(),
            jump: new JumpState(),
            slide: new SlideState(),
        }, [scene, this]);
    }

    applyRunVelocity(scene) {
        const { A, D } = scene.keys;

        const driftVelocity = -(this.scrollSpeed * 0.5);

        let vx = driftVelocity;

        if (A.isDown) vx -= this.playerMoveVelocity;
        if (D.isDown) vx += this.playerMoveVelocity;

        this.setVelocityX(vx);
    }

    applyJump() {
        this.setVelocityY(-this.jumpSpeed);
    }

    isGrounded() {
        return this.body.blocked.down || this.body.touching.down;
    }
}

class IdleState extends State {
    enter(scene, player) {
        player.setVelocity(0, 0);
        player.body.setSize(player.newWidth, player.h);
        player.body.setOffset(player.newWidth /2 - 5, 0);
        player.anims.play('player-idle');
    }

    execute(scene, player) {
        const { D } = scene.keys;

        if(D.isDown) {
            scene.startGame();
            this.stateMachine.transition('run');
        }
    }
}

class RunState extends State {

    enter(scene, player) {
        player.body.setSize(player.newWidth, player.h);
        player.body.setOffset(player.newWidth /2 - 5, 0);
        player.anims.play('player-run');
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

        if(!player.isGrounded()) {
            this.stateMachine.transition('jump');
        }
    }
}

class JumpState extends State {
    enter(scene, player) {
        player.body.setSize(player.newWidth, player.h);
        player.body.setOffset(player.newWidth /2 - 5, 0);
    }

    execute(scene, player) {

        const { S } = scene.keys;

        player.applyRunVelocity(scene);

        if(S.isDown && player.body.velocity.y > -100) {
            player.setVelocityY(player.fallSpeed);
        }

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
        player.anims.play('player-slide');
        player.body.setOffset(0, player.h / 2);
        player.body.setSize(player.w, player.h / 2);
        
    }

    execute(scene, player) {
        const { S } = scene.keys;
        player.applyRunVelocity(scene);

        const isCeilingAbove = player.body.blocked.up || player.body.touching.up;

        if (!S.isDown) {
            if(isCeilingAbove) {
                return;
            }

            player.y -= player.h /2;
            this.stateMachine.transition(player.isGrounded() ? 'run' : 'jump');
        }
    }
}