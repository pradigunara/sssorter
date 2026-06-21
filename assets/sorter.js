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
  clearAuthUI,
} from "./lib/auth.js";
import { initTouchTargets } from "./lib/touch-targets.js";
import { memberPhotoUrl, selectPhotoVariant } from "./lib/photo-src.js";

const memberNames = Object.keys(memberData);
let sorter = new TripleSBiasSorter(memberNames, memberData);
let memberPicId = {};
let activePicSet = "";
let showingFullResults = false;
let isAnimating = false;
let skipRankingSave = false;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

let historyMod = null;
function loadHistory() {
  if (!historyMod) historyMod = import("./lib/history.js");
  return historyMod;
}

function runWhenIdle(fn) {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(fn, { timeout: 3000 });
  } else {
    setTimeout(fn, 200);
  }
}

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
  let picSet;
  if (window.__PICSET__) {
    picSet = window.__PICSET__;
    window.__PICSET__ = null; // use once, then fall back to random on theme toggle
  } else {
    picSet = localStorage.getItem("darkMode") === "true" ? `picSet${rand(3, 4)}` : `picSet${rand(1, 2)}`;
  }
  activePicSet = picSet;
  memberPicId = {};
  for (const memberName of memberNames) {
    memberPicId[memberName] = memberData[memberName][picSet].local2x;
  }
}

function preloadPicSet(picSet) {
  const variant = selectPhotoVariant();
  const urls = memberNames.map((name) =>
    memberPhotoUrl(memberData, name, picSet, variant),
  );

  const loadAll = () => {
    for (const src of urls) {
      const img = new Image();
      img.src = src;
    }
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(loadAll, { timeout: 5000 });
  } else {
    setTimeout(loadAll, 200);
  }
}


// --- Card content ---

function updateOptionContent(optEl, memberName, memberIndex, _forcePhotoUpdate = false) {
  const existingImg = optEl.querySelector(".photocard-image");
  const sameMember =
    !_forcePhotoUpdate &&
    optEl.dataset.memberIndex === String(memberIndex) &&
    existingImg?.alt === memberName;

  if (!sameMember) {
    optEl.innerHTML = renderCard(memberName, memberPicId, memberData);
  }

  const img = optEl.querySelector(".photocard-image");
  if (img) {
    const syncLoadingState = () => {
      if (img.complete && img.naturalHeight > 0) {
        img.classList.remove("is-loading");
      } else {
        img.classList.add("is-loading");
        const reveal = () => img.classList.remove("is-loading");
        img.addEventListener("load", reveal, { once: true });
        img.addEventListener("error", reveal, { once: true });
      }
    };
    requestAnimationFrame(syncLoadingState);
  }
  optEl.style.setProperty("--member-color", memberData[memberName].color);
  optEl.dataset.memberIndex = memberIndex;
  optEl.setAttribute("aria-label", `Choose ${memberName}`);
  optEl.classList.remove("sorter-option--pending");
  optEl.removeAttribute("aria-busy");
}

// --- Page state ---

function restartSorter() {
  skipRankingSave = false;
  els.battleResult.innerHTML = "";
  els.showMore.classList.add("is-hidden");
  els.tweetButton.classList.add("is-hidden");
  els.exportImageButton.classList.add("is-hidden");
  els.sssongsButton.classList.add("is-hidden");
  els.pageSorter.classList.remove("is-hidden");
  els.pageResult.classList.add("is-hidden");
  sorter.reset();
  showFinal();
}

function handleHistoryBack() {
  loadHistory().then((history) => {
    history.hideHistoryPage(els, memberData, memberNames, restartSorter);
  });
}

// --- Sorting ---

function handleSort(preference) {
  if (sorter.isComplete() || isAnimating) return;
  isAnimating = true;
  document.body.classList.add("is-animating");

  // Glow immediately, then rAF lets the browser paint it before heavy work
  const selectedCard =
    preference === "A" ? els.optionA : preference === "B" ? els.optionB : null;
  if (selectedCard) selectedCard.classList.add("selected-glow");

  requestAnimationFrame(() => {
    // Phase 1: sorting computation (pure JS, no DOM)
    if (preference === "A") sorter.preferMemberA();
    else if (preference === "B") sorter.preferMemberB();
    else sorter.declareTie();

    if (sorter.isComplete()) {
      updateProgressDisplay(sorter.getProgress());
      showResult();
      finishSort();
    } else {
      // Yield so browser can paint progress update before starting animations
      setTimeout(() => {
        showFinal({ selectedFlag: preference }).then(finishSort);
      }, 0);
    }
  });

  function finishSort() {
    isAnimating = false;
    document.body.classList.remove("is-animating");
  }
}

function showResult({ full = false } = {}) {
  const sortedMembers = sorter.getSortedMembers();
  const { itemsHtml, shareText } = renderResultPage(
    sortedMembers,
    memberData,
    sorter.equal,
    full,
  );

  els.battleResult.innerHTML = html` <a class="sort-again-link touch-target" id="btn-replay"
      >← Sort Again</a
    >
    <div class="results-list">
      <h2>Bias Ranking Result</h2>
      <ul>
        ${itemsHtml}
      </ul>
    </div>`;
  els.pageSorter.classList.add("is-hidden");
  els.pageResult.classList.remove("is-hidden");
  els.showMore.classList.remove("is-hidden");

  document
    .getElementById("btn-replay")
    .addEventListener("click", restartSorter);

  els.tweetButton.href = `https://twitter.com/intent/tweet?text=${shareText}`;
  els.tweetButton.classList.remove("is-hidden");
  els.exportImageButton.classList.remove("is-hidden");
  els.sssongsButton.classList.remove("is-hidden");

  if (!skipRankingSave && isLoggedInUser()) {
    Promise.all([import("./supabase.js"), loadHistory()]).then(
      ([{ saveRanking, loadAllRankings }, history]) => {
        saveRanking(sortedMembers, memberData).then((result) => {
          if (result?.error) {
            if (result.error === "Not authenticated") clearAuthUI(els);
            return;
          }
          loadAllRankings().then((r) => history.setRankings(r));
        });
      },
    );
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

function init() {
  initTouchTargets();
  initMemberPic();
  cacheElements();
  initTheme(els, () => {
    initMemberPic();
    preloadPicSet(activePicSet);
    if (!sorter.isComplete()) showFinal({ skipIncrement: true });
  });

  hideSigninIfUnconfigured(els);

  const testMode = new URLSearchParams(window.location.search).get("test");
  const isTestRandom = testMode === "random";
  const isTestLast = testMode === "last";

  sorter.reset();
  preloadPicSet(activePicSet);

  if (isTestLast) {
    skipRankingSave = true;
    if (!sorter.isComplete()) showFinal({ skipIncrement: true });
    runWhenIdle(() => {
      import("./supabase.js")
        .then(({ loadLastRanking }) => loadLastRanking(memberData))
        .then((names) => {
          if (names?.length) {
            sorter.markCompleteWithOrder(names);
            showResult();
          }
        })
        .catch(() => {});
    });
  } else if (isTestRandom) {
    const shuffled = [...memberNames];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    sorter.markCompleteWithOrder(shuffled);
    showResult();
  } else if (!sorter.isComplete()) {
    showFinal({ skipIncrement: true });
  }


  els.optionA.addEventListener("click", () => handleSort("A"));
  els.optionB.addEventListener("click", () => handleSort("B"));
  els.optionA.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("A"); }
  });
  els.optionB.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("B"); }
  });
  document.addEventListener("keydown", (e) => {
    if (isAnimating || sorter.isComplete()) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); els.optionA.focus(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); els.optionB.focus(); }
  });
  els.showMore.addEventListener("click", toggleResult);

  els.btnHistory.addEventListener("click", () => {
    els.userDropdown.classList.add("is-hidden");
    loadHistory().then(async (history) => {
      try {
        await history.showHistoryPage(els, memberData, memberNames);
      } catch {
        history.showHistoryError(els, "Could not load history. Please try again.");
      }
    });
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
      // Image export failed — user sees button revert
    } finally {
      els.exportImageButton.classList.remove("is-loading");
      els.exportImageButton.textContent = originalText;
    }
  });

  initAuth(els, () => {
    loadHistory().then((history) => history.refreshRankings());
  }, () => {
    loadHistory().then((history) => {
      els.historyPage.classList.add("is-hidden");
      history.setRankings([]);
      restartSorter();
    });
  });
}

document.addEventListener("DOMContentLoaded", init);