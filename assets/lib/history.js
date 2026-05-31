import { html } from "./html.js";
import { renderHistoryResult } from "./components.js";
import { bumpChart, buildRankHistory } from "../sparkline.js";
import {
  loadAllRankings,
  convertRankingToNames,
  currentMonth,
} from "../supabase.js";

let allRankings = [];
let historyMonth = null;
let _cachedRankData = null;
let closeMonthDropdown = null;

export function getRankings() {
  return allRankings;
}

export function setRankings(r) {
  allRankings = r;
}

export function getHistoryMonth() {
  return historyMonth;
}

export async function refreshRankings() {
  allRankings = await loadAllRankings();
}

export function getRankHistoryForSparklines(memberNames, memberData) {
  if (allRankings.length < 2) return null;
  const converted = allRankings.map((entry) => ({
    month: entry.month,
    ranking: convertRankingToNames(entry.ranking, memberData),
  }));
  return buildRankHistory(converted, memberNames);
}

function renderBumpChart(rankData, memberData) {
  if (!rankData || rankData.months.length < 2) return "";
  const months = rankData.months.slice(-6);
  const history = {};
  for (const name of Object.keys(rankData.history)) {
    history[name] = rankData.history[name].slice(-6);
  }
  return html`<div class="bump-chart-wrap" data-chart-clickable="true">
    <div class="bump-chart-inner">${bumpChart(history, memberData, months)}</div>
  </div>`;
}

function openChartModal(els, memberData) {
  if (!_cachedRankData || _cachedRankData.months.length < 2) return;
  const months = _cachedRankData.months.slice(-6);
  const history = {};
  for (const name of Object.keys(_cachedRankData.history)) {
    history[name] = _cachedRankData.history[name].slice(-6);
  }
  els.chartModalContent.innerHTML = bumpChart(history, memberData, months, 1000, 600);
  els.chartModal.classList.remove("is-hidden");
  els.chartModal.classList.add("is-visible");
}

export function showHistoryPage(els, memberData, memberNames) {
  if (allRankings.length === 0) return;
  _cachedRankData = getRankHistoryForSparklines(memberNames, memberData);

  els.historyPage.classList.remove("is-hidden");
  els.pageSorter.classList.add("is-hidden");
  els.pageResult.classList.add("is-hidden");
  els.showMore.classList.add("is-hidden");
  els.tweetButton.classList.add("is-hidden");
  els.sssongsButton.classList.add("is-hidden");

  // Pre-convert rankings for rendering
  const displayRankings = allRankings.map((entry) => ({
    ...entry,
    ranking: convertRankingToNames(entry.ranking, memberData),
  }));

  renderHistoryView(els, displayRankings, memberData);
}

export function hideHistoryPage(els, memberData, memberNames, onRestart) {
  els.historyPage.classList.add("is-hidden");
  els.pageResult.classList.remove("is-hidden");
  onRestart();
}

function renderHistoryView(els, displayRankings, memberData) {
  const month = historyMonth || displayRankings[0]?.month;
  const entry = displayRankings.find((e) => e.month === month);
  if (!entry) return;

  const chartHtml = renderBumpChart(_cachedRankData, memberData);
  els.historyChart.innerHTML = chartHtml || "";
  els.historyChart.onclick = (e) => {
    if (e.target.closest("[data-chart-clickable]")) openChartModal(els, memberData);
  };

  els.historyResult.innerHTML = renderHistoryResult(
    displayRankings, historyMonth, memberData, chartHtml,
  );

  bindHistoryEvents(els, displayRankings, memberData);
}

function bindHistoryEvents(els, displayRankings, memberData) {
  document.getElementById("btn-month-toggle").addEventListener("click", () => {
    const dd = document.getElementById("month-dropdown");
    dd.classList.toggle("is-hidden");
  });

  if (closeMonthDropdown) {
    document.removeEventListener("click", closeMonthDropdown);
  }
  closeMonthDropdown = function (e) {
    const sel = document.querySelector(".history-month-select");
    if (sel && !sel.contains(e.target)) {
      const dd = document.getElementById("month-dropdown");
      if (dd) dd.classList.add("is-hidden");
    }
  };
  document.addEventListener("click", closeMonthDropdown);

  els.historyResult.querySelectorAll(".dropdown-item[data-month]").forEach((btn) => {
    btn.addEventListener("click", () => {
      historyMonth = btn.dataset.month;
      renderHistoryView(els, displayRankings, memberData);
    });
  });
}
