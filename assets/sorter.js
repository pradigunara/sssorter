import TripleSBiasSorter from "./TripleSBiasSorter.js";

import { memberData } from "./member-data.js";

const memberNames = Object.keys(memberData);
let sorter = new TripleSBiasSorter(memberNames, memberData);
let memberPicId = {};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function initMemberPic() {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  const picSet = isDarkMode ? `picSet${rand(3, 4)}` : `picSet${rand(1, 2)}`;
  memberPicId = {};
  for (const memberName of memberNames) {
    memberPicId[memberName] = memberData[memberName][picSet];
  }
}

// Preload images
function preloadImages() {
  for (const memberName of memberNames) {
    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = memberData[memberName][`picSet${i}`];
    }
  }
}

// Dark mode functionality
function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle("dark-mode");
  const themeToggleText = document.querySelector(".theme-toggle-text");
  const themeToggleIcon = document.querySelector(".theme-toggle-icon svg");

  // Update toggle text and icon
  if (isDarkMode) {
    themeToggleText.textContent = "Light Mode";
    themeToggleIcon.innerHTML =
      '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
  } else {
    themeToggleText.textContent = "#DarkMode";
    themeToggleIcon.innerHTML =
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  }

  // Save preference to localStorage
  localStorage.setItem("darkMode", isDarkMode);
  initMemberPic();
  showFinal({ skipIncrement: true });
}

// Check for saved theme preference on page load
document.addEventListener("DOMContentLoaded", function () {
  const savedDarkMode = localStorage.getItem("darkMode");
  initMemberPic();

  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
    document.querySelector(".theme-toggle-text").textContent = "Light Mode";
    document.querySelector(".theme-toggle-icon svg").innerHTML =
      '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
  }

  // Call preloadImages
  preloadImages();
});

function initList() {
  const memEmojis = memberNames.map((m) => memberData[m].emoji);
  const topEmojis = memEmojis.slice(0, 12).join(" ");
  const botEmojis = memEmojis.slice(12).join(" ");
  document.getElementById("member-emojis").innerHTML =
    `${topEmojis}<br/>${botEmojis}`;
  sorter.reset();
}

// Preload critical member images for first comparison
function preloadInitialImages() {
  const comparison = sorter.getCurrentComparison();
  if (comparison) {
    const { memberAName, memberBName } = comparison;

    // Preload all image sets for these members
    for (let i = 1; i <= 4; i++) {
      const picSet = `picSet${i}`;
      if (memberData[memberAName][picSet]) {
        const imgA = new Image();
        imgA.src = memberData[memberAName][picSet];
      }
      if (memberData[memberBName][picSet]) {
        const imgB = new Image();
        imgB.src = memberData[memberBName][picSet];
      }
    }
  }
}

function handleSort(preference) {
  if (sorter.isComplete()) return;

  if (preference === "A") {
    sorter.preferMemberA();
  } else if (preference === "B") {
    sorter.preferMemberB();
  } else {
    sorter.declareTie();
  }

  if (sorter.isComplete()) {
    const progress = sorter.getProgress();
    const heartCount = 5;
    const filledHearts = Math.floor(
      (progress.progressPercent / 100) * heartCount,
    );
    const heartDisplay =
      "♥".repeat(filledHearts) + "♡".repeat(heartCount - filledHearts);
    const str = `<strong>Gravity #${progress.currentQuestion}</strong><br>${heartDisplay} ${progress.progressPercent}% sorted`;
    document.getElementById("battleNumber").innerHTML = str;
    showResult();
  } else {
    // Pass the flag to showFinal - defer to allow interaction response to paint first
    requestAnimationFrame(() => {
      showFinal({ selectedFlag: preference });
    });
  }
}

function showResult({ full = false } = {}) {
  let ranking = 1;
  let sameRank = 1;
  let str = "";
  const listResult = [];
  const sortedMembers = sorter.getSortedMembers();

  const iterCount = full ? sortedMembers.length : sortedMembers.length / 2;

  str += "<div class='results-list'><h2>Bias Ranking Result</h2><ul>";
  for (let i = 0; i < iterCount; i++) {
    const mem = sortedMembers[i];
    const disp = `${mem}${memberData[mem].emoji}`;
    listResult.push(disp);

    str += "<li><span class='number'>" + ranking + "</span> " + disp + "</li>";

    if (i < iterCount - 1) {
      if (sorter.equal[i] == i + 1) {
        sameRank++;
      } else {
        ranking += sameRank;
        sameRank = 1;
      }
    }
  }

  str += "</ul>";
  document.getElementById("battleResult").innerHTML = str;
  document.getElementById("page-sorter").style.display = "none";

  document.getElementById("showMore").style.display = "inline";

  const shareText = `My %23tripleS Bias Ranking:%0A${listResult.join("%0A")}%0A> https://sssorter.pages.dev`;
  const tweetBtn = document.getElementById("tweet-button");

  tweetBtn.style.display = "inline-block";
  tweetBtn.href = `https://twitter.com/intent/tweet?text=${shareText}`;

  const sssongsBtn = document.getElementById("sssongs-button");
  sssongsBtn.style.display = "inline-block";
}

function toggleResult() {
  const showMoreText = document.getElementById("showMore").innerText;

  if (showMoreText === "Show More") {
    document.getElementById("showMore").innerText = "Show Less";
    showResult({ full: true });
  } else {
    document.getElementById("showMore").innerText = "Show More";
    showResult({ full: false });
  }
}

function showFinal({ skipIncrement = false, selectedFlag = "" } = {}) {
  if (!skipIncrement) {
    const progress = sorter.getProgress();
    const heartCount = 5;
    const filledHearts = Math.floor(
      (progress.progressPercent / 100) * heartCount,
    );
    const heartDisplay =
      "♥".repeat(filledHearts) + "♡".repeat(heartCount - filledHearts);
    var str0 = `<strong>Gravity #${progress.currentQuestion}</strong><br>${heartDisplay} ${progress.progressPercent}% sorted`;
    document.getElementById("battleNumber").innerHTML = str0;
  }

  const optionA = document.getElementById("optionA");
  const optionB = document.getElementById("optionB");

  const comparison = sorter.getCurrentComparison();

  // Get the member indices currently displayed in optionA and optionB
  // Use -1 as a default if the data attribute is not set (initial load)
  const currentMemberIndexA = parseInt(optionA.dataset.memberIndex, 10) || -1;
  const currentMemberIndexB = parseInt(optionB.dataset.memberIndex, 10) || -1;

  // Determine the next member indices
  const nextMemberIndexA = comparison.memberA;
  const nextMemberIndexB = comparison.memberB;

  // Determine the next content
  const nextContentA = toNameFace(comparison.memberAName);
  const nextContentB = toNameFace(comparison.memberBName);

  // Batch DOM cleanup operations
  optionA.classList.remove(
    "fade-out",
    "fade-in",
    "flip-out",
    "flip-in",
    "selected-glow",
  );
  optionA.style.cssText = ""; // Clear all inline styles at once

  optionB.classList.remove(
    "fade-out",
    "fade-in",
    "flip-out",
    "flip-in",
    "selected-glow",
  );
  optionB.style.cssText = ""; // Clear all inline styles at once

  if (selectedFlag === "") {
    // Initial state or tie (if tie were active) - batch all updates
    optionA.innerHTML = nextContentA;
    optionA.style.setProperty(
      "--member-color",
      memberData[comparison.memberAName].color,
    );
    optionA.dataset.memberIndex = nextMemberIndexA;
    optionA.style.visibility = "visible";
    optionA.style.opacity = 1;

    optionB.innerHTML = nextContentB;
    optionB.style.setProperty(
      "--member-color",
      memberData[comparison.memberBName].color,
    );
    optionB.dataset.memberIndex = nextMemberIndexB;
    optionB.style.visibility = "visible";
    optionB.style.opacity = 1;
    return; // Exit the function
  }

  // Apply initial animation states based on content change and selection
  // Compare the member indices to see if the content is changing
  const optionAContentChanged = currentMemberIndexA !== nextMemberIndexA;
  const optionBContentChanged = currentMemberIndexB !== nextMemberIndexB;

  if (optionAContentChanged) {
    optionA.classList.add("flip-out");
  } else {
    // optionA.classList.add("fade-out"); // Use fade for no content change
  }

  if (optionBContentChanged) {
    optionB.classList.add("flip-out");
  } else {
    // optionB.classList.add("fade-out"); // Use fade for no content change
  }

  // Add glow to the selected option
  if (selectedFlag === "A") {
    // Option A was selected
    optionA.classList.add("selected-glow");
  } else {
    // Option B was selected
    optionB.classList.add("selected-glow");
  }

  // Wait for the fade-out/flip-out transition to complete
  setTimeout(() => {
    // Batch DOM updates to prevent layout thrashing
    requestAnimationFrame(() => {
      // Update content and properties in batch
      optionA.innerHTML = nextContentA;
      optionA.style.setProperty(
        "--member-color",
        memberData[comparison.memberAName].color,
      );
      optionA.dataset.memberIndex = nextMemberIndexA;

      optionB.innerHTML = nextContentB;
      optionB.style.setProperty(
        "--member-color",
        memberData[comparison.memberBName].color,
      );
      optionB.dataset.memberIndex = nextMemberIndexB;

      // Apply animations after DOM updates
      if (optionAContentChanged) {
        optionA.classList.remove("flip-out");
        optionA.classList.add("flip-in");
      } else {
        optionA.classList.remove("fade-out");
        optionA.classList.add("fade-in");
      }

      if (optionBContentChanged) {
        optionB.classList.remove("flip-out");
        optionB.classList.add("flip-in");
      } else {
        optionB.classList.remove("fade-out");
        optionB.classList.add("fade-in");
      }
    });

    // After the second transition, remove the animation classes and glow
    setTimeout(() => {
      optionA.classList.remove("fade-in", "flip-in", "selected-glow");
      optionB.classList.remove("fade-in", "flip-in", "selected-glow");
      // Ensure final state is visible and not transformed
      optionA.style.opacity = 1;
      optionB.style.opacity = 1;
      optionA.style.transform = "rotateY(0deg)";
      optionB.style.transform = "rotateY(0deg)";
    }, 200); // Match the transition duration
  }, 200); // Match the transition duration
}

function toNameFace(mem) {
  const disp = `
    <div class='photocard-image-container'>
      <img src='${memberPicId[mem]}' alt='${mem}' class='photocard-image'/>
      <div class='member-badge'>${memberData[mem].sNumber}</div>
    </div>
    <div class='photocard-info'>
      <div class='member-name' style='color: ${memberData[mem].color};'>${mem} ${memberData[mem].emoji || ""}</div>
    </div>
  `;

  return disp;
}

document.addEventListener("DOMContentLoaded", () => {
  initMemberPic();
  initList();
  preloadInitialImages();
  showFinal();

  document
    .getElementById("optionA")
    .addEventListener("click", () => handleSort("A"));
  document
    .getElementById("optionB")
    .addEventListener("click", () => handleSort("B"));
  document
    .querySelector(".theme-toggle")
    .addEventListener("click", toggleDarkMode);
  document.getElementById("showMore").addEventListener("click", toggleResult);
});
