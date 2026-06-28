import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/sections.css";
import "./styles/responsive.css";

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
        <a href="./runtime-semantics.html" class="is-active" aria-current="page" data-nav-link>Runtime audit</a>
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
      <a href="./index.html#toolkit" data-nav-link><span>04</span> Get the toolkit</a>
      <a href="mailto:hello@Veedence.co.uk"><span>05</span> Talk to Veedence</a>
    </nav>
  </header>

  <main id="main">
    <section class="runtime-page-hero" id="top" aria-labelledby="runtime-page-title">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container runtime-page-hero__layout">
        <div>
          <p class="eyebrow">
            <span class="status-dot"></span>
            New optional mode · off by default
          </p>
          <h1 id="runtime-page-title">
            Runtime Semantics <em>Audit.</em>
          </h1>
          <p class="runtime-page-hero__lead">
            The planner now has a deeper switch for features where timing, retries, transactions,
            or shared state can quietly change what production code really does. It does not promise
            certainty. It points reviewers at the assumptions that need human proof.
          </p>
          <div class="runtime-page-hero__actions">
            <a class="button button--primary" href="https://github.com/Sim2K/Planning-Prompt" target="_blank" rel="noreferrer">
              Get the updated toolkit ${externalIcon}
            </a>
            <a class="button button--text" href="./index.html#runtime-update">
              Back to the update <span aria-hidden="true">↩</span>
            </a>
          </div>
        </div>

        <article class="runtime-audit-card" aria-label="Runtime Semantics Audit summary">
          <div class="runtime-audit-card__top">
            <span>Switch</span>
            <span class="signal signal--safe">Manual</span>
          </div>
          <h2>Expose the assumptions before the build trusts them.</h2>
          <p>
            Ask for it with <strong>+runtime-audit</strong>. The normal planner still runs first;
            this adds a focused audit of where the plan might be wrong at runtime.
          </p>
          <dl>
            <div><dt>Default</dt><dd>OFF, so ordinary planning behavior stays unchanged.</dd></div>
            <div><dt>Output</dt><dd>Invariants Ledger plus a ranked Reviewer Hotlist.</dd></div>
            <div><dt>Caveat</dt><dd>An invitation to review, not a certificate.</dd></div>
          </dl>
        </article>
      </div>
    </section>

    <section class="runtime-plain section" aria-labelledby="runtime-adds-title">
      <div class="container">
        <header class="section-heading section-heading--split">
          <div>
            <p class="eyebrow">What it adds</p>
            <h2 id="runtime-adds-title">A plan that argues against itself.</h2>
          </div>
          <p>
            This is for the moments where “looks fine” is not enough: money, inventory,
            counters, status changes, queues, webhooks, shared caches, and transaction-heavy work.
          </p>
        </header>
        <div class="runtime-grid">
          <article class="runtime-info-card">
            <span>01</span>
            <h3>Invariants Ledger</h3>
            <p>Names what the plan is assuming about timing, ownership, transaction boundaries, and delivery order.</p>
          </article>
          <article class="runtime-info-card">
            <span>02</span>
            <h3>Reviewer Hotlist</h3>
            <p>Ranks the highest-blast, lowest-confidence checks so a seasoned reviewer knows where to spend attention.</p>
          </article>
          <article class="runtime-info-card">
            <span>03</span>
            <h3>Extra validator</h3>
            <p>Checks the audit is structurally present and filled in, while still making clear that structure is not proof.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="runtime-use section" aria-labelledby="runtime-use-title">
      <div class="container runtime-use__layout">
        <header class="section-heading">
          <p class="eyebrow">When to use it</p>
          <h2 id="runtime-use-title">Use it where small timing mistakes become real incidents.</h2>
        </header>
        <ul class="runtime-checklist">
          <li><span>01</span><strong>Shared records</strong><small>Balances, stock, counters, status flags, or anything multiple paths can update.</small></li>
          <li><span>02</span><strong>Background delivery</strong><small>Queues, webhooks, retries, scheduled jobs, and “at least once” style behavior.</small></li>
          <li><span>03</span><strong>Shared runtime resources</strong><small>Connection pools, caches, locks, sessions, files, subscriptions, or long-lived clients.</small></li>
          <li><span>04</span><strong>Concurrent execution</strong><small>Async work, workers, threads, callbacks, or two users changing the same thing at once.</small></li>
          <li><span>05</span><strong>Transaction assumptions</strong><small>Read-modify-write flows where isolation level and atomicity decide correctness.</small></li>
        </ul>
      </div>
    </section>

    <section class="runtime-command section" aria-labelledby="runtime-command-title">
      <div class="container runtime-command__layout">
        <div class="section-heading">
          <p class="eyebrow">How to turn it on</p>
          <h2 id="runtime-command-title">Ask for the deeper pass only when you need it.</h2>
          <p>
            The switch stays manual. The planner may offer it when it sees risk, but it should not
            run the heavy audit unless you ask or accept the offer.
          </p>
          <p class="runtime-caveat">
            A green Runtime Semantics ledger is an invitation to review, not a certificate.
          </p>
        </div>
        <div class="runtime-command-box" aria-label="Runtime Semantics activation examples">
          <code>+runtime-audit</code>
          <code>RUNTIME-AUDIT: ON</code>
          <code>"run the runtime audit"</code>
          <code>"where might this plan be wrong?"</code>
        </div>
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
      <p>© ${new Date().getFullYear()} Veedence. Robust Feature Planner released under the MIT licence.</p>
      <div class="site-footer__links">
        <a href="https://github.com/Sim2K/Planning-Prompt" target="_blank" rel="noreferrer">GitHub</a>
        <a href="./runtime-semantics.html">Runtime audit</a>
        <a href="https://ko-fi.com/sim2k" target="_blank" rel="noreferrer">Ko-fi</a>
        <a href="mailto:hello@Veedence.co.uk">Contact</a>
        <a href="#top" aria-label="Back to top">↑</a>
      </div>
    </div>
  </footer>
`;

initTheme();
initNavigation();
