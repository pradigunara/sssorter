#!/usr/bin/env bun
/**
 * Fetch new member photocards from apollo.cafe and update member-data.js.
 *
 * Usage: bun scripts/pic-updater.js [season] [collectionNo] [picSet]
 *   season       e.g. Binary02 (default: Binary02)
 *   collectionNo e.g. 301A (default: 301A)
 *   picSet       e.g. picSet1 (default: picSet1)
 *
 * After running, execute `bun scripts/fetch-images.js` to download + optimize.
 */

import fs from "fs";
import readline from "readline";
import { execSync } from "child_process";
import { join } from "path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

async function getConfig() {
  const args = {
    season: process.argv[2],
    collectionNo: process.argv[3],
    picSet: process.argv[4],
  };

  if (Object.values(args).some((arg) => arg === undefined)) {
    console.log("Enter values (or press Enter for defaults):");
    args.season = (await prompt(`Season (default: Binary02): `)) || "Binary02";
    args.collectionNo =
      (await prompt(`Collection Number (default: 301A): `)) || "301A";
    args.picSet =
      (await prompt(`Picture Set (default: picSet1): `)) || "picSet1";
  }

  return args;
}

async function processData() {
  try {
    const args = await getConfig();

    console.log("\nFetching data from apollo.cafe...");
    console.log(`- Season: ${args.season}`);
    console.log(`- Collection: ${args.collectionNo}`);
    console.log(`- Picture Set: ${args.picSet}`);

    const html = await fetchPage(args.season, args.collectionNo);
    const memberImageMap = parseDehydratedData(html);

    if (Object.keys(memberImageMap).length === 0) {
      throw new Error("No member images found in page data");
    }

    console.log(`\nFound ${Object.keys(memberImageMap).length} member images.`);
    for (const [m, url] of Object.entries(memberImageMap)) {
      console.log(`  ${m}: ${url.substring(0, 60)}...`);
    }

    const sorterFilePath = "assets/member-data.js";
    let sorterContent = fs.readFileSync(sorterFilePath, "utf8");

    const startMarker = "export const memberData = ";
    const start = sorterContent.indexOf(startMarker);
    if (start === -1)
      throw new Error("Could not find memberData in member-data.js");

    let depth = 0;
    let end = -1;
    for (let i = start + startMarker.length; i < sorterContent.length; i++) {
      if (sorterContent[i] === "{") depth++;
      else if (sorterContent[i] === "}") {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    if (end === -1) throw new Error("Could not find end of memberData object");

    const jsObj = sorterContent.substring(start + startMarker.length, end);
    const memberData = new Function(`return (${jsObj})`)();

    const sanitize = (name) => name.replace(/[^a-zA-Z0-9]/g, "");

    let updatedCount = 0;
    for (const member in memberImageMap) {
      if (memberData[member]) {
        const existing = memberData[member][args.picSet];
        const oldUrl =
          existing && typeof existing === "object"
            ? existing.originalUrl
            : existing;

        if (oldUrl && oldUrl !== memberImageMap[member]) {
          const memberDir = join("public/members", sanitize(member));
          for (const suffix of ["1x", "2x"]) {
            const localFile = join(memberDir, `${args.picSet}-${suffix}.webp`);
            if (fs.existsSync(localFile)) {
              fs.unlinkSync(localFile);
              console.log(`  [stale] deleted ${localFile}`);
            }
          }
        }

        memberData[member][args.picSet] = { originalUrl: memberImageMap[member] };
        updatedCount++;
      } else {
        console.warn(`Warning: "${member}" not found in member-data.js`);
      }
    }

    const newMemberDataString = JSON.stringify(memberData, null, 2).replace(
      /"(\w+)":/g,
      "$1:",
    );
    const newContent =
      sorterContent.substring(0, start + startMarker.length) +
      newMemberDataString +
      ";\n";

    fs.writeFileSync(sorterFilePath, newContent);

    console.log(`\nUpdated ${updatedCount} members in ${sorterFilePath}`);

    console.log(`\nFormatting with Prettier...`);
    execSync(`npx prettier --write ${sorterFilePath}`);
    console.log("Done.");

    console.log(
      `\nNext: run \`bun scripts/fetch-images.js\` to download + optimize new images.`,
    );

    rl.close();
  } catch (error) {
    console.error("Error:", error.message);
    rl.close();
    process.exit(1);
  }
}

function fetchPage(season, collectionNo) {
  const params = new URLSearchParams({ artist: "tripleS" });
  if (season) params.set("season", `["${season}"]`);
  if (collectionNo) params.set("collectionNo", `["${collectionNo}"]`);
  const url = `https://apollo.cafe/?${params.toString()}`;

  return fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" }).then(
    (res) => res.text(),
  );
}

function parseDehydratedData(html) {
  const map = {};

  const memberRegex = /member:"([^"]+)"/g;
  const imageRegex = /frontImage:"([^"]+)"/g;

  const members = [];
  const images = [];

  let m;
  while ((m = memberRegex.exec(html)) !== null) {
    members.push({ name: m[1], pos: m.index });
  }

  let i;
  while ((i = imageRegex.exec(html)) !== null) {
    images.push({ url: i[1], pos: i.index });
  }

  for (const member of members) {
    let bestImage = null;
    let bestDist = Infinity;
    for (const image of images) {
      const dist = Math.abs(image.pos - member.pos);
      if (dist < bestDist && dist < 5000) {
        bestDist = dist;
        bestImage = image.url;
      }
    }
    if (bestImage) {
      map[member.name] = bestImage.replace("/original", "/2x");
    }
  }

  return map;
}

processData();
