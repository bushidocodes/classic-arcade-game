import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from './player.js';
import { NUM_ROWS, NUM_COLS } from '../config.js';

describe('Player', () => {
    let player;

    beforeEach(() => {
        player = new Player();
    });

    describe('moveToStart', () => {
        it('places player at column 2, row 5', () => {
            player.xInTiles = 0;
            player.yInTiles = 0;
            player.moveToStart();
            expect(player.xInTiles).toBe(2);
            expect(player.yInTiles).toBe(5);
        });
    });

    describe('handleInput', () => {
        it('moves up when not adjacent to water', () => {
            player.yInTiles = 3;
            player.handleInput('up');
            expect(player.yInTiles).toBe(2);
        });

        it('scores 100 and resets when moving up from row 1', () => {
            player.yInTiles = 1;
            player.handleInput('up');
            expect(player.score).toBe(100);
            expect(player.xInTiles).toBe(2);
            expect(player.yInTiles).toBe(5);
        });

        it('moves down when not at bottom edge', () => {
            player.yInTiles = 3;
            player.handleInput('down');
            expect(player.yInTiles).toBe(4);
        });

        it('does not move down past the bottom edge', () => {
            player.yInTiles = NUM_ROWS - 1;
            player.handleInput('down');
            expect(player.yInTiles).toBe(NUM_ROWS - 1);
        });

        it('moves left when not at left edge', () => {
            player.xInTiles = 2;
            player.handleInput('left');
            expect(player.xInTiles).toBe(1);
        });

        it('does not move left past the left edge', () => {
            player.xInTiles = 0;
            player.handleInput('left');
            expect(player.xInTiles).toBe(0);
        });

        it('moves right when not at right edge', () => {
            player.xInTiles = 2;
            player.handleInput('right');
            expect(player.xInTiles).toBe(3);
        });

        it('does not move right past the right edge', () => {
            player.xInTiles = NUM_COLS - 1;
            player.handleInput('right');
            expect(player.xInTiles).toBe(NUM_COLS - 1);
        });
    });

    describe('isHitByEnemy', () => {
        it('returns true when an enemy occupies the same tile', () => {
            player.xInTiles = 2;
            player.yInTiles = 2;
            const enemies = [{ xInTiles: 2, yInTiles: 2 }];
            expect(player.isHitByEnemy(enemies)).toBe(true);
        });

        it('returns false when no enemy shares the tile', () => {
            player.xInTiles = 2;
            player.yInTiles = 2;
            const enemies = [{ xInTiles: 3, yInTiles: 2 }, { xInTiles: 2, yInTiles: 3 }];
            expect(player.isHitByEnemy(enemies)).toBe(false);
        });

        it('returns false with an empty enemy list', () => {
            expect(player.isHitByEnemy([])).toBe(false);
        });

        it('only matches on exact tile — x differs', () => {
            player.xInTiles = 2;
            player.yInTiles = 2;
            const enemies = [{ xInTiles: 3, yInTiles: 2 }];
            expect(player.isHitByEnemy(enemies)).toBe(false);
        });

        it('only matches on exact tile — y differs', () => {
            player.xInTiles = 2;
            player.yInTiles = 2;
            const enemies = [{ xInTiles: 2, yInTiles: 1 }];
            expect(player.isHitByEnemy(enemies)).toBe(false);
        });
    });

    describe('pickedUpItem', () => {
        it('returns the item when player is on the same tile', () => {
            player.xInTiles = 1;
            player.yInTiles = 2;
            const item = { xInTiles: 1, yInTiles: 2 };
            expect(player.pickedUpItem([item])).toBe(item);
        });

        it('returns null when no item shares the tile', () => {
            player.xInTiles = 1;
            player.yInTiles = 2;
            const item = { xInTiles: 3, yInTiles: 2 };
            expect(player.pickedUpItem([item])).toBeNull();
        });

        it('returns null for an empty item list', () => {
            expect(player.pickedUpItem([])).toBeNull();
        });
    });

    describe('update', () => {
        it('loses a life and resets to start on enemy collision', () => {
            player.xInTiles = 2;
            player.yInTiles = 2;
            const enemies = [{ xInTiles: 2, yInTiles: 2 }];
            player.update(enemies, []);
            expect(player.lives).toBe(2);
            expect(player.xInTiles).toBe(2);
            expect(player.yInTiles).toBe(5);
        });

        it('lives do not drop below 0', () => {
            player.lives = 0;
            player.xInTiles = 2;
            player.yInTiles = 2;
            const enemies = [{ xInTiles: 2, yInTiles: 2 }];
            player.update(enemies, []);
            expect(player.lives).toBe(0);
        });

        it('calls onPickup and removes item from board when item is collected', () => {
            player.xInTiles = 1;
            player.yInTiles = 2;
            let pickupCalled = false;
            const item = {
                xInTiles: 1,
                yInTiles: 2,
                onPickup(p) { pickupCalled = true; p.score += 50; },
            };
            player.update([], [item]);
            expect(pickupCalled).toBe(true);
            expect(player.score).toBe(50);
            expect(item.xInTiles).toBe(-1);
            expect(item.yInTiles).toBe(-1);
        });
    });
});
