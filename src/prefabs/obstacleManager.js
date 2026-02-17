const CHUNKS = [
    {
        name: 'singleSpike',
        width: 400,
        items: [
            {key: 'spikeOne', x: 320, yOffset: 0, type: 'hazard'}
        ]
    },
    {
        name: 'platformHop',
        width: 700,
        items : [
            {key: 'platform', x: 320, yOffset: -140, type: 'platform'},
            {key: 'spikeFour', x: 560, yOffset: 0, type: 'hazard'}
        ]
    }
];

class ObstacleManager {
    constructor(scene, groundY) {
        this.scene = scene;
        this.groundY = groundY;
        this.scrollSpeed = 200;

        this.platformGroup = scene.physics.add.staticGroup();
        this.hazardGroup = scene.physics.add.staticGroup();

        this.nextSpawnX = scene.scale.width + 200;
        this.lastChunk = null;

        this.spawnAhead = 900;

        this.cleanupBuffer = 200;
    }

    pickChunkNoRepeat() {
        let chunk;
        do{
            chunk = Phaser.Utils.Array.GetRandom(CHUNKS);
        } while (chunk.name === this.lastChunk)

        this.lastChunk = chunk.name;
        return chunk;
    }

    spawnChunk(chunk, startX) {

        for( const item of chunk.items) {
            const x = startX + item.x;
            const y = this.groundY + item.yOffset;

            if (item.type === 'platform') {
                const p = this.platformGroup.create(x, y, item.key);
                p.setOrigin(0.5, 1);
                p.refreshBody();
                //p.body.immovable = true;
            } else if (item.type === 'hazard') {
                const h = this.hazardGroup.create(x, y, item.key);
                h.setOrigin(0.5, 1);
                h.refreshBody();
            }
        }
    }

    update(dt) {

        this.nextSpawnX -= this.scrollSpeed * dt;

        const cam = this.scene.cameras.main;
        const camRight = cam.scrollX + this.scene.scale.width;

        while(this.nextSpawnX < camRight + this.spawnAhead) {
            const chunk = this.pickChunkNoRepeat();
            this.spawnChunk(chunk, this.nextSpawnX);

            const gap = Phaser.Math.Between(120, 260);
            this.nextSpawnX += chunk.width + gap;
        }

        this.hazardGroup.children.iterate((obj) => {
            if (!obj) return;
            obj.x -= this.scrollSpeed * dt;
            obj.refreshBody();

            const camLeft = this.scene.cameras.main.scrollX;
            if (obj.x + obj.width < camLeft - this.cleanupBuffer) obj.destroy();
        });

        this.platformGroup.children.iterate((obj) => {
            if(!obj) return;
            obj.x -= this.scrollSpeed * dt;
            obj.refreshBody();

            const camLeft = this.scene.cameras.main.scrollX;
            if(obj.x + obj.width < camLeft - this.cleanupBuffer) obj.destroy();
        });
    }
}