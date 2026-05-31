import { html } from "./html.js";

export function renderCard(memberName, memberPicId, memberData) {
  return html`<div class="photocard-image-container">
      <img src="${memberPicId[memberName]}" alt="${memberName}" class="photocard-image" width="582" height="900" />
      <div class="member-badge">${memberData[memberName].sNumber}</div>
    </div>
    <div class="photocard-info">
      <div class="member-name">${memberName} ${memberData[memberName].emoji || ""}</div>
    </div>`;
}

export function renderProgressHeader(progress) {
  const hc = 5;
  const filled = Math.floor((progress.progressPercent / 100) * hc);
  const hearts = "\u2665".repeat(filled) + "\u2661".repeat(hc - filled);
  return html`<strong>Gravity #${progress.currentQuestion}</strong><br />${hearts} ${progress.progressPercent}% sorted`;
}

export function renderResultItems(sortedMembers, memberData, count) {
  let rank = 1, sameRank = 1;
  const listResult = [];
  const items = [];

  for (let i = 0; i < count; i++) {
    const mem = sortedMembers[i];
    listResult.push(`${mem}${memberData[mem].emoji}`);
    items.push(html`<li><span class="number">${rank}</span> ${mem}${memberData[mem].emoji}</li>`);

    if (i < count - 1) {
      if (memberData._equalRef && memberData._equalRef[i] == i + 1) {
        sameRank++;
      } else {
        rank += sameRank;
        sameRank = 1;
      }
    }
  }
  return { items, listResult };
}

export function renderResultPage(sortedMembers, memberData, equal, full) {
  const count = full ? sortedMembers.length : Math.ceil(sortedMembers.length / 2);
  let rank = 1, sameRank = 1;
  const listResult = [];
  const items = [];

  for (let i = 0; i < count; i++) {
    const mem = sortedMembers[i];
    listResult.push(`${mem}${memberData[mem].emoji}`);
    items.push(html`<li><span class="number">${rank}</span> ${mem}${memberData[mem].emoji}</li>`);

    if (i < count - 1) {
      if (equal[i] == i + 1) sameRank++;
      else { rank += sameRank; sameRank = 1; }
    }
  }

  const shareText = `My %23tripleS Bias Ranking:%0A${listResult.join("%0A")}%0A> https://sssorter.pages.dev`;

  return {
    itemsHtml: items.join(""),
    shareText,
    listResult,
  };
}

export function renderHistoryResult(allRankings, historyMonth, memberData, chartHtml) {
  const curMonth = null;
  const month = historyMonth || allRankings[0]?.month;
  const entry = allRankings.find((e) => e.month === month);
  if (!entry) return "";

  const pills = allRankings
    .map((e) => {
      const date = new Date(e.month + "-01");
      const label = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      return html`<button
        class="dropdown-item ${e.month === month ? "history-pill-active" : ""}"
        data-month="${e.month}">${label}</button>`;
    })
    .join("");

  let rank = 1;
  const items = [];
  for (const mem of entry.ranking) {
    items.push(html`<li><span class="number">${rank++}</span> ${mem}${memberData[mem].emoji}</li>`);
  }

  return html`
    <div class="results-list">
      <div class="history-title-row">
        <h2>Your Bias Ranking</h2>
        <div class="history-month-select">
          <button id="btn-month-toggle" class="pill-toggle">${month} \u25BE</button>
          <div id="month-dropdown" class="dropdown-menu month-dropdown is-hidden">${pills}</div>
        </div>
      </div>
      <ul>${items.join("")}</ul>
    </div>`;
}
