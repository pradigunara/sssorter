import TripleSBiasSorter from "./sorter-class.js";
import { memberData } from "./member-data.js";

// Optimization: preload initial member images
for (const member of [memberData.SeoYeon, memberData.JiYeon]) {
  for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = member[`picSet${i}`];
  }
}

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

// Preload images for the rest of the members
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

document.addEventListener("DOMContentLoaded", function () {
  initMemberPic();

  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
    document.querySelector(".theme-toggle-text").textContent = "Light Mode";
    document.querySelector(".theme-toggle-icon svg").innerHTML =
      '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
  }

  sorter.reset();
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

  const initialImg = document.querySelector(".photocard-image");
  if (initialImg.complete) {
    initialImg.classList.remove("is-loading");
    preloadImages();
  } else {
    initialImg.addEventListener("load", () => {
      initialImg.classList.remove("is-loading");
      preloadImages();
    });
  }
});

let isAnimating = false;

async function handleSort(preference) {
  if (sorter.isComplete() || isAnimating) return;
  isAnimating = true;
  document.body.classList.add("is-animating");

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
    // Pass the flag to showFinal and wait for animation to complete
    await showFinal({ selectedFlag: preference });
  }

  isAnimating = false;
  document.body.classList.remove("is-animating");
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

function updateProgressDisplay(progress) {
  const heartCount = 5;
  const filledHearts = Math.floor(
    (progress.progressPercent / 100) * heartCount,
  );
  const heartDisplay =
    "♥".repeat(filledHearts) + "♡".repeat(heartCount - filledHearts);
  const str = `<strong>Gravity #${progress.currentQuestion}</strong><br>${heartDisplay} ${progress.progressPercent}% sorted`;
  document.getElementById("battleNumber").innerHTML = str;
}

function updateOptionContent(optionElement, memberName, memberIndex) {
  optionElement.innerHTML = toNameFace(memberName);
  optionElement.style.setProperty(
    "--member-color",
    memberData[memberName].color,
  );
  optionElement.dataset.memberIndex = memberIndex;
}

function animateElement(element, ...animationClasses) {
  return new Promise((resolve) => {
    let resolved = false;
    const doResolve = () => {
      if (resolved) return;
      resolved = true;
      element.removeEventListener("transitionend", onAnimationEnd);
      resolve();
    };

    const onAnimationEnd = (e) => {
      if (e.target !== element) return;
      doResolve();
    };

    element.addEventListener("transitionend", onAnimationEnd);
    element.classList.add(...animationClasses);

    // Fallback if no transition triggers (CSS transition is 350ms, give it a tiny buffer)
    setTimeout(doResolve, 400);
  });
}

async function animateCardUpdate(
  card,
  nextMemberName,
  nextMemberIndex,
  isSelected,
  forceUpdate = false,
) {
  const currentMemberIndex =
    card.dataset.memberIndex != null
      ? parseInt(card.dataset.memberIndex, 10)
      : -1;
  const contentChanged = forceUpdate || currentMemberIndex !== nextMemberIndex;

  // 1. Cleanup old animation state
  card.classList.remove(
    "fade-out",
    "fade-in",
    "flip-out",
    "flip-in",
    "flip-ready",
    "selected-glow",
  );
  card.style.opacity = "";
  card.style.transform = "";

  // 2. Show selection glow immediately
  if (isSelected) {
    card.classList.add("selected-glow");
  }

  // 3. Animate the transition
  if (contentChanged && currentMemberIndex !== -1) {
    // Animate out
    await animateElement(card, "flip-out");
    card.classList.remove("selected-glow"); // Never inherit glow to new member

    // Swap content behind the scenes
    updateOptionContent(card, nextMemberName, nextMemberIndex);

    // Prep the start position for flipping in
    card.classList.remove("flip-out");
    card.classList.add("flip-ready");

    // Force browser to fully compute layout for flip-ready BEFORE we apply flip-in
    // We get bounding client rect to force a harder reflow than offsetWidth
    card.getBoundingClientRect();

    // Animate back in
    card.classList.remove("flip-ready");
    await animateElement(card, "flip-in");
  } else {
    // If the card didn't change (the winner) or it's the first load
    if (currentMemberIndex === -1) {
      // First load: instantly show
      updateOptionContent(card, nextMemberName, nextMemberIndex);
      card.style.visibility = "visible";
      card.style.opacity = 1;
    } else {
      // Winner: Just sit there and glow while the other card flips out and in.
      // Wait for exactly the time it takes the other card to finish so we
      // clean up our selected-glow exactly when the new card appears.
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
  }

  // 4. Final cleanup for the next round
  card.classList.remove("selected-glow", "flip-out", "flip-in", "flip-ready");
  card.style.opacity = "";
  card.style.transform = "";
}

async function showFinal({ skipIncrement = false, selectedFlag = "" } = {}) {
  if (!skipIncrement) {
    updateProgressDisplay(sorter.getProgress());
  }

  const optionA = document.getElementById("optionA");
  const optionB = document.getElementById("optionB");
  const comparison = sorter.getCurrentComparison();

  // If we are skipping the increment (like a theme toggle), we should force the
  // cards to re-render and flip even if the member data didn't change.
  const forceUpdate = skipIncrement;

  // Animate both cards independently but in parallel
  await Promise.all([
    animateCardUpdate(
      optionA,
      comparison.memberAName,
      comparison.memberA,
      selectedFlag === "A",
      forceUpdate,
    ),
    animateCardUpdate(
      optionB,
      comparison.memberBName,
      comparison.memberB,
      selectedFlag === "B",
      forceUpdate,
    ),
  ]);
}

function toNameFace(mem) {
  const disp = `
    <div class='photocard-image-container'>
      <img src='${memberPicId[mem]}' alt='${mem}' class='photocard-image' width="582" height="900"/>
      <div class='member-badge'>${memberData[mem].sNumber}</div>
    </div>
    <div class='photocard-info'>
      <div class='member-name' style='color: ${memberData[mem].color};'>${mem} ${memberData[mem].emoji || ""}</div>
    </div>
  `;

  return disp;
}
