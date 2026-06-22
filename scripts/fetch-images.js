#!/usr/bin/env bun
/**
 * Download + optimize all member images for local bundling.
 *
 * Resizes to 400 / 582 px webp via Bun.Image.
 *
 * WebP tuning (env):
 *   WEBP_QUALITY_400  default 73
 *   WEBP_QUALITY_582  default 76 (alias WEBP_QUALITY_2X)
 *   WEBP_EFFORT       default 5
 *
 * Re-encode all locals:  bun scripts/fetch-images.js --force
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "fs";
import { resolve, join } from "path";
import { pathToFileURL } from "url";
import {
  PHOTO_WIDTHS,
  PHOTO_QUALITY,
  WEBP_EFFORT,
  localPhotoPath,
  photoFileName,
} from "./photo-widths.js";

const ROOT = resolve(import.meta.dirname, "..");
const DATA_FILE = resolve(ROOT, "assets/member-data.js");
const OUT_DIR = resolve(ROOT, "public/members");

const { memberData } = await import(pathToFileURL(DATA_FILE).href);

const PIC_SETS = ["picSet1", "picSet2", "picSet3", "picSet4"];
const FORCE = process.argv.includes("--force") || process.env.FORCE === "1";

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

async function processImage(bytes, width, outFile, quality) {
  await new Bun.Image(bytes)
    .resize(width, undefined, { fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: WEBP_EFFORT })
    .write(outFile);
}

function picSetCompleteOnDisk(member, picSet) {
  const folder = sanitize(member);
  for (const width of PHOTO_WIDTHS) {
    const f = join(OUT_DIR, folder, photoFileName(picSet, width));
    if (!existsSync(f)) return false;
  }
  return true;
}

function buildLocalPaths(member, picSet) {
  const folder = sanitize(member);
  const paths = {};
  for (const width of PHOTO_WIDTHS) {
    paths[width] = localPhotoPath(folder, picSet, width);
  }
  return paths;
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const qLog = PHOTO_WIDTHS.map((w) => `${w}px q=${PHOTO_QUALITY[w]}`).join(
    ", ",
  );
  console.log(`WebP: ${qLog}, effort=${WEBP_EFFORT}${FORCE ? ", --force" : ""}`);

  const members = Object.keys(memberData);
  let done = 0;
  let skipped = 0;
  let synced = 0;
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

      if (!FORCE && picSetCompleteOnDisk(member, picSet)) {
        const paths = buildLocalPaths(member, picSet);
        const needsSync =
          !entry.local400 ||
          entry.local400 !== paths[400] ||
          entry.local582 !== paths[582];
        if (needsSync) {
          data[picSet] = {
            originalUrl,
            local400: paths[400],
            local582: paths[582],
          };
          synced++;
        } else {
          skipped++;
        }
        continue;
      }

      let ok = true;
      let bytes;

      try {
        bytes = await fetchBytes(originalUrl);
      } catch (err) {
        console.error(`  [fail] ${member}.${picSet}: ${err.message}`);
        failed++;
        continue;
      }

      const encoded = [];
      for (const width of PHOTO_WIDTHS) {
        const outFile = join(memberDir, photoFileName(picSet, width));

        try {
          await processImage(bytes, width, outFile, PHOTO_QUALITY[width]);
          encoded.push(width);
        } catch (err) {
          console.error(
            `  [fail] ${member}.${picSet}-${width}: ${err.message}`,
          );
          ok = false;
          failed++;
          break;
        }
      }

      if (!ok) {
        for (const width of encoded) {
          const partial = join(memberDir, photoFileName(picSet, width));
          try {
            unlinkSync(partial);
          } catch {
            /* ignore */
          }
        }
        continue;
      }

      const paths = buildLocalPaths(member, picSet);
      data[picSet] = {
        originalUrl,
        local400: paths[400],
        local582: paths[582],
      };
      done++;
      if (done % 10 === 0) console.log(`  ...processed ${done} images`);
    }
  }

  if (done === 0 && synced === 0) {
    console.log(
      `\nDone: ${done} picSets processed, ${skipped} skipped, ${synced} metadata synced, ${failed} failed.`,
    );
    console.log(`No changes to ${DATA_FILE}`);
    return;
  }

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

  const tail = source.slice(end).replace(/^\s*;\s*/, "");
  const newContent =
    source.substring(0, start + startMarker.length) +
    JSON.stringify(memberData, null, 2) +
    (tail ? `;\n${tail}` : ";\n");

  writeFileSync(DATA_FILE, newContent);

  console.log(
    `\nDone: ${done} picSets processed, ${skipped} skipped, ${synced} metadata synced, ${failed} failed.`,
  );
  console.log(`Updated ${DATA_FILE}`);
  console.log(`Run: npx prettier --write ${DATA_FILE}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});