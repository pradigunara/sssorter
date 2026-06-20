const FLIP_MS = 350;

/** Yield to the browser so it can paint between heavy animation phases. */
function yieldToMain() {
  return new Promise((r) => setTimeout(r, 0));
}

/** Wait for an image to load. Uses naturalHeight to detect real load state. */
function waitForImage(img, ms = 3000) {
  if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
  return new Promise((r) => {
    const timer = setTimeout(r, ms);
    img.onload = img.onerror = () => { clearTimeout(timer); r(); };
  });
}

export async function animateCardUpdate(
  card, nextName, nextIdx, isSelected, updateContent, forceUpdate = false,
) {
  const curIdx = card.dataset.memberIndex != null
    ? parseInt(card.dataset.memberIndex, 10) : -1;
  const changed = forceUpdate || curIdx !== nextIdx;

  // No change and already rendered — don't touch it, no shake
  if (!changed && curIdx !== -1) {
    await new Promise((r) => setTimeout(r, FLIP_MS * 2));
    return;
  }

  // Reset state (only for cards that will animate)
  card.classList.remove("fade-out", "fade-in", "flip-out", "flip-in", "flip-ready", "selected-glow");
  card.style.opacity = "";
  card.style.transform = "";
  if (isSelected) card.classList.add("selected-glow");

  if (changed && curIdx !== -1) {
    // Flip out → swap content → yield → flip in
    card.classList.add("flip-out");
    await new Promise((r) => setTimeout(r, FLIP_MS));
    card.classList.remove("selected-glow");
    updateContent(card, nextName, nextIdx, forceUpdate);

    await waitForImage(card.querySelector(".photocard-image"));
    await yieldToMain();

    // Snap to start of flip-in (no transition), then trigger it
    card.classList.remove("flip-out");
    card.classList.add("flip-ready");
    // Let the browser apply flip-ready before starting flip-in transition
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    card.classList.remove("flip-ready");
    card.classList.add("flip-in");
    await new Promise((r) => setTimeout(r, FLIP_MS));
  } else if (curIdx === -1) {
    // First render — wait for image, then show it
    updateContent(card, nextName, nextIdx);
    await waitForImage(card.querySelector(".photocard-image"));
    card.style.visibility = "visible";
    card.style.opacity = 1;
  }

  card.classList.remove("selected-glow", "flip-out", "flip-in", "flip-ready");
  card.style.opacity = "";
  card.style.transform = "";
}
