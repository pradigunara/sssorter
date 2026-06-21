/**
 * Block long-press context menus on elements marked .touch-target / .touch-no-select.
 * Uses delegation so dynamically inserted controls (e.g. history month pills) are covered.
 */
export function initTouchTargets(root = document) {
  const selector = ".touch-target, .touch-no-select";
  root.addEventListener(
    "contextmenu",
    (e) => {
      if (e.target.closest(selector)) e.preventDefault();
    },
    true,
  );
}