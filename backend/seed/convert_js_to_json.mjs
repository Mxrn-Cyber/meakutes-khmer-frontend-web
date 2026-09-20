// One-off helper: converts the old hardcoded frontend data files (ES module JS)
// into plain JSON so the Python migration script can read them.
//
// Usage:
//   node convert_js_to_json.mjs <path/to/tripsData.js> default tripsData.json
//   node convert_js_to_json.mjs <path/to/newsEvents.js> newsEvents newsEvents.json
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , inputPath, exportName, outputPath] = process.argv;

if (!inputPath || !exportName || !outputPath) {
  console.error(
    "Usage: node convert_js_to_json.mjs <input.js> <default|exportName> <output.json>"
  );
  process.exit(1);
}

const mod = await import(pathToFileURL(resolve(inputPath)).href);
const data = exportName === "default" ? mod.default : mod[exportName];

if (!data) {
  console.error(`Export "${exportName}" not found in ${inputPath}`);
  process.exit(1);
}

await writeFile(outputPath, JSON.stringify(data, null, 2));
console.log(`Wrote ${Array.isArray(data) ? data.length : 1} record(s) to ${outputPath}`);
