export function initNavigation(): void {
  const header = document.querySelector<HTMLElement>("[data-header]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");

  const closeMenu = (): void => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    menu.dataset.open = "false";
    menu.setAttribute("aria-hidden", "true");
    menu.inert = true;
    document.body.classList.remove("menu-open");
  };

  toggle?.addEventListener("click", () => {
    if (!menu) return;
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    menu.dataset.open = String(!isOpen);
    menu.setAttribute("aria-hidden", String(isOpen));
    menu.inert = isOpen;
    document.body.classList.toggle("menu-open", !isOpen);
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const onScroll = (): void => {
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href?.startsWith("#")) return;
        const isActive = href === `#${visible.target.id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-20% 0px -70%", threshold: [0.1, 0.4, 0.7] },
  );

  sections.forEach((section) => observer.observe(section));
}
