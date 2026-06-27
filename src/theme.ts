export type Theme = "dark" | "light";

const STORAGE_KEY = "veedence-planner-theme";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function updateThemeUi(theme: Theme): void {
  const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (button) {
    const next = theme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${next} mode`);
    button.setAttribute("title", `Switch to ${next} mode`);
    button.dataset.mode = theme;
    const label = button.querySelector<HTMLElement>("[data-theme-label]");
    if (label) label.textContent = theme === "dark" ? "Light" : "Dark";
  }
  if (meta) meta.content = theme === "dark" ? "#07110d" : "#f2f5ef";
}

export function initTheme(): void {
  updateThemeUi(currentTheme());
  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(STORAGE_KEY, next);
    updateThemeUi(next);
    window.dispatchEvent(new CustomEvent("veedence:theme", { detail: next }));
  });
}
