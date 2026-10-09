import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODULE_FILES = [
  "conversation-engine.js",
  "world-registry.js",
  "educational-content.js",
  "dialogue-content.js",
  "adventure-data.js",
  "mission-distribution.js"
];

/**
 * Load the game's plain ESM registries from a temporary module tree.
 * This keeps normal relative imports intact and avoids recursively nested,
 * oversized data: URLs in Node's test runner.
 */
export async function loadKitCityModules() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "kitcity-registry-"));
  try {
    for (const file of MODULE_FILES) {
      let source = await readFile(path.join(root, "game", file), "utf8");
      source = source.replace(/(["']\.\/[^"']+)\.js(["'])/g, "$1.mjs$2");
      await writeFile(path.join(directory, file.replace(/\.js$/, ".mjs")), source, "utf8");
    }
    const load = file => import(pathToFileURL(path.join(directory, file + ".mjs")).href);
    const [engine, world, education, content, distribution] = await Promise.all([
      load("conversation-engine"),
      load("world-registry"),
      load("educational-content"),
      load("dialogue-content"),
      load("mission-distribution")
    ]);
    return {
      engine, world, education, content, distribution,
      cleanup: () => rm(directory, { recursive: true, force: true })
    };
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}
