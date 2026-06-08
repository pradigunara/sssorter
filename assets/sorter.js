import TripleSBiasSorter from "./sorter-class.js";
import { memberData } from "./member-data.js";
import { html } from "./lib/html.js";
import {
  renderCard,
  renderProgressHeader,
  renderResultPage,
} from "./lib/components.js";
import { initTheme } from "./lib/theme.js";
import { animateCardUpdate } from "./lib/animations.js";
import {
  initAuth,
  isLoggedInUser,
  hideSigninIfUnconfigured,
} from "./lib/auth.js";
import * as history from "./lib/history.js";
import { saveRanking, loadAllRankings } from "./supabase.js";

const memberNames = Object.keys(memberData);
let sorter = new TripleSBiasSorter(memberNames, memberData);
let memberPicId = {};
let activePicSet = "";
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
  els.exportImageButton = document.getElementById("export-image-button");
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
  activePicSet = picSet;
  memberPicId = {};
  for (const memberName of memberNames) {
    memberPicId[memberName] = memberData[memberName][picSet];
  }
}

function preloadPicSet(picSet) {
  for (const memberName of memberNames) {
    const img = new Image();
    img.src = memberData[memberName][picSet];
  }
}

function preloadImages() {
  preloadPicSet(activePicSet);
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
  els.exportImageButton.classList.add("is-hidden");
  els.sssongsButton.classList.add("is-hidden");
  els.pageSorter.classList.remove("is-hidden");
  sorter.reset();
  showFinal();
}

function handleHistoryBack() {
  history.hideHistoryPage(els, memberData, memberNames, restartSorter);
}

// --- Sorting ---

function handleSort(preference) {
  if (sorter.isComplete() || isAnimating) return;
  isAnimating = true;
  document.body.classList.add("is-animating");

  // Show selection glow immediately, then yield so browser can paint it
  const selectedCard =
    preference === "A" ? els.optionA : preference === "B" ? els.optionB : null;
  if (selectedCard) selectedCard.classList.add("selected-glow");

  requestAnimationFrame(() => {
    if (preference === "A") sorter.preferMemberA();
    else if (preference === "B") sorter.preferMemberB();
    else sorter.declareTie();

    if (sorter.isComplete()) {
      updateProgressDisplay(sorter.getProgress());
      showResult();
      isAnimating = false;
      document.body.classList.remove("is-animating");
    } else {
      showFinal({ selectedFlag: preference }).then(() => {
        isAnimating = false;
        document.body.classList.remove("is-animating");
      });
    }
  });
}

function showResult({ full = false } = {}) {
  const sortedMembers = sorter.getSortedMembers();
  const { itemsHtml, shareText } = renderResultPage(
    sortedMembers,
    memberData,
    sorter.equal,
    full,
  );

  els.battleResult.innerHTML = html` <a class="sort-again-link" id="btn-replay"
      >← Sort Again</a
    >
    <div class="results-list">
      <h2>Bias Ranking Result</h2>
      <ul>
        ${itemsHtml}
      </ul>
    </div>`;
  els.pageSorter.classList.add("is-hidden");
  els.showMore.classList.remove("is-hidden");

  document
    .getElementById("btn-replay")
    .addEventListener("click", restartSorter);

  els.tweetButton.href = `https://twitter.com/intent/tweet?text=${shareText}`;
  els.tweetButton.classList.remove("is-hidden");
  els.exportImageButton.classList.remove("is-hidden");
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
    animateCardUpdate(
      els.optionA,
      comp.memberAName,
      comp.memberA,
      selectedFlag === "A",
      updateOptionContent,
      force,
    ),
    animateCardUpdate(
      els.optionB,
      comp.memberBName,
      comp.memberB,
      selectedFlag === "B",
      updateOptionContent,
      force,
    ),
  ]);
}

// --- Init ---

document.addEventListener("DOMContentLoaded", function () {
  initMemberPic();
  cacheElements();

  initTheme(els, () => {
    initMemberPic();
    preloadPicSet(activePicSet);
    if (!sorter.isComplete()) showFinal({ skipIncrement: true });
  });

  hideSigninIfUnconfigured(els);

  sorter.reset();
  if (!sorter.isComplete()) showFinal({ skipIncrement: true });

  // check test mode
  setTimeout(() => {
    const testMode = new URLSearchParams(window.location.search).get("test");
    if (testMode === "random") {
      const shuffled = [...memberNames];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      sorter.markCompleteWithOrder(shuffled);
      showResult();
    }
  }, 3000);

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

  els.exportImageButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (els.exportImageButton.classList.contains("is-loading")) return;
    els.exportImageButton.classList.add("is-loading");
    const originalText = els.exportImageButton.textContent;
    els.exportImageButton.textContent = "Loading…";
    try {
      const { openExportModal } = await import("./lib/image-export.js");
      await openExportModal({
        sortedMembers: sorter.getSortedMembers(),
        memberData,
        equal: sorter.equal,
      });
    } catch (err) {
      console.error("Failed to open export modal:", err);
    } finally {
      els.exportImageButton.classList.remove("is-loading");
      els.exportImageButton.textContent = originalText;
    }
  });

  initAuth(els, history.refreshRankings, () => {
    els.historyPage.classList.add("is-hidden");
    history.setRankings([]);
    restartSorter();
  });

  const initialImgs = document.querySelectorAll(".photocard-image.is-loading");
  const reveal = (img) => img.classList.remove("is-loading");
  initialImgs.forEach((img) => {
    if (img.src && !img.srcset) {
      img.srcset = img.src.replace(/\/2x$/, "/1x") + " 1x, " + img.src + " 2x";
      img.sizes = "(max-width: 768px) 49vw, 340px";
      img.decoding = "async";
    }
    if (img.complete && img.naturalHeight !== 0) {
      reveal(img);
    } else {
      img.addEventListener("load", () => reveal(img), { once: true });
      img.addEventListener("error", () => reveal(img), { once: true });
    }
  });
  const first = initialImgs[0];
  if (first) {
    if (first.complete) preloadImages();
    else first.addEventListener("load", preloadImages, { once: true });
  }
});
