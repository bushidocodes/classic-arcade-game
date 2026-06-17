import { NUM_COLS, TILE_WIDTH, TILE_HEIGHT, SPRITE_X_OFFSET, SPRITE_Y_OFFSET } from '../config.js';
import { Resources } from '../resources.js';

export class Enemy {
    sprite: string = 'images/enemy-bug.png';
    yInTiles: number;
    x: number;
    xInTiles: number;
    speed: number = 0;

    constructor(yInTiles: number) {
        this.yInTiles = yInTiles;
        this.x = -TILE_WIDTH;
        this.xInTiles = Math.floor(this.x / TILE_WIDTH);
        this.randomizeSpeed(0);
        this.randomizeDirection();
    }

    randomizeSpeed(playerScore: number = 0): void {
        this.speed = 100 + (200 + playerScore / 20) * Math.random();
    }

    randomizeDirection(): void {
        if (Math.random() < 0.5) {
            this.x = -TILE_WIDTH;
        } else {
            this.x = NUM_COLS * TILE_WIDTH;
            this.speed = -this.speed;
        }
    }

    update(dt: number, playerScore: number = 0): void {
        this.x += dt * this.speed;
        this.xInTiles = Math.floor(this.x / TILE_WIDTH);
        if (this.isOutOfBounds()) {
            this.randomizeSpeed(playerScore);
            this.randomizeDirection();
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        const img = Resources.get(this.sprite);
        if (this.speed > 0) {
            ctx.drawImage(img,
                this.x - img.width / 2 + SPRITE_X_OFFSET,
                this.yInTiles * TILE_HEIGHT - img.height / 2 + SPRITE_Y_OFFSET,
            );
        } else {
            ctx.save();
            ctx.translate(this.x, this.yInTiles * TILE_HEIGHT);
            ctx.scale(-1, 1);
            ctx.drawImage(img,
                -img.width / 2 + SPRITE_X_OFFSET,
                -img.height / 2 + SPRITE_Y_OFFSET,
            );
            ctx.restore();
        }
    }

    isOutOfBounds(): boolean {
        return this.xInTiles < -1 || this.xInTiles > NUM_COLS;
    }
}
