import {
  NUM_COLS,
  NUM_ROWS,
  SPRITE_X_OFFSET,
  SPRITE_Y_OFFSET,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "../config.js";
import { Resources } from "../resources.js";
import type { Collidable, Direction, PlayerLike, Positioned } from "../types.js";

export class Player implements PlayerLike {
  lives: number = 3;
  score: number = 0;
  sprite: string = "images/char-cat-girl.png";
  xInTiles: number = 2;
  yInTiles: number = 5;

  constructor() {
    this.moveToStart();
  }

  moveToStart(): void {
    this.xInTiles = 2;
    this.yInTiles = 5;
  }

  handleInput(input: Direction): void {
    switch (input) {
      case "up":
        if (this.yInTiles - 1 > 0) {
          this.yInTiles--;
        } else {
          this.score += 100;
          this.moveToStart();
        }
        break;
      case "down":
        if (this.yInTiles + 1 < NUM_ROWS) this.yInTiles++;
        break;
      case "left":
        if (this.xInTiles - 1 >= 0) this.xInTiles--;
        break;
      case "right":
        if (this.xInTiles + 1 < NUM_COLS) this.xInTiles++;
        break;
    }
  }

  update(enemies: Positioned[], items: Collidable[]): void {
    if (this.isHitByEnemy(enemies)) {
      this.lives = Math.max(0, this.lives - 1);
      this.moveToStart();
    }
    const item = this.pickedUpItem(items);
    if (item) {
      item.onPickup(this);
      item.xInTiles = -1;
      item.yInTiles = -1;
    }
  }

  isHitByEnemy(enemies: Positioned[]): boolean {
    return enemies.some((e) => this.xInTiles === e.xInTiles && this.yInTiles === e.yInTiles);
  }

  // Generic so callers get back the same type they passed in — the real game
  // passes Collidable[] and gets Collidable | null (enabling item.onPickup),
  // while tests can pass plain Positioned objects without an onPickup stub.
  pickedUpItem<T extends Positioned>(items: T[]): T | null {
    return (
      items.find((item) => this.xInTiles === item.xInTiles && this.yInTiles === item.yInTiles) ??
      null
    );
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.textAlign = "left";
    ctx.font = "30px Arial";
    ctx.clearRect(0, 0, 200, 30);
    ctx.fillText(`Score: ${this.score}`, 10, 30);
    ctx.clearRect(380, 0, 200, 30);
    ctx.fillText(`Lives: ${this.lives}`, 380, 30);

    const img = Resources.get(this.sprite);
    ctx.drawImage(
      img,
      this.xInTiles * TILE_WIDTH - img.width / 2 + SPRITE_X_OFFSET,
      this.yInTiles * TILE_HEIGHT - img.height / 2 + SPRITE_Y_OFFSET,
    );
  }
}
