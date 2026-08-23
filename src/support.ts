import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/sections.css";
import "./styles/responsive.css";

import { initPageMotion } from "./motion";
import { initNavigation } from "./navigation";
import { initTheme } from "./theme";

const externalIcon = `
  <svg aria-hidden="true" viewBox="0 0 20 20">
    <path d="M7 13 13.5 6.5M9 6h5v5M14 12v3H5V6h3" />
  </svg>`;

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("App root not found.");

app.innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header" data-header>
    <div class="site-header__inner">
      <a class="brand" href="./index.html#top" aria-label="Veedence Robust Feature Planner home">
        <span class="brand__logo-frame">
          <img class="brand__logo" src="./assets/veedence-logo.png" alt="Veedence Ltd" />
        </span>
        <span class="brand__product">Robust Feature Planner</span>
      </a>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <a href="./index.html#why" data-nav-link>Why plan first</a>
        <a href="./index.html#method" data-nav-link>The method</a>
        <a href="./runtime-semantics.html" data-nav-link>Runtime audit</a>
        <a href="./solutions-architect.html" data-nav-link>Architect pass</a>
        <a href="./how-to-use.html" data-nav-link>How to use</a>
        <a href="./index.html#toolkit" data-nav-link>Get the toolkit</a>
      </nav>

      <div class="header-actions">
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch theme">
          <span class="theme-toggle__track" aria-hidden="true">
            <span class="theme-toggle__sun">☼</span>
            <span class="theme-toggle__moon">◐</span>
            <span class="theme-toggle__thumb"></span>
          </span>
          <span data-theme-label>Light</span>
        </button>
        <a class="header-cta" href="./index.html#toolkit">Get it free <span aria-hidden="true">↘</span></a>
        <button
          class="menu-toggle"
          type="button"
          data-menu-toggle
          aria-expanded="false"
          aria-controls="mobile-menu"
          aria-label="Open navigation"
        >
          <span></span><span></span>
        </button>
      </div>
    </div>

    <nav
      class="mobile-menu"
      id="mobile-menu"
      data-mobile-menu
      data-open="false"
      aria-label="Mobile navigation"
      aria-hidden="true"
      inert
    >
      <a href="./index.html#why" data-nav-link><span>01</span> Why plan first</a>
      <a href="./index.html#method" data-nav-link><span>02</span> The method</a>
      <a href="./runtime-semantics.html" data-nav-link><span>03</span> Runtime audit</a>
      <a href="./solutions-architect.html" data-nav-link><span>04</span> Architect pass</a>
      <a href="./how-to-use.html" data-nav-link><span>05</span> How to use</a>
      <a href="./index.html#toolkit" data-nav-link><span>06</span> Get the toolkit</a>
      <a href="mailto:hello@Veedence.co.uk"><span>07</span> Talk to Veedence</a>
    </nav>
  </header>

  <main id="main">
    <section class="runtime-page-hero" id="top" aria-labelledby="support-page-title">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container runtime-page-hero__layout">
        <div>
          <p class="eyebrow" data-hero-reveal>
            <span class="status-dot"></span>
            The person behind the planner
          </p>
          <h1 id="support-page-title" data-hero-reveal>
            Built to help,
            <em>not to bill.</em>
          </h1>
          <p class="runtime-page-hero__lead" data-hero-reveal>
            Simeon Williams built the Robust Feature Planner late at night, then gave it away —
            because better planning shouldn't be a privilege. It is free for everyone, forever.
            If it helps you, an optional thank-you helps fund better updates. Never required.
          </p>
          <div class="runtime-page-hero__actions" data-hero-reveal>
            <a class="button button--kofi" href="https://ko-fi.com/sim2k" target="_blank" rel="noreferrer">
              Buy Simeon a hot chocolate ${externalIcon}
            </a>
            <a class="button button--text" href="./index.html#top">
              Back to the planner <span aria-hidden="true">↩</span>
            </a>
          </div>
        </div>

        <article class="runtime-audit-card" data-hero-card aria-label="Support at a glance">
          <div class="runtime-audit-card__top">
            <span>Support</span>
            <span class="signal signal--safe">Optional</span>
          </div>
          <h2>Free for individuals. Powered by thanks.</h2>
          <p>
            Nothing here is paywalled for individuals. The skill, the prompt, the validators —
            free for personal use, forever. Teams and client work are licensed.
          </p>
          <dl>
            <div><dt>Price</dt><dd>Free for personal use, no sign-up. Teams and client work: licensed.</dd></div>
            <div><dt>Support</dt><dd>An optional Ko-fi hot chocolate - never required.</dd></div>
            <div><dt>It funds</dt><dd>Better updates, new modes, and late-night fixes.</dd></div>
          </dl>
        </article>
      </div>
    </section>

    <section class="runtime-plain section" aria-labelledby="support-story-title">
      <div class="container">
        <header class="section-heading section-heading--split" data-reveal>
          <div>
            <p class="eyebrow">Why this exists</p>
            <h2 id="support-story-title">Made for others, not just for himself.</h2>
          </div>
          <p>
            Simeon built the planner to fix his own late-night vibe-coding sessions - then realised
            everyone shipping with AI hits the same wall. So instead of keeping it, he shared it.
          </p>
        </header>
        <div class="runtime-grid">
          <article class="runtime-info-card" data-reveal>
            <span>01</span>
            <h3>Built from real pain</h3>
            <p>Every rule in the planner comes from a real failure: an invented context, a missing rollback, a plan that was really a guess.</p>
          </article>
          <article class="runtime-info-card" data-reveal>
            <span>02</span>
            <h3>Given away on purpose</h3>
            <p>The whole toolkit is free for personal use. No trial, no locked features - the best version is the one every individual gets.</p>
          </article>
          <article class="runtime-info-card" data-reveal>
            <span>03</span>
            <h3>Still being improved</h3>
            <p>The Runtime Semantics Audit, stronger validators, and traceability all shipped after release - and more is coming.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="runtime-use section" aria-labelledby="support-goes-title">
      <div class="container runtime-use__layout">
        <header class="section-heading" data-reveal>
          <p class="eyebrow">Where support goes</p>
          <h2 id="support-goes-title">Every hot chocolate funds a better planner.</h2>
          <p class="runtime-caveat">
            Support is never required to use the skill - the full toolkit stays free either way.
          </p>
        </header>
        <ul class="runtime-checklist">
          <li data-reveal><span>01</span><strong>Better updates</strong><small>New planning modes, sharper review gates, and refinements shaped by real feedback.</small></li>
          <li data-reveal><span>02</span><strong>Stronger tooling</strong><small>Validators, self-tests, and parity checks that keep every download trustworthy.</small></li>
          <li data-reveal><span>03</span><strong>More platforms</strong><small>Keeping the Claude, Codex, and raw-prompt versions in lockstep as tools evolve.</small></li>
          <li data-reveal><span>04</span><strong>Docs and examples</strong><small>Worked example plans and guides so newcomers can plan like veterans.</small></li>
          <li data-reveal><span>05</span><strong>Late-night time</strong><small>The honest one: the hours it takes to build and maintain things given away for free.</small></li>
        </ul>
      </div>
    </section>

    <section class="founder section" aria-labelledby="support-thanks-title">
      <div class="founder-grid" aria-hidden="true"></div>
      <div class="container founder__inner">
        <p class="eyebrow" data-reveal>Thank you</p>
        <blockquote id="support-thanks-title" data-reveal>
          Never required.
          <em>Always appreciated.</em>
        </blockquote>
        <p class="founder__message" data-reveal>
          If the planner saved you a bad deploy, a lost weekend, or an awkward rollback, that is
          already the point. If you'd like to say thanks as well, a hot chocolate keeps the updates
          coming - Simeon doesn't drink coffee, even though he probably needs it.
        </p>
        <div class="founder__actions" data-reveal>
          <a class="button button--light" href="https://ko-fi.com/sim2k" target="_blank" rel="noreferrer">
            Support on Ko-fi <span aria-hidden="true">↗</span>
          </a>
          <a class="button button--ghost-light" href="mailto:hello@Veedence.co.uk">
            Say hello instead ${externalIcon}
          </a>
        </div>
        <aside class="founder-support" data-reveal aria-label="Optional support for the project">
          <div class="founder-support__icon" aria-hidden="true">☕🍫</div>
          <div class="founder-support__copy">
            <span>One small ask</span>
            <h3>If you do contribute, leave a message.</h3>
            <p>
              Every Ko-fi message gets read. Tell Simeon what the planner caught for you —
              it shapes what gets built next.
            </p>
            <small>Free for personal use either way. Shared with intent. 🌙💚</small>
          </div>
          <a
            class="button button--kofi"
            href="https://ko-fi.com/sim2k"
            target="_blank"
            rel="noreferrer"
          >
            Visit Ko-fi <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <a class="brand brand--footer" href="./index.html#top">
        <span class="brand__logo-frame">
          <img class="brand__logo" src="./assets/veedence-logo.png" alt="Veedence Ltd" />
        </span>
        <span class="brand__product">Ideas, properly planned.</span>
      </a>
      <p>© ${new Date().getFullYear()} Veedence. Robust Feature Planner by Simeon Williams - free for personal use; team and client use is licensed.</p>
      <div class="site-footer__links">
        <a href="https://github.com/Sim2K/Planning-Prompt" target="_blank" rel="noreferrer">GitHub</a>
        <a href="./runtime-semantics.html">Runtime audit</a>
        <a href="./solutions-architect.html">Architect pass</a>
        <a href="./how-to-use.html">How to use</a>
        <a href="https://ko-fi.com/sim2k" target="_blank" rel="noreferrer">Ko-fi</a>
        <a href="mailto:hello@Veedence.co.uk">Contact</a>
        <a href="#top" aria-label="Back to top">↑</a>
      </div>
    </div>
  </footer>
`;

initTheme();
initNavigation();
initPageMotion();
