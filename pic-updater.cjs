#!/usr/bin/env node

const fs = require("fs");
const https = require("https");
const readline = require("readline");
const { execSync } = require("child_process");

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

async function getConfig() {
  const args = {
    class: process.argv[2],
    season: process.argv[3],
    collectionNo: process.argv[4],
    picSet: process.argv[5],
  };

  if (Object.values(args).some((arg) => arg === undefined)) {
    console.log(
      "Please enter the following configuration values (or press Enter to use defaults):",
    );
    args.class = (await prompt(`Class (default: Double): `)) || "Double";
    args.season = (await prompt(`Season (default: Binary02): `)) || "Binary02";
    args.collectionNo =
      (await prompt(`Collection Number (default: 301A): `)) || "301A";
    args.picSet =
      (await prompt(`Picture Set to update (default: picSet1): `)) || "picSet1";
  }

  return args;
}

async function processData() {
  try {
    const args = await getConfig();

    console.log(`
Fetching data with the following configuration:`);
    console.log(`- Class: ${args.class}`);
    console.log(`- Season: ${args.season}`);
    console.log(`- Collection Number: ${args.collectionNo}`);
    console.log(`- Picture Set: ${args.picSet}`);

    const data = await fetchData(args);

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
          "/2x",
        );
      }
    });

    const sorterFilePath = "assets/member-data.js";
    const { memberData } = await import(`./assets/member-data.js`);

    let updatedCount = 0;
    for (const member in memberImageMap) {
      if (memberImageMap.hasOwnProperty(member)) {
        if (memberData[member]) {
          memberData[member][args.picSet] = memberImageMap[member];
          updatedCount++;
        } else {
          console.warn(`Warning: No data found for member ${member}`);
        }
      }
    }

    const newMemberDataString = JSON.stringify(memberData, null, 2).replace(
      /"(\w+)":/g,
      "$1:",
    );
    let sorterContent = fs.readFileSync(sorterFilePath, "utf8");
    const memberDataRegex = /export const memberData = ({[^;]*});/;
    sorterContent = sorterContent.replace(
      memberDataRegex,
      `export const memberData = ${newMemberDataString};`,
    );

    fs.writeFileSync(sorterFilePath, sorterContent);

    console.log(`
Successfully updated ${sorterFilePath}`);
    console.log(`Updated images for ${updatedCount} members`);

    console.log(`
Formatting ${sorterFilePath} with Prettier...`);
    execSync(`npx prettier --write ${sorterFilePath}`);
    console.log("Formatting complete.");

    rl.close();
  } catch (error) {
    console.error("Error:", error.message);
    rl.close();
    process.exit(1);
  }
}

function fetchData(args) {
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
