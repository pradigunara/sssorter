import TripleSBiasSorter from "./sorter-class.js";
import { memberData } from "./member-data.js";
import { html } from "./lib/html.js";
import { renderCard, renderProgressHeader, renderResultPage } from "./lib/components.js";
import { initTheme } from "./lib/theme.js";
import { animateCardUpdate } from "./lib/animations.js";
import { initAuth, isLoggedInUser, hideSigninIfUnconfigured } from "./lib/auth.js";
import * as history from "./lib/history.js";
import { saveRanking, loadAllRankings } from "./supabase.js";

const memberNames = Object.keys(memberData);
let sorter = new TripleSBiasSorter(memberNames, memberData);
let memberPicId = {};
let showingFullResults = false;
let isAnimating = false;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// --- Element cache ---

let els = {};

function cacheElements() {
  els.optionA = document.getElementById("optionA");
  els.optionB = document.getElementById("optionB");
  els.battleNumber = document.getElementById("battleNumber");
  els.battleResult = document.getElementById("battleResult");
  els.pageSorter = document.getElementById("page-sorter");
  els.pageResult = document.getElementById("page-result");
  els.showMore = document.getElementById("showMore");
  els.tweetButton = document.getElementById("tweet-button");
  els.sssongsButton = document.getElementById("sssongs-button");
  els.themeToggleText = document.querySelector(".theme-toggle-text");

  els.authButtons = document.getElementById("auth-buttons");
  els.authUser = document.getElementById("auth-user");
  els.authUsername = document.getElementById("auth-username");
  els.btnUserMenu = document.getElementById("btn-user-menu");
  els.userDropdown = document.getElementById("user-dropdown");
  els.btnHistory = document.getElementById("btn-history");
  els.btnSignin = document.getElementById("btn-signin");
  els.btnSigninX = document.getElementById("btn-signin-x");
  els.btnSigninDiscord = document.getElementById("btn-signin-discord");
  els.btnSignout = document.getElementById("btn-signout");
  els.authDropdown = document.getElementById("auth-dropdown");

  els.chartModal = document.getElementById("chart-modal");
  els.chartModalContent = document.getElementById("chart-modal-content");
  els.btnChartClose = document.getElementById("btn-chart-close");

  els.historyPage = document.getElementById("history-page");
  els.historyChart = document.getElementById("history-chart");
  els.historyResult = document.getElementById("history-result");
  els.btnHistoryBack = document.getElementById("btn-history-back");
}

// --- Member pics ---

function initMemberPic() {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  const picSet = isDarkMode ? `picSet${rand(3, 4)}` : `picSet${rand(1, 2)}`;
  memberPicId = {};
  for (const memberName of memberNames) {
    memberPicId[memberName] = memberData[memberName][picSet];
  }
}

function preloadImages() {
  for (const memberName of memberNames) {
    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = memberData[memberName][`picSet${i}`];
    }
  }
}

// --- Card content ---

function updateOptionContent(optEl, memberName, memberIndex) {
  optEl.innerHTML = renderCard(memberName, memberPicId, memberData);
  optEl.style.setProperty("--member-color", memberData[memberName].color);
  optEl.dataset.memberIndex = memberIndex;
}

// --- Page state ---

function restartSorter() {
  els.battleResult.innerHTML = "";
  els.showMore.classList.add("is-hidden");
  els.tweetButton.classList.add("is-hidden");
  els.sssongsButton.classList.add("is-hidden");
  els.pageSorter.classList.remove("is-hidden");
  sorter.reset();
  showFinal();
}

function handleHistoryBack() {
  history.hideHistoryPage(els, memberData, memberNames, restartSorter);
}

// --- Sorting ---

async function handleSort(preference) {
  if (sorter.isComplete() || isAnimating) return;
  isAnimating = true;
  document.body.classList.add("is-animating");

  if (preference === "A") sorter.preferMemberA();
  else if (preference === "B") sorter.preferMemberB();
  else sorter.declareTie();

  if (sorter.isComplete()) {
    updateProgressDisplay(sorter.getProgress());
    showResult();
  } else {
    await showFinal({ selectedFlag: preference });
  }

  isAnimating = false;
  document.body.classList.remove("is-animating");
}

function showResult({ full = false } = {}) {
  const sortedMembers = sorter.getSortedMembers();
  const { itemsHtml, shareText } = renderResultPage(
    sortedMembers, memberData, sorter.equal, full,
  );

  els.battleResult.innerHTML = html`
    <a class="sort-again-link" id="btn-replay">\u2190 Sort Again</a>
    <div class="results-list">
      <h2>Bias Ranking Result</h2>
      <ul>${itemsHtml}</ul>
    </div>`;
  els.pageSorter.classList.add("is-hidden");
  els.showMore.classList.remove("is-hidden");

  document.getElementById("btn-replay").addEventListener("click", restartSorter);

  els.tweetButton.href = `https://twitter.com/intent/tweet?text=${shareText}`;
  els.tweetButton.classList.remove("is-hidden");
  els.sssongsButton.classList.remove("is-hidden");

  if (isLoggedInUser()) {
    saveRanking(sortedMembers, memberData).then(() => {
      loadAllRankings().then((r) => history.setRankings(r));
    });
  }
}

function toggleResult() {
  showingFullResults = !showingFullResults;
  els.showMore.innerText = showingFullResults ? "Show Less" : "Show More";
  showResult({ full: showingFullResults });
}

function updateProgressDisplay(progress) {
  els.battleNumber.innerHTML = renderProgressHeader(progress);
}

async function showFinal({ skipIncrement = false, selectedFlag = "" } = {}) {
  if (!skipIncrement) updateProgressDisplay(sorter.getProgress());
  const comp = sorter.getCurrentComparison();
  const force = skipIncrement;
  await Promise.all([
    animateCardUpdate(els.optionA, comp.memberAName, comp.memberA, selectedFlag === "A", updateOptionContent, force),
    animateCardUpdate(els.optionB, comp.memberBName, comp.memberB, selectedFlag === "B", updateOptionContent, force),
  ]);
}

// --- Init ---

document.addEventListener("DOMContentLoaded", function () {
  initMemberPic();
  cacheElements();

  initTheme(els, () => {
    initMemberPic();
    if (!sorter.isComplete()) showFinal({ skipIncrement: true });
  });

  hideSigninIfUnconfigured(els);

  sorter.reset();
  showFinal();

  els.optionA.addEventListener("click", () => handleSort("A"));
  els.optionB.addEventListener("click", () => handleSort("B"));
  els.showMore.addEventListener("click", toggleResult);

  els.btnHistory.addEventListener("click", () => {
    els.userDropdown.classList.add("is-hidden");
    history.showHistoryPage(els, memberData, memberNames);
  });
  els.btnHistoryBack.addEventListener("click", handleHistoryBack);

  els.btnChartClose.addEventListener("click", () => {
    els.chartModal.classList.add("is-hidden");
    els.chartModal.classList.remove("is-visible");
  });
  els.chartModal.addEventListener("click", (e) => {
    if (e.target === els.chartModal) {
      els.chartModal.classList.add("is-hidden");
      els.chartModal.classList.remove("is-visible");
    }
  });

  initAuth(els, history.refreshRankings, () => {
    history.setRankings([]);
    restartSorter();
  });

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
