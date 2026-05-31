const pages = [
  "page-sorter",
  "page-result",
  "history-page",
  "chart-modal",
];

export function showPage(activeId) {
  for (const id of pages) {
    const el = document.getElementById(id);
    if (!el) continue;

    if (id === activeId) {
      el.classList.remove("is-hidden");
      if (id === "chart-modal") el.classList.add("is-visible");
    } else {
      el.classList.add("is-hidden");
      el.classList.remove("is-visible");
    }
  }
}
