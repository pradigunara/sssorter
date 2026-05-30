import TripleSBiasSorter from "./sorter-class.js";
import { memberData } from "./member-data.js";
import {
  signInWithX,
  signInWithDiscord,
  signOut,
  onAuthChange,
  getSession,
  saveRanking,
  loadCurrentMonthRanking,
  loadAllRankings,
  convertRankingToNames,
  currentMonth,
  isConfigured,
} from "./supabase.js";
import { bumpChart, buildRankHistory } from "./sparkline.js";

const html = (strings, ...values) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");

const memberNames = Object.keys(memberData);
let sorter = new TripleSBiasSorter(memberNames, memberData);
let memberPicId = {};
let isLoggedIn = false;
let allRankings = [];
let historyMonth = null;
let closeMonthDropdown = null;
let _cachedRankData = null;

const FLIP_TRANSITION_MS = 350;

const SUN_SVG =
  '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
const MOON_SVG =
  '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// --- Theme ---

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

function setThemeIcon(isDarkMode) {
  document.querySelector(".theme-toggle-icon svg").innerHTML = isDarkMode
    ? SUN_SVG
    : MOON_SVG;
}

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  document.querySelector(".theme-toggle-text").textContent = isDarkMode
    ? "Light Mode"
    : "#DarkMode";
  setThemeIcon(isDarkMode);
  localStorage.setItem("darkMode", isDarkMode);
  initMemberPic();
  if (!sorter.isComplete()) {
    showFinal({ skipIncrement: true });
  }
}

// --- Cards ---

function toNameFace(mem) {
  return html`<div class="photocard-image-container">
      <img src="${memberPicId[mem]}" alt="${mem}" class="photocard-image" width="582" height="900" />
      <div class="member-badge">${memberData[mem].sNumber}</div>
    </div>
    <div class="photocard-info">
      <div class="member-name">${mem} ${memberData[mem].emoji || ""}</div>
    </div>`;
}

// --- Element references ---

let els = {};

function cacheElements() {
  els.optionA = document.getElementById("optionA");
  els.optionB = document.getElementById("optionB");
  els.battleNumber = document.getElementById("battleNumber");
  els.battleResult = document.getElementById("battleResult");
  els.pageSorter = document.getElementById("page-sorter");
  els.showMore = document.getElementById("showMore");
  els.tweetButton = document.getElementById("tweet-button");
  els.sssongsButton = document.getElementById("sssongs-button");
  els.themeToggleText = document.querySelector(".theme-toggle-text");

  // Auth
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

  // Chart modal
  els.chartModal = document.getElementById("chart-modal");
  els.chartModalContent = document.getElementById("chart-modal-content");
  els.btnChartClose = document.getElementById("btn-chart-close");

  // History page
  els.historyPage = document.getElementById("history-page");
  els.historyChart = document.getElementById("history-chart");
  els.historyResult = document.getElementById("history-result");
  els.btnHistoryBack = document.getElementById("btn-history-back");
}

// --- Auth ---

async function initAuth() {
  els.btnSignin.addEventListener("click", () => {
    els.authDropdown.style.display =
      els.authDropdown.style.display === "none" ? "block" : "none";
  });
  els.btnSigninX.addEventListener("click", () => {
    els.authDropdown.style.display = "none";
    signInWithX();
  });
  els.btnSigninDiscord.addEventListener("click", () => {
    els.authDropdown.style.display = "none";
    signInWithDiscord();
  });

  els.btnUserMenu.addEventListener("click", () => {
    els.userDropdown.style.display =
      els.userDropdown.style.display === "none" ? "block" : "none";
  });
  els.btnHistory.addEventListener("click", () => {
    els.userDropdown.style.display = "none";
    showHistoryPage();
  });
  els.btnSignout.addEventListener("click", async () => {
    els.userDropdown.style.display = "none";
    await signOut();
    updateAuthUI(null);
    restartSorter();
  });
  els.btnHistoryBack.addEventListener("click", hideHistoryPage);

  els.btnChartClose.addEventListener("click", () => {
    els.chartModal.style.display = "none";
  });
  els.chartModal.addEventListener("click", (e) => {
    if (e.target === els.chartModal) els.chartModal.style.display = "none";
  });

  document.addEventListener("click", (e) => {
    if (
      !els.authButtons.contains(e.target) &&
      !els.authUser.contains(e.target)
    ) {
      els.authDropdown.style.display = "none";
      els.userDropdown.style.display = "none";
    }
  });

  onAuthChange(async (session) => {
    updateAuthUI(session);
    if (session) await loadSavedData();
    else {
      allRankings = [];
      historyMonth = null;
      restartSorter();
    }
  });

  // onAuthChange fires synchronously with the initial session,
  // so we just need updateAuthUI here (loadSavedData already called above)
  const session = await getSession();
  updateAuthUI(session);
}

function updateAuthUI(session) {
  isLoggedIn = !!session;
  if (session) {
    els.btnSignin.style.display = "none";
    els.authDropdown.style.display = "none";
    els.authUser.style.display = "block";
    const id = session.user?.user_metadata;
    els.authUsername.textContent =
      id?.full_name || id?.name || id?.user_name || session.user?.email || "User";
  } else {
    els.btnSignin.style.display = "inline-block";
    els.authUser.style.display = "none";
    els.userDropdown.style.display = "none";
  }
}

async function loadSavedData() {
  allRankings = await loadAllRankings();
}

// --- History helpers ---

function getRankHistoryForSparklines() {
  if (allRankings.length < 2) return null;
  const converted = allRankings.map((entry) => ({
    month: entry.month,
    ranking: convertRankingToNames(entry.ranking, memberData),
  }));
  return buildRankHistory(converted, memberNames);
}

function renderBumpChart(rankData) {
  if (!rankData || rankData.months.length < 2) return "";
  const months = rankData.months.slice(-6);
  const history = {};
  for (const name of Object.keys(rankData.history)) {
    history[name] = rankData.history[name].slice(-6);
  }
  return `<div class="bump-chart-wrap" data-chart-clickable="true">
    <div class="bump-chart-inner">${bumpChart(history, memberData, months)}</div>
  </div>`;
}

function openChartModal() {
  if (!_cachedRankData || _cachedRankData.months.length < 2) return;
  const months = _cachedRankData.months.slice(-6);
  const history = {};
  for (const name of Object.keys(_cachedRankData.history)) {
    history[name] = _cachedRankData.history[name].slice(-6);
  }
  els.chartModalContent.innerHTML = bumpChart(history, memberData, months, 1000, 600);
  els.chartModal.style.display = "flex";
}

// --- History Page ---

function restartSorter() {
  els.battleResult.innerHTML = "";
  els.showMore.style.display = "none";
  els.tweetButton.style.display = "none";
  els.sssongsButton.style.display = "none";
  els.pageSorter.style.display = "block";
  sorter.reset();
  showFinal();
}

function showHistoryPage() {
  if (!isLoggedIn || allRankings.length === 0) return;
  _cachedRankData = getRankHistoryForSparklines();

  els.historyPage.style.display = "block";
  els.pageSorter.style.display = "none";
  els.battleResult.innerHTML = "";
  document.getElementById("page-result").style.display = "none";
  els.showMore.style.display = "none";
  els.tweetButton.style.display = "none";
  els.sssongsButton.style.display = "none";

  if (!historyMonth) historyMonth = null; // will default to current in render
  renderHistoryResult();
}

function hideHistoryPage() {
  els.historyPage.style.display = "none";
  document.getElementById("page-result").style.display = "";
  restartSorter();
}

function renderHistoryResult() {
  const curMonth = currentMonth();
  const month = historyMonth || curMonth;
  const entry = allRankings.find((e) => e.month === month);
  if (!entry) return;

  const names = convertRankingToNames(entry.ranking, memberData);

  // Bump chart
  const chartHtml = renderBumpChart(_cachedRankData);
  els.historyChart.innerHTML = chartHtml || "";
  els.historyChart.onclick = (e) => {
    if (e.target.closest("[data-chart-clickable]")) openChartModal();
  };

  // Month pills
  const pills = allRankings
    .map((e) => {
      const date = new Date(e.month + "-01");
      const label = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      return html`<button
        class="history-pill ${e.month === month ? "history-pill-active" : ""}"
        data-month="${e.month}">${label}</button>`;
    })
    .join("");

  // Ranking items
  let rank = 1;
  const items = [];
  for (let i = 0; i < names.length; i++) {
    const mem = names[i];
    items.push(html`<li><span class="number">${rank++}</span> ${mem}${memberData[mem].emoji}</li>`);
  }

  els.historyResult.innerHTML = html`
    <div class="results-list">
      <div class="history-title-row">
        <h2>Your Bias Ranking</h2>
        <div class="history-month-select">
          <button id="btn-month-toggle" class="month-toggle-btn">${month} ▾</button>
          <div id="month-dropdown" class="month-dropdown" style="display:none">${pills}</div>
        </div>
      </div>
      <ul>${items.join("")}</ul>
    </div>`;

  document.getElementById("btn-month-toggle").addEventListener("click", () => {
    const dd = document.getElementById("month-dropdown");
    dd.style.display = dd.style.display === "none" ? "block" : "none";
  });

  if (closeMonthDropdown) {
    document.removeEventListener("click", closeMonthDropdown);
  }
  closeMonthDropdown = function closeMd(e) {
    const sel = document.querySelector(".history-month-select");
    if (sel && !sel.contains(e.target)) {
      const dd = document.getElementById("month-dropdown");
      if (dd) dd.style.display = "none";
    }
  };
  document.addEventListener("click", closeMonthDropdown);

  els.historyResult.querySelectorAll(".history-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      historyMonth = btn.dataset.month;
      renderHistoryResult();
    });
  });
}

// --- Init ---

document.addEventListener("DOMContentLoaded", function () {
  initMemberPic();
  cacheElements();

  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
    els.themeToggleText.textContent = "Light Mode";
    setThemeIcon(true);
  }

  sorter.reset();
  showFinal();

  if (!isConfigured()) {
    els.btnSignin.style.display = "none";
  }

  els.optionA.addEventListener("click", () => handleSort("A"));
  els.optionB.addEventListener("click", () => handleSort("B"));
  document.querySelector(".theme-toggle").addEventListener("click", toggleDarkMode);
  els.showMore.addEventListener("click", toggleResult);

  initAuth();

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

// --- Sorting ---

let isAnimating = false;

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
  let ranking = 1, sameRank = 1;
  const listResult = [], sortedMembers = sorter.getSortedMembers();
  const iterCount = full ? sortedMembers.length : sortedMembers.length / 2;
  const items = [];

  for (let i = 0; i < iterCount; i++) {
    const mem = sortedMembers[i];
    listResult.push(`${mem}${memberData[mem].emoji}`);
    items.push(html`<li><span class="number">${ranking}</span> ${mem}${memberData[mem].emoji}</li>`);

    if (i < iterCount - 1) {
      if (sorter.equal[i] == i + 1) sameRank++;
      else { ranking += sameRank; sameRank = 1; }
    }
  }

  els.battleResult.innerHTML = html`
    <a class="sort-again-link" id="btn-replay">← Sort Again</a>
    <div class="results-list">
      <h2>Bias Ranking Result</h2>
      <ul>${items.join("")}</ul>
    </div>`;
  els.pageSorter.style.display = "none";
  els.showMore.style.display = "inline";

  document.getElementById("btn-replay").addEventListener("click", restartSorter);

  const shareText = `My %23tripleS Bias Ranking:%0A${listResult.join("%0A")}%0A> https://sssorter.pages.dev`;
  els.tweetButton.style.display = "inline-block";
  els.tweetButton.href = `https://twitter.com/intent/tweet?text=${shareText}`;
  els.sssongsButton.style.display = "inline-block";

  if (isLoggedIn) {
    saveRanking(sortedMembers, memberData).then(() => {
      loadAllRankings().then((r) => { allRankings = r; });
    });
  }
}

let showingFullResults = false;

function toggleResult() {
  showingFullResults = !showingFullResults;
  els.showMore.innerText = showingFullResults ? "Show Less" : "Show More";
  showResult({ full: showingFullResults });
}

function updateProgressDisplay(progress) {
  const hc = 5;
  const filled = Math.floor((progress.progressPercent / 100) * hc);
  const hearts = "♥".repeat(filled) + "♡".repeat(hc - filled);
  els.battleNumber.innerHTML = html`<strong>Gravity #${progress.currentQuestion}</strong><br />${hearts} ${progress.progressPercent}% sorted`;
}

function updateOptionContent(optEl, memberName, memberIndex) {
  optEl.innerHTML = toNameFace(memberName);
  optEl.style.setProperty("--member-color", memberData[memberName].color);
  optEl.dataset.memberIndex = memberIndex;
}

// --- Animations ---

function animateElement(element, ...animationClasses) {
  return new Promise((resolve) => {
    let resolved = false;
    const done = () => { if (resolved) return; resolved = true; element.removeEventListener("transitionend", onEnd); resolve(); };
    const onEnd = (e) => { if (e.target === element) done(); };
    element.addEventListener("transitionend", onEnd);
    element.classList.add(...animationClasses);
    setTimeout(done, FLIP_TRANSITION_MS + 50);
  });
}

async function animateCardUpdate(card, nextName, nextIdx, isSelected, forceUpdate = false) {
  const curIdx = card.dataset.memberIndex != null ? parseInt(card.dataset.memberIndex, 10) : -1;
  const changed = forceUpdate || curIdx !== nextIdx;

  card.classList.remove("fade-out", "fade-in", "flip-out", "flip-in", "flip-ready", "selected-glow");
  card.style.opacity = "";
  card.style.transform = "";

  if (isSelected) card.classList.add("selected-glow");

  if (changed && curIdx !== -1) {
    await animateElement(card, "flip-out");
    card.classList.remove("selected-glow");
    updateOptionContent(card, nextName, nextIdx);

    const img = card.querySelector(".photocard-image");
    if (img && !img.complete) {
      await new Promise((resolve) => {
        const t = setTimeout(resolve, 300);
        img.onload = img.onerror = () => { clearTimeout(t); resolve(); };
      });
    }

    card.classList.remove("flip-out");
    card.classList.add("flip-ready");
    card.getBoundingClientRect();
    card.classList.remove("flip-ready");
    await animateElement(card, "flip-in");
  } else {
    if (curIdx === -1) {
      updateOptionContent(card, nextName, nextIdx);
      card.style.visibility = "visible";
      card.style.opacity = 1;
    } else {
      await new Promise((resolve) => setTimeout(resolve, FLIP_TRANSITION_MS * 2));
    }
  }

  card.classList.remove("selected-glow", "flip-out", "flip-in", "flip-ready");
  card.style.opacity = "";
  card.style.transform = "";
}

async function showFinal({ skipIncrement = false, selectedFlag = "" } = {}) {
  if (!skipIncrement) updateProgressDisplay(sorter.getProgress());
  const comp = sorter.getCurrentComparison();
  const force = skipIncrement;
  await Promise.all([
    animateCardUpdate(els.optionA, comp.memberAName, comp.memberA, selectedFlag === "A", force),
    animateCardUpdate(els.optionB, comp.memberBName, comp.memberB, selectedFlag === "B", force),
  ]);
}
