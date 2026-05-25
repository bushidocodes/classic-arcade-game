import { init, getPlayer } from './engine.js';
import { SPRITES } from './config.js';

const KEY_MAP = {
    ArrowLeft: 'left',
    ArrowUp: 'up',
    ArrowRight: 'right',
    ArrowDown: 'down',
};

document.addEventListener('keyup', e => {
    const player = getPlayer();
    if (player && KEY_MAP[e.key]) {
        player.handleInput(KEY_MAP[e.key]);
    }
});

document.getElementById('new-game-btn').addEventListener('click', init);

const charClassEl = document.getElementById('charClass');
SPRITES.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('click', () => {
        const player = getPlayer();
        if (player) player.sprite = src;
    });
    charClassEl.appendChild(img);
});
