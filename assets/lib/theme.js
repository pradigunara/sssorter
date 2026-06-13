const SUN_SVG =
  '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
const MOON_SVG =
  '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

export function initTheme(els, onThemeChange) {
  const savedDarkMode = localStorage.getItem("darkMode");
  const toggle = document.querySelector(".theme-toggle");

  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
    els.themeToggleText.textContent = "Light Mode";
    setThemeIcon(true);
    toggle.setAttribute("aria-checked", "true");
  }

  function handleToggle() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    els.themeToggleText.textContent = isDarkMode ? "Light Mode" : "#DarkMode";
    setThemeIcon(isDarkMode);
    toggle.setAttribute("aria-checked", String(isDarkMode));
    localStorage.setItem("darkMode", isDarkMode);
    onThemeChange(isDarkMode);
  }

  toggle.addEventListener("click", handleToggle);
  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  });
}

function setThemeIcon(isDarkMode) {
  document.querySelector(".theme-toggle-icon svg").innerHTML = isDarkMode
    ? SUN_SVG
    : MOON_SVG;
}
