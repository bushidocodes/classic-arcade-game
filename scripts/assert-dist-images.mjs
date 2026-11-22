import { existsSync, readdirSync } from "node:fs";

const dir = "dist/images";
if (!existsSync(dir)) {
  console.error("dist/images is missing; Vite did not copy public/images into the build.");
  process.exit(1);
}
const files = readdirSync(dir);
const required = [
  "char-cat-girl.png",
  "enemy-bug.png",
  "stone-block.png",
  "water-block.png",
  "grass-block.png",
  "Heart.png",
];
const missing = required.filter((name) => !files.includes(name));
if (missing.length) {
  console.error(`dist/images is missing: ${missing.join(", ")}`);
  process.exit(1);
}
console.log(`dist/images ok (${files.length} files)`);
