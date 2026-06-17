import { describe, it, expect, beforeEach } from 'vitest';
import { Enemy } from './enemy.js';
import { NUM_COLS, TILE_WIDTH } from '../config.js';

describe('Enemy', () => {
    let enemy: Enemy;

    beforeEach(() => {
        enemy = new Enemy(1);
        // Pin to known state so tests are deterministic
        enemy.speed = 150;
        enemy.x = 0;
        enemy.xInTiles = 0;
    });

    describe('isOutOfBounds', () => {
        it('returns false when within grid', () => {
            enemy.xInTiles = 2;
            expect(enemy.isOutOfBounds()).toBe(false);
        });

        it('returns false at left edge (xInTiles === -1)', () => {
            enemy.xInTiles = -1;
            expect(enemy.isOutOfBounds()).toBe(false);
        });

        it('returns true when off the left side (xInTiles < -1)', () => {
            enemy.xInTiles = -2;
            expect(enemy.isOutOfBounds()).toBe(true);
        });

        it('returns false at right edge (xInTiles === NUM_COLS)', () => {
            enemy.xInTiles = NUM_COLS;
            expect(enemy.isOutOfBounds()).toBe(false);
        });

        it('returns true when off the right side (xInTiles > NUM_COLS)', () => {
            enemy.xInTiles = NUM_COLS + 1;
            expect(enemy.isOutOfBounds()).toBe(true);
        });
    });

    describe('update', () => {
        it('advances x by dt * speed each frame', () => {
            enemy.speed = 200;
            enemy.x = 0;
            enemy.update(0.5);
            expect(enemy.x).toBeCloseTo(100);
        });

        it('moves left when speed is negative', () => {
            enemy.speed = -200;
            enemy.x = 300;
            enemy.update(0.5);
            expect(enemy.x).toBeCloseTo(200);
        });

        it('updates xInTiles to match pixel position', () => {
            enemy.speed = TILE_WIDTH * 2; // 2 tiles per second
            enemy.x = 0;
            enemy.update(1);
            expect(enemy.xInTiles).toBe(Math.floor(enemy.x / TILE_WIDTH));
        });

        it('stays on assigned row', () => {
            enemy.update(0.1);
            expect(enemy.yInTiles).toBe(1);
        });
    });

    describe('randomizeSpeed', () => {
        it('sets a positive base speed', () => {
            enemy.randomizeSpeed(0);
            expect(enemy.speed).toBeGreaterThan(100);
        });

        it('scales speed with player score', () => {
            // Higher score → higher upper bound; run many times to confirm average rises
            const trials = 200;
            let sumLow = 0, sumHigh = 0;
            for (let i = 0; i < trials; i++) {
                enemy.randomizeSpeed(0);
                sumLow += enemy.speed;
                enemy.randomizeSpeed(10000);
                sumHigh += enemy.speed;
            }
            expect(sumHigh / trials).toBeGreaterThan(sumLow / trials);
        });
    });
});
