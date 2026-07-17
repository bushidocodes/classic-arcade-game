import { beforeEach, describe, expect, it } from "vitest";
import { NUM_COLS, NUM_ROWS } from "../config.js";
import { BlueGem, GreenGem, Heart, Item, OrangeGem } from "./item.js";

describe("Item", () => {
  describe("randomizeLocation", () => {
    it("places item within grid columns", () => {
      const item = new Item();
      for (let i = 0; i < 50; i++) {
        item.randomizeLocation();
        expect(item.xInTiles).toBeGreaterThanOrEqual(0);
        expect(item.xInTiles).toBeLessThan(NUM_COLS);
      }
    });

    it("places item only in enemy lanes (rows 1–3)", () => {
      const item = new Item();
      for (let i = 0; i < 50; i++) {
        item.randomizeLocation();
        expect(item.yInTiles).toBeGreaterThanOrEqual(1);
        expect(item.yInTiles).toBeLessThanOrEqual(NUM_ROWS - 3);
      }
    });
  });
});

describe("Heart", () => {
  let player: { lives: number; score: number };

  beforeEach(() => {
    player = { lives: 3, score: 0 };
  });

  it("increments lives by 1 on pickup", () => {
    const heart = new Heart();
    heart.onPickup(player);
    expect(player.lives).toBe(4);
  });

  it("does not exceed 9 lives", () => {
    player.lives = 9;
    const heart = new Heart();
    heart.onPickup(player);
    expect(player.lives).toBe(9);
  });
});

describe("BlueGem", () => {
  it("adds 50 to score on pickup", () => {
    const player = { score: 0, lives: 0 };
    new BlueGem().onPickup(player);
    expect(player.score).toBe(50);
  });
});

describe("OrangeGem", () => {
  it("adds 100 to score on pickup", () => {
    const player = { score: 0, lives: 0 };
    new OrangeGem().onPickup(player);
    expect(player.score).toBe(100);
  });
});

describe("GreenGem", () => {
  it("adds 150 to score on pickup", () => {
    const player = { score: 0, lives: 0 };
    new GreenGem().onPickup(player);
    expect(player.score).toBe(150);
  });
});
