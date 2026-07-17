export type Direction = "up" | "down" | "left" | "right";

export interface Positioned {
  xInTiles: number;
  yInTiles: number;
}

export interface PlayerLike {
  lives: number;
  score: number;
}

export interface Collidable extends Positioned {
  onPickup(player: PlayerLike): void;
}
