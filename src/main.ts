import { init, getPlayer } from './engine.js';
import { SPRITES } from './config.js';
import type { Direction } from './types.js';

const KEY_MAP: Partial<Record<string, Direction>> = {
    ArrowLeft: 'left',
    ArrowUp: 'up',
    ArrowRight: 'right',
    ArrowDown: 'down',
};

document.addEventListener('keydown', e => {
    if (e.key in KEY_MAP) e.preventDefault();
});

document.addEventListener('keyup', e => {
    const player = getPlayer();
    const dir = KEY_MAP[e.key];
    if (player && dir) {
        player.handleInput(dir);
    }
});

document.getElementById('new-game-btn')!.addEventListener('click', init);

const charClassEl = document.getElementById('charClass')!;
SPRITES.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('click', () => {
        const player = getPlayer();
        if (player) player.sprite = src;
    });
    charClassEl.appendChild(img);
});
