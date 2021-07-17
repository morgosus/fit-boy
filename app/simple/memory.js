import { memory } from "system";

export function log() {
  console.log(`JS memory: ${memory.js.used} / ${memory.js.total}, peak: ${memory.js.peak}.`);
}