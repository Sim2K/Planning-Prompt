import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initSmoothScroll(): void {
  if (reduceMotion) return;
  const lenis = new Lenis({
    duration: 1,
    smoothWheel: true,
    touchMultiplier: 1.25,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = anchor.getAttribute("href");
      if (!target || target === "#") return;
      const element = document.querySelector<HTMLElement>(target);
      if (!element) return;
      event.preventDefault();
      lenis.scrollTo(element, { offset: -72 });
      history.replaceState(null, "", target);
    });
  });
}

function initHero(): void {
  if (reduceMotion) return;
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  timeline
    .from(".site-header", { y: -24, opacity: 0, duration: 0.7 })
    .from(".hero [data-hero-reveal]", { y: 48, opacity: 0, duration: 0.9, stagger: 0.11 }, "-=0.35")
    .from(".planning-console", { x: 60, rotateY: -7, opacity: 0, duration: 1.1 }, "-=0.8")
    .from(".console-step", { x: 24, opacity: 0, stagger: 0.12, duration: 0.45 }, "-=0.55");

  const consoleCard = document.querySelector<HTMLElement>(".planning-console");
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!consoleCard || !hero || !window.matchMedia("(pointer: fine)").matches) return;

  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    gsap.to(consoleCard, {
      rotateY: x * 5,
      rotateX: y * -5,
      x: x * 12,
      y: y * 8,
      duration: 0.7,
      ease: "power2.out",
    });
  });

  hero.addEventListener("pointerleave", () => {
    gsap.to(consoleCard, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.9 });
  });
}

function initScrollMotion(): void {
  if (reduceMotion) {
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "none";
    });
    return;
  }

  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%",
    once: true,
    onEnter: (items) => {
      gsap.fromTo(
        items,
        { y: 38, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" },
      );
    },
  });

  gsap.fromTo(
    ".method-line__progress",
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".method-list",
        start: "top 70%",
        end: "bottom 70%",
        scrub: true,
      },
    },
  );

  gsap.to(".orbit-ring--one", { rotate: 360, duration: 28, repeat: -1, ease: "none" });
  gsap.to(".orbit-ring--two", { rotate: -360, duration: 36, repeat: -1, ease: "none" });
  gsap.to(".hero-glow", { scale: 1.15, opacity: 0.78, duration: 4, yoyo: true, repeat: -1 });
}

function initPlanTabs(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-plan-tab]");
  const panels = document.querySelectorAll<HTMLElement>("[data-plan-panel]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.planTab;
      buttons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.setAttribute("aria-selected", String(selected));
        candidate.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.planPanel !== target;
      });
    });
  });
}

export function initMotion(): void {
  initSmoothScroll();
  initHero();
  initScrollMotion();
  initPlanTabs();
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}
