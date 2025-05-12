#!/usr/bin/env node

const fs = require("fs");
const https = require("https");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Configuration with default values
let args = {
  class: "Double", // First | Double | Special | Premier
  season: "Atom02", // AtomXX | BinaryXX | CreamXX | DivineXX | EverXX
  collectionNo: "314Z", // XXX + (Z | A)
};

// Member order from picSet1
const memberOrder = [
  "SeoYeon",
  "HyeRin",
  "JiWoo",
  "ChaeYeon",
  "YooYeon",
  "SooMin",
  "NaKyoung",
  "YuBin",
  "Kaede",
  "DaHyun",
  "Kotone",
  "YeonJi",
  "Nien",
  "SoHyun",
  "Xinyu",
  "Mayu",
  "Lynn",
  "JooBin",
  "HaYeon",
  "ShiOn",
  "ChaeWon",
  "Sullin",
  "SeoAh",
  "JiYeon",
];

// Function to fetch data from API
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

// Function to process data and create result
async function processData() {
  try {
    // Prompt user for configuration values
    console.log(
      "Please enter the following configuration values (or press Enter to use defaults):",
    );

    const classInput = await prompt(`Class (default: ${args.class}): `);
    if (classInput) args.class = classInput;

    const seasonInput = await prompt(`Season (default: ${args.season}): `);
    if (seasonInput) args.season = seasonInput;

    const collectionNoInput = await prompt(
      `Collection Number (default: ${args.collectionNo}): `,
    );
    if (collectionNoInput) args.collectionNo = collectionNoInput;

    console.log(`\nFetching data with the following configuration:`);
    console.log(`- Class: ${args.class}`);
    console.log(`- Season: ${args.season}`);
    console.log(`- Collection Number: ${args.collectionNo}`);

    const data = await fetchData();

    if (!data.objekts || !Array.isArray(data.objekts)) {
      throw new Error("Invalid data format: objekts array not found");
    }

    console.log(`\nFound ${data.objekts.length} objekts in the response.`);

    // Create a map of member names to their frontImage URLs
    const memberImageMap = {};

    data.objekts.forEach((objekt) => {
      if (objekt.member && objekt.frontImage) {
        memberImageMap[objekt.member] = objekt.frontImage.replace(
          "/original",
          "/2x",
        );
      }
    });

    // Create result object in the same order as picSet1
    const result = {};

    memberOrder.forEach((member) => {
      if (memberImageMap[member]) {
        result[member] = memberImageMap[member];
      } else {
        console.warn(`Warning: No image found for member ${member}`);
      }
    });

    // Write result to file
    const resultString = `var result = ${JSON.stringify(result, null, 2)};`;
    fs.writeFileSync("result.js", resultString);

    console.log("\nSuccessfully created result.js with image data");
    console.log(`Found images for ${Object.keys(result).length} members`);

    // Close readline interface
    rl.close();
  } catch (error) {
    console.error("Error:", error.message);
    rl.close();
    process.exit(1);
  }
}

// Run the script
processData();
