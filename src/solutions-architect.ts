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

const glyphTable = `
  <svg class="sa-glyph" aria-hidden="true" viewBox="0 0 44 44">
    <rect x="6" y="9" width="32" height="26" rx="4" />
    <path d="M6 17h32M17 17v18M28 17v18" />
    <path class="sa-glyph__accent" d="m9.5 12.5 2 2 3.4-3.8" />
  </svg>`;

const glyphOptions = `
  <svg class="sa-glyph" aria-hidden="true" viewBox="0 0 44 44">
    <path d="M22 7v9M22 16c0 6-11 4-11 11v3M22 16c0 6 11 4 11 11v3" />
    <circle class="sa-glyph__accent" cx="22" cy="7" r="3.2" />
    <circle class="sa-glyph__win" cx="11" cy="34" r="3.6" />
    <circle cx="33" cy="34" r="3.2" />
    <path class="sa-glyph__lost" d="m30 31 6 6M36 31l-6 6" />
  </svg>`;

const glyphVerify = `
  <svg class="sa-glyph" aria-hidden="true" viewBox="0 0 44 44">
    <circle cx="19" cy="19" r="11" />
    <path d="m27.5 27.5 9 9" />
    <path class="sa-glyph__accent" d="m14.5 19 3.2 3.2 6-6.4" />
  </svg>`;

const decisionTree = `
  <svg class="sa-tree" viewBox="0 0 380 250" role="img" aria-label="The chosen architecture decomposed into decisions D1, D2, and D3, each comparing three options where one wins and the losers are struck out">
    <g class="sa-tree__lines" fill="none">
      <path class="sa-tree__line" d="M190 46v22" />
      <path class="sa-tree__line" d="M190 68c-70 0-120 10-120 42" />
      <path class="sa-tree__line" d="M190 68v42" />
      <path class="sa-tree__line" d="M190 68c70 0 120 10 120 42" />
      <path class="sa-tree__line" d="M70 138v16M70 154c-22 0-34 8-34 22M70 154v22M70 154c22 0 34 8 34 22" />
      <path class="sa-tree__line" d="M190 138v16M190 154c-22 0-34 8-34 22M190 154v22M190 154c22 0 34 8 34 22" />
      <path class="sa-tree__line" d="M310 138v16M310 154c-22 0-34 8-34 22M310 154v22M310 154c22 0 34 8 34 22" />
    </g>
    <g class="sa-tree__root">
      <rect x="112" y="14" width="156" height="32" rx="9" />
      <text x="190" y="35" text-anchor="middle">CHOSEN ARCHITECTURE</text>
    </g>
    <g class="sa-tree__node">
      <rect x="34" y="110" width="72" height="28" rx="8" />
      <text x="70" y="129" text-anchor="middle">D1 · shape</text>
    </g>
    <g class="sa-tree__node">
      <rect x="154" y="110" width="72" height="28" rx="8" />
      <text x="190" y="129" text-anchor="middle">D2 · writer</text>
    </g>
    <g class="sa-tree__node">
      <rect x="274" y="110" width="72" height="28" rx="8" />
      <text x="310" y="129" text-anchor="middle">D3 · scope</text>
    </g>
    <g class="sa-tree__options">
      <circle class="sa-tree__win" cx="36" cy="184" r="6" />
      <g class="sa-tree__lost"><circle cx="70" cy="184" r="6" /><path d="m66 180 8 8M74 180l-8 8" /></g>
      <g class="sa-tree__lost"><circle cx="104" cy="184" r="6" /><path d="m100 180 8 8M108 180l-8 8" /></g>
      <g class="sa-tree__lost"><circle cx="156" cy="184" r="6" /><path d="m152 180 8 8M160 180l-8 8" /></g>
      <circle class="sa-tree__win" cx="190" cy="184" r="6" />
      <g class="sa-tree__lost"><circle cx="224" cy="184" r="6" /><path d="m220 180 8 8M228 180l-8 8" /></g>
      <g class="sa-tree__lost"><circle cx="276" cy="184" r="6" /><path d="m272 180 8 8M280 180l-8 8" /></g>
      <g class="sa-tree__lost"><circle cx="310" cy="184" r="6" /><path d="m306 180 8 8M314 180l-8 8" /></g>
      <circle class="sa-tree__win" cx="344" cy="184" r="6" />
    </g>
    <g class="sa-tree__legend">
      <circle class="sa-tree__win" cx="96" cy="226" r="5" />
      <text x="108" y="230">chosen, with evidence</text>
      <g class="sa-tree__lost"><circle cx="230" cy="226" r="5" /><path d="m226.6 222.6 6.8 6.8M233.4 222.6l-6.8 6.8" /></g>
      <text x="242" y="230">lost, with a reason</text>
    </g>
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
        <a href="./solutions-architect.html" class="is-active" aria-current="page" data-nav-link>Architect pass</a>
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
    <section class="runtime-page-hero" id="top" aria-labelledby="architect-page-title">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="orbit orbit--hero" aria-hidden="true">
        <span class="orbit-ring orbit-ring--one"></span>
        <span class="orbit-ring orbit-ring--two"></span>
      </div>
      <div class="container runtime-page-hero__layout">
        <div>
          <p class="eyebrow" data-hero-reveal>
            <span class="status-dot"></span>
            New optional mode · off by default
          </p>
          <h1 id="architect-page-title" data-hero-reveal>
            Solutions Architect <em>Pass.</em>
          </h1>
          <p class="runtime-page-hero__lead" data-hero-reveal>
            The planner compares three architectures before it picks one. This deeper switch keeps
            going: it breaks the winning design into every decision hiding inside it, compares real
            options for each against your actual code, and writes down why the losers lost.
          </p>
          <div class="runtime-page-hero__actions" data-hero-reveal>
            <a class="button button--primary" href="#architect-command">
              How to turn it on <span aria-hidden="true">↓</span>
            </a>
            <a class="button button--text" href="https://github.com/Sim2K/Planning-Prompt" target="_blank" rel="noreferrer">
              Get the updated toolkit ${externalIcon}
            </a>
          </div>
        </div>

        <div class="sa-visual" data-hero-card>
          <article class="sa-console" aria-label="How the Solutions Architect Pass decomposes a design">
            <div class="sa-console__top">
              <span>decision-record.md</span>
              <span class="signal signal--safe">Opt-in</span>
            </div>
            ${decisionTree}
            <div class="sa-console__foot">
              <span>OUTPUT</span>
              <p><strong>✓</strong> Every choice examined. Every rejection explained.</p>
            </div>
          </article>
          <aside class="floating-note sa-note sa-note--fact" aria-hidden="true">
            <span>Fact re-verified</span>
            Write policy needs a permission the users don't hold
          </aside>
          <aside class="floating-note sa-note sa-note--loser" aria-hidden="true">
            <span>Loser recorded</span>
            Per-recipient rows lost: 50× write volume
          </aside>
        </div>
      </div>
    </section>

    <section class="runtime-plain section" aria-labelledby="architect-adds-title">
      <div class="container">
        <header class="section-heading section-heading--split" data-reveal>
          <div>
            <p class="eyebrow">What it adds</p>
            <h2 id="architect-adds-title">Three branches choose the design. This examines everything inside it.</h2>
          </div>
          <p>
            The choices that actually sink implementations rarely lose at the top level. They hide
            inside the winning branch - how a table is shaped, who may write it, when a value is
            resolved, what scope a setting lives at - and normally become prose nobody can argue with.
          </p>
        </header>
        <div class="runtime-grid">
          <article class="runtime-info-card sa-card" data-reveal>
            ${glyphTable}
            <span>01</span>
            <h3>Decision Table</h3>
            <p>Every contested choice gets a stable ID (D1, D2, …), a chosen option, the losing options - and why each loser lost.</p>
          </article>
          <article class="runtime-info-card sa-card" data-reveal>
            ${glyphOptions}
            <span>02</span>
            <h3>Option Analyses</h3>
            <p>Three genuinely different options per decision, checked against the actual code, with a “what would flip this” line for every winner.</p>
          </article>
          <article class="runtime-info-card sa-card" data-reveal>
            ${glyphVerify}
            <span>03</span>
            <h3>Re-Verified Facts</h3>
            <p>The facts the decisions rest on are re-checked with fresh eyes - Confirmed, Contradicted, or Unverified - never carried forward on trust.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="runtime-use section" aria-labelledby="architect-how-title">
      <div class="container runtime-use__layout">
        <header class="section-heading" data-reveal>
          <p class="eyebrow">How it works</p>
          <h2 id="architect-how-title">A worker for the decisions, not a second plan.</h2>
          <p>
            The pass stays read-only and its output lands in the plan as an appendix - the plan
            still has to earn every base review gate on its own.
          </p>
        </header>
        <ul class="runtime-checklist">
          <li data-reveal><span>01</span><strong>Decompose the winner</strong><small>The chosen architecture is broken into named sub-decisions - the choices that would force a migration if made wrong.</small></li>
          <li data-reveal><span>02</span><strong>Compare real options</strong><small>Each decision gets three options that differ in what gets built - not three phrasings of the same idea.</small></li>
          <li data-reveal><span>03</span><strong>Join facts across modules</strong><small>The killers live in the joins: a write policy in one module vs. who actually holds the permission in another.</small></li>
          <li data-reveal><span>04</span><strong>Re-verify independently</strong><small>Load-bearing facts are re-read in the code itself - by a fresh-context agent where the platform supports one.</small></li>
          <li data-reveal><span>05</span><strong>Record why the losers lost</strong><small>The rejection reasons land in the plan, so a settled choice never gets re-litigated by someone who never saw the evidence.</small></li>
        </ul>
      </div>
    </section>

    <section class="runtime-use section" aria-labelledby="architect-when-title">
      <div class="container runtime-use__layout">
        <header class="section-heading" data-reveal>
          <p class="eyebrow">When to ask for it</p>
          <h2 id="architect-when-title">Use it where one paragraph quietly settles five arguments.</h2>
        </header>
        <ul class="runtime-checklist">
          <li data-reveal><span>01</span><strong>New tables and queues</strong><small>A shape, scope, or granularity that could reasonably be built more than one way.</small></li>
          <li data-reveal><span>02</span><strong>Cross-module writes</strong><small>The feature writes into another module's tables, permissions, or events.</small></li>
          <li data-reveal><span>03</span><strong>Interlocking choices</strong><small>Schema, permissions, scheduling, and seeding all being settled at once.</small></li>
          <li data-reveal><span>04</span><strong>History of reversals</strong><small>The repo has already migrated a similar decision once - scope changes especially.</small></li>
          <li data-reveal><span>05</span><strong>Infrastructure gates</strong><small>CI checks or migration rules that can force a different product decision than the obvious one.</small></li>
        </ul>
      </div>
    </section>

    <section class="runtime-command section" id="architect-command" aria-labelledby="architect-command-title">
      <div class="container runtime-command__layout">
        <div class="section-heading" data-reveal>
          <p class="eyebrow">How to turn it on</p>
          <h2 id="architect-command-title">Ask for the deep-dive only when the design earns it.</h2>
          <p>
            The switch stays manual. The planner may offer the pass when it notices a design hiding
            several contested choices, but it never runs uninvited - and it composes freely with the
            <a href="./runtime-semantics.html">Runtime Semantics Audit</a>.
          </p>
          <p class="runtime-caveat">
            A complete Decision Record means the options were enumerated and evidence-checked - not
            that the winner is proven correct.
          </p>
          <a class="button button--text" href="./how-to-use.html#architect">
            Copy-ready invocations on the how-to page <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div class="runtime-command-box" aria-label="Solutions Architect activation examples">
          <code>+solutions-architect</code>
          <code>SOLUTIONS-ARCHITECT: ON</code>
          <code>"decompose the design"</code>
          <code>"why did the alternatives lose?"</code>
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
