#!/usr/bin/env bun
/**
 * Move to 400 + 582 tiers: encode missing 400w from 480/582/340, drop 340/480 files,
 * rewrite member-data local400 / local582.
 *
 *   bun scripts/retire-photo-widths.js
 *   bun scripts/retire-photo-widths.js --force-400   # re-encode all 400w from best source
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  unlinkSync,
  renameSync,
} from "fs";
import { resolve, join } from "path";
import { pathToFileURL } from "url";
import {
  PHOTO_QUALITY,
  WEBP_EFFORT,
  RETIRED_PHOTO_WIDTHS,
  localPhotoPath,
  photoFileName,
} from "./photo-widths.js";

const ROOT = resolve(import.meta.dirname, "..");
const DATA_FILE = resolve(ROOT, "assets/member-data.js");
const OUT_DIR = resolve(ROOT, "public/members");
const FORCE_400 = process.argv.includes("--force-400");

const { memberData } = await import(pathToFileURL(DATA_FILE).href);

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9]/g, "");
}
async function encode400ToFile(srcPath, destPath) {
  const bytes = readFileSync(srcPath);
  await new Bun.Image(bytes)
    .resize(400, undefined, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: PHOTO_QUALITY[400], effort: WEBP_EFFORT })
    .write(destPath);
}

let encoded400 = 0;
let renamed582 = 0;
let removed = 0;

for (const member of Object.keys(memberData)) {
  const folder = sanitize(member);
  const memberDir = join(OUT_DIR, folder);
  if (!existsSync(memberDir)) continue;

  for (const picSet of ["picSet1", "picSet2", "picSet3", "picSet4"]) {
    const w400 = join(memberDir, photoFileName(picSet, 400));
    const w582 = join(memberDir, photoFileName(picSet, 582));
    const w480 = join(memberDir, photoFileName(picSet, 480));
    const w340 = join(memberDir, photoFileName(picSet, 340));
    const legacy582 = join(memberDir, `${picSet}-2x.webp`);

    if (!existsSync(w582)) {
      if (existsSync(legacy582)) {
        renameSync(legacy582, w582);
        renamed582++;
      } else if (existsSync(w480)) {
        renameSync(w480, w582);
        renamed582++;
      }
    }

    const need400 =
      FORCE_400 || !existsSync(w400);
    if (need400) {
      let src = null;
      if (existsSync(w480)) src = w480;
      else if (existsSync(w582)) src = w582;
      else if (existsSync(w340)) src = w340;
      if (src) {
        await encode400ToFile(src, w400);
        encoded400++;
      }
    }

    for (const w of RETIRED_PHOTO_WIDTHS) {
      const f = join(memberDir, photoFileName(picSet, w));
      if (existsSync(f)) {
        unlinkSync(f);
        removed++;
      }
    }

    const entry = memberData[member][picSet];
    if (!entry || typeof entry !== "object") continue;
    if (!existsSync(w400) || !existsSync(w582)) continue;

    entry.local400 = localPhotoPath(folder, picSet, 400);
    entry.local582 = localPhotoPath(folder, picSet, 582);
    delete entry.local340;
    delete entry.local480;
    delete entry.local1x;
    delete entry.local2x;
  }
}

const source = readFileSync(DATA_FILE, "utf8");
const startMarker = "export const memberData = ";
const start = source.indexOf(startMarker);
if (start === -1) throw new Error("Could not find memberData");

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
if (end === -1) throw new Error("Could not find end of memberData");

const tail = source.slice(end).replace(/^\s*;\s*/, "");
writeFileSync(
  DATA_FILE,
  source.substring(0, start + startMarker.length) +
    JSON.stringify(memberData, null, 2) +
    (tail ? `;\n${tail}` : ";\n"),
);

console.log(
  `400w encoded: ${encoded400}, 582 renamed: ${renamed582}, retired files removed: ${removed}`,
);
console.log(`Updated ${DATA_FILE}`);
console.log("Run: npx prettier --write assets/member-data.js");