#!/usr/bin/env bun
/**
 * Download + optimize all member images for local bundling.
 *
 * Resizes to 1x (340px) and 2x (582px) webp via Bun.Image.
 *
 * WebP tuning (env):
 *   WEBP_QUALITY_1X  default 76 — mobile slot (~340w display)
 *   WEBP_QUALITY_2X  default 80 — retina / wider cards
 *   WEBP_EFFORT      default 5  — encoder effort (higher = smaller, slower)
 *
 * Re-encode all locals:  bun scripts/fetch-images.js --force
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import { pathToFileURL } from "url";

const ROOT = resolve(import.meta.dirname, "..");
const DATA_FILE = resolve(ROOT, "assets/member-data.js");
const OUT_DIR = resolve(ROOT, "public/members");

const { memberData } = await import(pathToFileURL(DATA_FILE).href);

const PIC_SETS = ["picSet1", "picSet2", "picSet3", "picSet4"];
const SIZES = { "1x": 340, "2x": 582 };
const WEBP_1X = Number(process.env.WEBP_QUALITY_1X ?? 76);
const WEBP_2X = Number(process.env.WEBP_QUALITY_2X ?? 80);
const WEBP_EFFORT = Number(process.env.WEBP_EFFORT ?? 5);
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

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  console.log(
    `WebP: 1x q=${WEBP_1X} @ ${SIZES["1x"]}px, 2x q=${WEBP_2X} @ ${SIZES["2x"]}px, effort=${WEBP_EFFORT}${FORCE ? ", --force" : ""}`,
  );

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

      if (
        !FORCE &&
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
      let bytes;

      try {
        bytes = await fetchBytes(originalUrl);
      } catch (err) {
        console.error(`  [fail] ${member}.${picSet}: ${err.message}`);
        failed++;
        continue;
      }

      for (const [suffix, width] of Object.entries(SIZES)) {
        const outFile = join(memberDir, `${picSet}-${suffix}.webp`);
        const quality = suffix === "1x" ? WEBP_1X : WEBP_2X;

        try {
          await processImage(bytes, width, outFile, quality);
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
