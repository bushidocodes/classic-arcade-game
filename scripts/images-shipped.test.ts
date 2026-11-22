import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { IMAGES_TO_LOAD, SPRITES } from "../src/config.js";

describe("sprite images ship from public/", () => {
  const paths = [...new Set([...IMAGES_TO_LOAD, ...SPRITES])];

  it("lists the images the game loads at runtime", () => {
    expect(paths.length).toBeGreaterThan(0);
    expect(paths.every((p) => p.startsWith("images/"))).toBe(true);
  });

  for (const path of paths) {
    it(`has public/${path}`, () => {
      expect(existsSync(`public/${path}`)).toBe(true);
    });
  }
});
