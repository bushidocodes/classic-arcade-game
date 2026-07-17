import { SPRITES } from "./config.js";
import { getPlayer, init } from "./engine.js";
import type { Direction } from "./types.js";

const KEY_MAP = new Map<string, Direction>([
  ["ArrowLeft", "left"],
  ["ArrowUp", "up"],
  ["ArrowRight", "right"],
  ["ArrowDown", "down"],
]);

document.addEventListener("keydown", (e) => {
  if (KEY_MAP.has(e.key)) e.preventDefault();
});

document.addEventListener("keyup", (e) => {
  const player = getPlayer();
  const dir = KEY_MAP.get(e.key);
  if (player && dir) {
    player.handleInput(dir);
  }
});

document.getElementById("new-game-btn")!.addEventListener("click", init);

const charClassEl = document.getElementById("charClass")!;
SPRITES.forEach((src) => {
  const img = document.createElement("img");
  img.src = src;
  img.addEventListener("click", () => {
    const player = getPlayer();
    if (player) player.sprite = src;
  });
  charClassEl.appendChild(img);
});
