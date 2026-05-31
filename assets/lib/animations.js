const FLIP_TRANSITION_MS = 350;

export function animateElement(element, ...animationClasses) {
  return new Promise((resolve) => {
    let resolved = false;
    const done = () => {
      if (resolved) return;
      resolved = true;
      element.removeEventListener("transitionend", onEnd);
      resolve();
    };
    const onEnd = (e) => { if (e.target === element) done(); };
    element.addEventListener("transitionend", onEnd);
    element.classList.add(...animationClasses);
    setTimeout(done, FLIP_TRANSITION_MS + 50);
  });
}

export async function animateCardUpdate(
  card,
  nextName,
  nextIdx,
  isSelected,
  updateContent,
  forceUpdate = false,
) {
  const curIdx = card.dataset.memberIndex != null
    ? parseInt(card.dataset.memberIndex, 10) : -1;
  const changed = forceUpdate || curIdx !== nextIdx;

  card.classList.remove("fade-out", "fade-in", "flip-out", "flip-in", "flip-ready", "selected-glow");
  card.style.opacity = "";
  card.style.transform = "";

  if (isSelected) card.classList.add("selected-glow");

  if (changed && curIdx !== -1) {
    await animateElement(card, "flip-out");
    card.classList.remove("selected-glow");
    updateContent(card, nextName, nextIdx);

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
      updateContent(card, nextName, nextIdx);
      card.style.visibility = "visible";
      card.style.opacity = 1;
    } else {
      await new Promise((resolve) =>
        setTimeout(resolve, FLIP_TRANSITION_MS * 2));
    }
  }

  card.classList.remove("selected-glow", "flip-out", "flip-in", "flip-ready");
  card.style.opacity = "";
  card.style.transform = "";
}
