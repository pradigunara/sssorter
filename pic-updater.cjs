#!/usr/bin/env node

const fs = require("fs");
const https = require("https");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

let args = {
  class: "Double",
  season: "Atom02",
  collectionNo: "314Z",
  picSet: "picSet1",
};

async function processData() {
  try {
    console.log(
      "Please enter the following configuration values (or press Enter to use defaults):"
    );

    const classInput = await prompt(`Class (default: ${args.class}): `);
    if (classInput) args.class = classInput;

    const seasonInput = await prompt(`Season (default: ${args.season}): `);
    if (seasonInput) args.season = seasonInput;

    const collectionNoInput = await prompt(
      `Collection Number (default: ${args.collectionNo}): `
    );
    if (collectionNoInput) args.collectionNo = collectionNoInput;

    const picSetInput = await prompt(
      `Picture Set to update (default: ${args.picSet}): `
    );
    if (picSetInput) args.picSet = picSetInput;

    console.log(`
Fetching data with the following configuration:`);
    console.log(`- Class: ${args.class}`);
    console.log(`- Season: ${args.season}`);
    console.log(`- Collection Number: ${args.collectionNo}`);
    console.log(`- Picture Set: ${args.picSet}`);

    const data = await fetchData();

    if (!data.objekts || !Array.isArray(data.objekts)) {
      throw new Error("Invalid data format: objekts array not found");
    }

    console.log(`
Found ${data.objekts.length} objekts in the response.`);

    const memberImageMap = {};
    data.objekts.forEach((objekt) => {
      if (objekt.member && objekt.frontImage) {
        memberImageMap[objekt.member] = objekt.frontImage.replace(
          "/original",
          "/2x"
        );
      }
    });

    const sorterFilePath = "assets/sorter.js";
    let sorterContent = fs.readFileSync(sorterFilePath, "utf8");

    let updatedCount = 0;
    for (const member in memberImageMap) {
      if (memberImageMap.hasOwnProperty(member)) {
        const imageUrl = memberImageMap[member];
        const regex = new RegExp(
          `(${member}:\s*{[\s\S]*?${args.picSet}:\s*")[^"]*(")`
        );
        if (regex.test(sorterContent)) {
          sorterContent = sorterContent.replace(regex, `$1${imageUrl}$2`);
          updatedCount++;
        } else {
          console.warn(`Warning: Could not find ${args.picSet} for member ${member} in ${sorterFilePath}`);
        }
      }
    }

    fs.writeFileSync(sorterFilePath, sorterContent);

    console.log(`
Successfully updated ${sorterFilePath}`);
    console.log(`Updated images for ${updatedCount} members`);

    rl.close();
  } catch (error) {
    console.error("Error:", error.message);
    rl.close();
    process.exit(1);
  }
}

function fetchData() {
  return new Promise((resolve, reject) => {
    const url = `https://apollo.cafe/api/objekts?sort=newest&class=${args.class}&season=${args.season}&collectionNo=${args.collectionNo}&page=0`;

    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

processData();