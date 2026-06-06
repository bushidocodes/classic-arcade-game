import { NUM_ROWS, NUM_COLS, TILE_WIDTH, TILE_HEIGHT, SPRITE_X_OFFSET, SPRITE_Y_OFFSET } from '../config.js';
import { Resources } from '../resources.js';

export class Item {
    constructor() {
        this.xInTiles = -1;
        this.yInTiles = -1;
        this.resizeFactor = 0.5;
        this.sprite = '';
    }

    randomizeLocation() {
        this.xInTiles = Math.floor(Math.random() * NUM_COLS);
        // Rows 1–3 only: enemy lanes, avoids water (0) and grass (4–5)
        this.yInTiles = Math.floor(Math.random() * (NUM_ROWS - 3) + 1);
    }

    update(_dt) {
        if (Math.random() < 0.0003) this.randomizeLocation();
    }

    render(ctx) {
        if (this.xInTiles < 0 || this.yInTiles < 0) return;
        const img = Resources.get(this.sprite);
        ctx.drawImage(
            img,
            this.xInTiles * TILE_WIDTH - (img.width * this.resizeFactor) / 2 + SPRITE_X_OFFSET,
            this.yInTiles * TILE_HEIGHT - (img.height * this.resizeFactor) / 2 + SPRITE_Y_OFFSET,
            img.width * this.resizeFactor,
            img.height * this.resizeFactor,
        );
    }

    onPickup(_player) {}
}

export class Heart extends Item {
    constructor() {
        super();
        this.sprite = 'images/Heart.png';
    }
    onPickup(player) { player.lives = Math.min(player.lives + 1, 9); }
}

export class BlueGem extends Item {
    constructor() {
        super();
        this.sprite = 'images/Gem Blue.png';
    }
    onPickup(player) { player.score += 50; }
}

export class OrangeGem extends Item {
    constructor() {
        super();
        this.sprite = 'images/Gem Orange.png';
    }
    onPickup(player) { player.score += 100; }
}

export class GreenGem extends Item {
    constructor() {
        super();
        this.sprite = 'images/Gem Green.png';
    }
    onPickup(player) { player.score += 150; }
}
