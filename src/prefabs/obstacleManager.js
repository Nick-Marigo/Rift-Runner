const CHUNKS = [
    /*{
        name: 'Spikes',
        width: 1250,
        items: [
            {key: 'spikeOne', x: 0, yOffset: 0, type: 'hazard'},
            {key: 'spikeOne', x: 200, yOffset: 0, type: 'hazard'},
            {key: 'spikeOne', x: 232, yOffset: 0, type: 'hazard'},
            {key: 'spikeFour', x: 500, yOffset: 0, type: 'hazard'},
            {key: 'spikeFour', x: 750, yOffset: 0, type: 'hazard'},
            {key: 'spikeEight', x: 1000, yOffset: 0, type: 'hazard'}
        ]
    },
    {
        name: 'platformHop',
        width: 1250,
        items : [
            {key: 'spikeEight', x: 0, yOffset: 0, type: 'hazard'},
            {key: 'spikeEight', x: 256, yOffset: 0, type: 'hazard'},
            {key: 'spikeEight', x: 512, yOffset: 0, type: 'hazard'},
            {key: 'spikeEight', x: 768, yOffset: 0, type: 'hazard'},
            {key: 'spikeEight', x: 1024, yOffset: 0, type: 'hazard'},
            {key: 'platform', x: 200, yOffset: -140, type: 'platform'},
            {key: 'platformLong', x: 580, yOffset: -140, type: 'platform'},
            {key: 'platform', x: 1000, yOffset: -140, type: 'platform'}
        ]
    },
    {
        name: 'SlidesALot',
        width: 1250,
        items: [
            {key: 'spikeFour', x: 0, yOffset: -72, type: 'hazard'},
            {key: 'platform', x: 0, yOffset: -40, type: 'platform'},
            {key: 'spikeFour', x: 300, yOffset: 0, type: 'hazard'},
            {key: 'spikeFour', x: 600, yOffset: -72, type: 'hazard'},
            {key: 'platform', x: 600, yOffset: -40, type: 'platform'},
            {key: 'spikeEight', x: 900, yOffset: 0, type: 'hazard'},
            {key: 'platformLong', x: 1028, yOffset: -40, type: 'platform'},
            {key: 'platform', x: 1156, yOffset: -120, type: 'platform'},
            {key: 'spikeFour', x: 1156, yOffset: -152, type: 'hazard'},
            {key: 'spikeEight', x: 1156, yOffset: 0, type: 'hazard'}
        ]
    },
    {
        name: 'needleThreader',
        width: 1250,
        items: [
            {key: 'spikeFour', x: 0, yOffset: 0 , type: 'hazard'},
            {key: 'platform',  x: 200, yOffset: -32, type: 'platform'},
            {key: 'platformLong', x: 328, yOffset: -100, type: 'platform'},
            {key: 'platformLong', x: 584, yOffset: -100, type: 'platform'},
            {key: 'spikeEight', x: 328, yOffset: -132, type: 'hazard'},
            {key: 'spikeEight', x: 584, yOffset: -132, type: 'hazard'},
            {key: 'platformLong', x: 328, yOffset: -32, type: 'platform'},
            {key: 'platformLong', x: 584, yOffset: -32, type: 'platform'},
            {key: 'spikeEight', x: 1000, yOffset: 0, type: 'hazard'}

        ]
    },*/
    {
        name: 'zigzag',
        width: 1250,
        items: [
            {key: 'spikeEight', x: 0, yOffset: 0 , type: 'hazard'},
            {key: 'platform', x: 100, yOffset: -128 , type: 'platform'},
            {key: 'spikeEight', x: 350, yOffset: 0 , type: 'hazard'},
            {key: 'platformLong', x: 500, yOffset: -128 , type: 'platform'},
            {key: 'spikeOne', x: 600, yOffset: -160 , type: 'hazard'},
            {key: 'platform', x: 900, yOffset: -128 , type: 'platform'},
            {key: 'spikeEight', x: 900, yOffset: 0 , type: 'hazard'}
        ]
    }
];

class ObstacleManager {
    constructor(scene, groundY, scrollSpeed) {
        this.scene = scene;
        this.groundY = groundY;
        this.scrollSpeed = scrollSpeed;

        this.platformGroup = scene.physics.add.staticGroup();
        this.hazardGroup = scene.physics.add.group();

        this.nextSpawnX = scene.scale.width + 200;
        this.lastChunk = null;
        this.spawningEnabled = true;

        this.spawnAhead = 900;

        this.cleanupBuffer = 200;
    }

    pickChunkNoRepeat() {

        if(CHUNKS.length === 1) return CHUNKS[0];

        let chunk;
        do{
            chunk = Phaser.Utils.Array.GetRandom(CHUNKS);
        } while (chunk.name === this.lastChunk)

        this.lastChunk = chunk.name;
        return chunk;
    }

    spawnOneChunk() {
        const chunk = this.pickChunkNoRepeat();
        const startX = this.nextSpawnX;

        this.spawnChunk(chunk, startX);

        const gap = Phaser.Math.Between(150, 250);
        const chunkEndX = startX + chunk.width;

        this.nextSpawnX += chunk.width + gap;

        this.lastSpawnInfo = { chunkEndX, gap};
        return { chunk, startX, chunkEndX, gap};
    }

    spawnChunk(chunk, startX) {

        for( const item of chunk.items) {
            const x = startX + item.x;
            const y = this.groundY + item.yOffset;

            if (item.type === 'platform') {
                const p = this.platformGroup.create(x, y, item.key);
                p.setOrigin(0, 1);
                p.refreshBody();
            } else if (item.type === 'hazard') {
                const h = this.hazardGroup.create(x, y, item.key);
                this.hazardGroup.add(h);
                h.setOrigin(0, 1);
                h.body.setAllowGravity(false);
                h.body.setImmovable(true);
                
                const newWidth = h.width * .9;
                const newHeight = h.height * .8;

                h.body.setSize(newWidth, newHeight);
                h.body.setOffset((h.width - newWidth) / 2, h.height - newHeight);

            }
        }
    }

    update(dt, maxToSpawn = Infinity) {

        this.nextSpawnX -= this.scrollSpeed * dt;

        const cam = this.scene.cameras.main;
        const camRight = cam.scrollX + this.scene.scale.width;

        let spawned = 0;

        if(this.spawningEnabled) {

            while(spawned < maxToSpawn && this.nextSpawnX < camRight + this.spawnAhead) {

                this.spawnOneChunk();
                spawned++;

           }
        }

        this.hazardGroup.children.iterate((obj) => {
            if (!obj) return;
            obj.x -= this.scrollSpeed * dt;
            //obj.refreshBody();

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

        return spawned;

    }
}