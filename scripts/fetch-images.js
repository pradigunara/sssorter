#!/usr/bin/env bun
/**
 * Download + optimize all member images for local bundling.
 *
 * Reads assets/member-data.js, downloads each picSet's originalUrl,
 * resizes to 1x (340px) and 2x (680px) webp via Bun.Image,
 * writes to public/members/{member}/{picSet}-{1x|2x}.webp,
 * and updates member-data.js picSet values to local paths.
 *
 * Usage: bun scripts/fetch-images.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import { pathToFileURL } from "url";

const ROOT = resolve(import.meta.dirname, "..");
const DATA_FILE = resolve(ROOT, "assets/member-data.js");
const OUT_DIR = resolve(ROOT, "public/members");

const { memberData } = await import(pathToFileURL(DATA_FILE).href);

const PIC_SETS = ["picSet1", "picSet2", "picSet3", "picSet4"];
const SIZES = { "1x": 340, "2x": 680 };

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9]/g, "");
}

async function fetchBytes(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return new Uint8Array(await res.arrayBuffer());
}

async function processImage(bytes, width, outFile) {
  await new Bun.Image(bytes)
    .resize(width, undefined, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .write(outFile);
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const members = Object.keys(memberData);
  let done = 0;
  let skipped = 0;
  let failed = 0;

  for (const member of members) {
    const memberDir = join(OUT_DIR, sanitize(member));
    const data = memberData[member];
    if (!data) continue;

    if (!existsSync(memberDir)) mkdirSync(memberDir, { recursive: true });

    for (const picSet of PIC_SETS) {
      const entry = data[picSet];
      if (!entry) {
        console.warn(`  [skip] ${member}.${picSet}: missing`);
        skipped++;
        continue;
      }

      const originalUrl =
        typeof entry === "string" ? entry : entry.originalUrl || entry;
      if (!originalUrl || typeof originalUrl !== "string") {
        console.warn(`  [skip] ${member}.${picSet}: no originalUrl`);
        skipped++;
        continue;
      }

      // Skip if already processed (local1x/local2x present)
      if (
        typeof entry === "object" &&
        entry.local1x &&
        entry.local2x &&
        existsSync(join(OUT_DIR, sanitize(member), `${picSet}-1x.webp`)) &&
        existsSync(join(OUT_DIR, sanitize(member), `${picSet}-2x.webp`))
      ) {
        skipped++;
        continue;
      }

      const localPaths = {};
      let ok = true;

      for (const [suffix, width] of Object.entries(SIZES)) {
        const outFile = join(memberDir, `${picSet}-${suffix}.webp`);

        try {
          const bytes = await fetchBytes(originalUrl);
          await processImage(bytes, width, outFile);
          localPaths[suffix] = `/members/${sanitize(member)}/${picSet}-${suffix}.webp`;
        } catch (err) {
          console.error(
            `  [fail] ${member}.${picSet}-${suffix}: ${err.message}`,
          );
          ok = false;
          failed++;
          break;
        }
      }

      if (ok) {
        data[picSet] = {
          originalUrl,
          local1x: localPaths["1x"],
          local2x: localPaths["2x"],
        };
        done++;
        if (done % 10 === 0) console.log(`  ...processed ${done} images`);
      }
    }
  }

  // Rewrite member-data.js with updated picSet objects
  const source = readFileSync(DATA_FILE, "utf8");
  const startMarker = "export const memberData = ";
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error("Could not find memberData in member-data.js");

  let depth = 0;
  let end = -1;
  for (let i = start + startMarker.length; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error("Could not find end of memberData object");

  const newContent =
    source.substring(0, start + startMarker.length) +
    JSON.stringify(memberData, null, 2) +
    ";\n";

  writeFileSync(DATA_FILE, newContent);

  console.log(
    `\nDone: ${done} picSets processed, ${skipped} skipped, ${failed} failed.`,
  );
  console.log(`Updated ${DATA_FILE}`);
  console.log(`Run: npx prettier --write ${DATA_FILE}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
