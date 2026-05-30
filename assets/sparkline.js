/**
 * Generate an SVG bump chart showing rank movement over months for all members.
 * @param {Object} rankHistory - { memberName: number[] } from buildRankHistory
 * @param {Object} memberData - member metadata (colors)
 * @param {string[]} monthLabels - ordered month labels for x-axis
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @returns {string} SVG markup
 */
export function bumpChart(
  rankHistory,
  memberData,
  monthLabels,
  width = 640,
  height = 360,
) {
  const members = Object.keys(rankHistory).filter(
    (name) => rankHistory[name].filter((r) => r !== null).length >= 2,
  );
  if (members.length === 0) return "";

  const pad = { top: 24, right: 100, bottom: 32, left: 36 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  // Y scale: rank 1 at top, rank 24 at bottom
  const rankMin = 1;
  const rankMax = 24;
  const y = (rank) =>
    pad.top + ((rank - rankMin) / (rankMax - rankMin)) * plotH;

  // X scale
  const x = (i) => pad.left + (i / (monthLabels.length - 1)) * plotW;

  // Build lines and dots for each member
  let lines = "";
  let dots = "";
  let labels = "";

  for (const name of members) {
    const ranks = rankHistory[name];
    const color = memberData[name]?.color ?? "#999";

    // Build valid points (filter out nulls, but keep index for x-pos)
    const points = [];
    for (let i = 0; i < ranks.length; i++) {
      if (ranks[i] !== null) {
        points.push({ monthIdx: i, rank: ranks[i] });
      }
    }
    if (points.length < 2) continue;

    // Polyline connecting points
    const polyPoints = points
      .map((p) => `${x(p.monthIdx)},${y(p.rank)}`)
      .join(" ");

    lines += `<polyline
      fill="none"
      stroke="${color}"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.8"
      points="${polyPoints}"
    />`;

    // Dots at each point
    for (const p of points) {
      dots += `<circle
        cx="${x(p.monthIdx)}"
        cy="${y(p.rank)}"
        r="3"
        fill="${color}"
        stroke="#fff"
        stroke-width="1"
      />`;
    }

    // Label at the last point (right edge)
    const last = points[points.length - 1];
    const emoji = memberData[name]?.emoji ?? "";
    labels += `<text
      x="${x(last.monthIdx) + 6}"
      y="${y(last.rank) + 4}"
      fill="${color}"
      font-family="Nunito, sans-serif"
      font-size="10"
      font-weight="700"
    >${name}${emoji}</text>`;
  }

  // Month labels on x-axis
  let xLabels = "";
  for (let i = 0; i < monthLabels.length; i++) {
    const date = new Date(monthLabels[i] + "-01");
    const label = date.toLocaleDateString("en-US", { month: "short" });
    xLabels += `<text
      x="${x(i)}"
      y="${height - 4}"
      text-anchor="middle"
      fill="#888"
      font-family="Nunito, sans-serif"
      font-size="10"
      font-weight="600"
    >${label}</text>`;
  }

  // Y-axis rank labels (just a few: 1, 12, 24)
  let yLabels = "";
  for (const r of [1, 6, 12, 18, 24]) {
    yLabels += `<text
      x="${pad.left - 6}"
      y="${y(r) + 4}"
      text-anchor="end"
      fill="#888"
      font-family="Nunito, sans-serif"
      font-size="9"
      font-weight="600"
    >#${r}</text>`;
  }

  return `<svg
    width="${width}"
    height="${height}"
    viewBox="0 0 ${width} ${height}"
    class="bump-chart"
    aria-label="Ranking movement chart"
  >
    <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + plotH}" stroke="#ddd" stroke-width="1"/>
    ${yLabels}
    ${xLabels}
    ${lines}
    ${dots}
    ${labels}
  </svg>`;
}

/**
 * Build rank history from all saved rankings.
 * @param {Array<{month: string, ranking: string[]}>} allRankings - from Supabase
 * @param {string[]} memberNames - all member names in display order
 * @returns {{ history: Object, months: string[] }}
 */
export function buildRankHistory(allRankings, memberNames) {
  const history = {};
  for (const name of memberNames) {
    history[name] = [];
  }

  const sorted = [...allRankings].sort(
    (a, b) => a.month.localeCompare(b.month),
  );

  const months = sorted.map((e) => e.month);

  for (const entry of sorted) {
    const ranking = entry.ranking;
    for (const name of memberNames) {
      const idx = ranking.indexOf(name);
      history[name].push(idx >= 0 ? idx + 1 : null);
    }
  }

  return { history, months };
}
