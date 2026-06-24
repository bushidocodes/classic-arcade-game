import { NUM_ROWS, NUM_COLS, TILE_WIDTH, TILE_HEIGHT, SPRITE_X_OFFSET, SPRITE_Y_OFFSET } from '../config.js';
import { Resources } from '../resources.js';
import type { PlayerLike } from '../types.js';

export class Item {
    xInTiles: number = -1;
    yInTiles: number = -1;
    resizeFactor: number = 0.5;
    sprite: string = '';

    randomizeLocation(): void {
        this.xInTiles = Math.floor(Math.random() * NUM_COLS);
        // Rows 1–3 only: enemy lanes, avoids water (0) and grass (4–5)
        this.yInTiles = Math.floor(Math.random() * (NUM_ROWS - 3) + 1);
    }

    update(_dt: number): void {
        if (Math.random() < 0.0003) this.randomizeLocation();
    }

    render(ctx: CanvasRenderingContext2D): void {
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

    onPickup(_player: PlayerLike): void {}
}

export class Heart extends Item {
    override sprite = 'images/Heart.png';
    override onPickup(player: PlayerLike): void { player.lives = Math.min(player.lives + 1, 9); }
}

export class BlueGem extends Item {
    override sprite = 'images/Gem Blue.png';
    override onPickup(player: PlayerLike): void { player.score += 50; }
}

export class OrangeGem extends Item {
    override sprite = 'images/Gem Orange.png';
    override onPickup(player: PlayerLike): void { player.score += 100; }
}

export class GreenGem extends Item {
    override sprite = 'images/Gem Green.png';
    override onPickup(player: PlayerLike): void { player.score += 150; }
}
