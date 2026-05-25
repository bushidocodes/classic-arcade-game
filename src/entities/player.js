import { NUM_ROWS, NUM_COLS, TILE_WIDTH, TILE_HEIGHT, SPRITE_X_OFFSET, SPRITE_Y_OFFSET } from '../config.js';
import { Resources } from '../resources.js';

export class Player {
    constructor() {
        this.lives = 3;
        this.score = 0;
        this.sprite = 'images/char-cat-girl.png';
        this.moveToStart();
    }

    moveToStart() {
        this.xInTiles = 2;
        this.yInTiles = 5;
    }

    handleInput(input) {
        switch (input) {
            case 'up':
                if (this.yInTiles - 1 > 0) {
                    this.yInTiles--;
                } else {
                    this.score += 100;
                    this.moveToStart();
                }
                break;
            case 'down':
                if (this.yInTiles + 1 < NUM_ROWS) this.yInTiles++;
                break;
            case 'left':
                if (this.xInTiles - 1 >= 0) this.xInTiles--;
                break;
            case 'right':
                if (this.xInTiles + 1 < NUM_COLS) this.xInTiles++;
                break;
        }
    }

    update(enemies, items) {
        if (this.isHitByEnemy(enemies)) {
            this.lives--;
            this.moveToStart();
        }
        const item = this.pickedUpItem(items);
        if (item) {
            item.onPickup(this);
            item.xInTiles = -1;
            item.yInTiles = -1;
        }
    }

    isHitByEnemy(enemies) {
        return enemies.some(e => this.xInTiles === e.xInTiles && this.yInTiles === e.yInTiles);
    }

    pickedUpItem(items) {
        return items.find(item => this.xInTiles === item.xInTiles && this.yInTiles === item.yInTiles) ?? null;
    }

    render(ctx) {
        ctx.textAlign = 'left';
        ctx.font = '30px Arial';
        ctx.clearRect(0, 0, 200, 30);
        ctx.fillText(`Score: ${this.score}`, 10, 30);
        ctx.clearRect(380, 0, 200, 30);
        ctx.fillText(`Lives: ${this.lives}`, 380, 30);

        const img = Resources.get(this.sprite);
        ctx.drawImage(img,
            this.xInTiles * TILE_WIDTH - img.width / 2 + SPRITE_X_OFFSET,
            this.yInTiles * TILE_HEIGHT - img.height / 2 + SPRITE_Y_OFFSET,
        );
    }
}
