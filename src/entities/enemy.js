import { NUM_COLS, TILE_WIDTH, TILE_HEIGHT, SPRITE_X_OFFSET, SPRITE_Y_OFFSET } from '../config.js';
import { Resources } from '../resources.js';

export class Enemy {
    constructor(yInTiles) {
        this.sprite = 'images/enemy-bug.png';
        this.yInTiles = yInTiles;
        this.x = -TILE_WIDTH;
        this.xInTiles = Math.floor(this.x / TILE_WIDTH);
        this.randomizeSpeed(0);
        this.randomizeDirection();
    }

    randomizeSpeed(playerScore = 0) {
        this.speed = 100 + (200 + playerScore / 20) * Math.random();
    }

    randomizeDirection() {
        if (Math.random() < 0.5) {
            this.x = -TILE_WIDTH;
        } else {
            this.x = NUM_COLS * TILE_WIDTH;
            this.speed = -this.speed;
        }
    }

    update(dt, playerScore = 0) {
        this.x += dt * this.speed;
        this.xInTiles = Math.floor(this.x / TILE_WIDTH);
        if (this.isOutOfBounds()) {
            this.randomizeSpeed(playerScore);
            this.randomizeDirection();
        }
    }

    render(ctx) {
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

    isOutOfBounds() {
        return this.xInTiles < -1 || this.xInTiles > NUM_COLS;
    }
}
