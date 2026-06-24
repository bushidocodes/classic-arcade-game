import { Resources } from './resources.js';
import { NUM_ROWS, NUM_COLS, TILE_WIDTH, TILE_HEIGHT, ROW_IMAGES, IMAGES_TO_LOAD } from './config.js';
import { Enemy } from './entities/enemy.js';
import { Player } from './entities/player.js';
import { Heart, BlueGem, GreenGem, OrangeGem, Item } from './entities/item.js';

const canvas = document.createElement('canvas');
canvas.width = 505;
canvas.height = 606;
document.querySelector('main')!.appendChild(canvas);
const ctx = canvas.getContext('2d')!;

let gameOver = false;
let player: Player | null = null;
let allEnemies: Enemy[] = [];
let allItems: Item[] = [];
let lastTime: number | undefined;
let animFrameId: number | null = null;

function main(timestamp: number): void {
    const dt = lastTime !== undefined ? (timestamp - lastTime) / 1000 : 0;

    if (!gameOver) {
        update(dt);
        render();
        lastTime = timestamp;
        animFrameId = requestAnimationFrame(main);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.font = '60px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2, 200);
        ctx.fillText(`${player!.score} points`, canvas.width / 2, 300);
        animFrameId = null;
    }
}

function update(dt: number): void {
    for (const enemy of allEnemies) enemy.update(dt, player!.score);
    player!.update(allEnemies, allItems);
    for (const item of allItems) item.update(dt);
    if (player!.lives <= 0) gameOver = true;
}

function render(): void {
    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
            ctx.drawImage(Resources.get(ROW_IMAGES[row]), col * TILE_WIDTH, row * TILE_HEIGHT);
        }
    }
    for (const enemy of allEnemies) enemy.render(ctx);
    player!.render(ctx);
    for (const item of allItems) item.render(ctx);
}

function reset(): void {
    if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
    gameOver = false;
    player = new Player();
    allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3)];
    allItems = [new Heart(), new BlueGem(), new GreenGem(), new OrangeGem()];
}

export function getPlayer(): Player | null {
    return player;
}

export function init(): void {
    reset();
    lastTime = undefined;
    main(performance.now());
}

Resources.load(IMAGES_TO_LOAD);
Resources.onReady(init);
