import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/sections.css";
import "./styles/responsive.css";

import { DOWNLOADS, METHOD_STEPS, PLAN_SECTIONS, THINKING_MAPS } from "./content";
import { initMotion } from "./motion";
import { initNavigation } from "./navigation";
import { initTheme } from "./theme";

const externalIcon = `
  <svg aria-hidden="true" viewBox="0 0 20 20">
    <path d="M7 13 13.5 6.5M9 6h5v5M14 12v3H5V6h3" />
  </svg>`;

const checkIcon = `
  <svg aria-hidden="true" viewBox="0 0 20 20">
    <path d="m4 10 3.2 3.2L16 5.8" />
  </svg>`;

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("App root not found.");

app.innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header" data-header>
    <div class="site-header__inner">
      <a class="brand" href="#top" aria-label="Veedence Robust Feature Planner home">
        <span class="brand__logo-frame">
          <img class="brand__logo" src="./assets/veedence-logo.png" alt="Veedence Ltd" />
        </span>
        <span class="brand__product">Robust Feature Planner</span>
      </a>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <a href="#why" data-nav-link>Why plan first</a>
        <a href="#method" data-nav-link>The method</a>
        <a href="./runtime-semantics.html" data-nav-link>Runtime audit</a>
        <a href="#toolkit" data-nav-link>Get the toolkit</a>
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
        <a class="header-cta" href="#toolkit">Get it free <span aria-hidden="true">↘</span></a>
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
      <a href="#why" data-nav-link><span>01</span> Why plan first</a>
      <a href="#method" data-nav-link><span>02</span> The method</a>
      <a href="./runtime-semantics.html" data-nav-link><span>03</span> Runtime audit</a>
      <a href="#toolkit" data-nav-link><span>04</span> Get the toolkit</a>
      <a href="mailto:hello@Veedence.co.uk"><span>05</span> Talk to Veedence</a>
    </nav>
  </header>

  <main id="main">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="orbit orbit--hero" aria-hidden="true">
        <span class="orbit-ring orbit-ring--one"></span>
        <span class="orbit-ring orbit-ring--two"></span>
      </div>

      <div class="container hero__layout">
        <div class="hero__copy">
          <p class="eyebrow" data-hero-reveal>
            <span class="status-dot"></span>
            Open-source planning system · Claude · Codex · Any LLM
          </p>
          <h1 id="hero-title" data-hero-reveal>
            Before AI builds it,
            <em>make it understand it.</em>
          </h1>
          <p class="hero__lead" data-hero-reveal>
            “AI, make me a feature” is a gamble. The Veedence Robust Feature Planner turns
            vague intent into an evidence-grounded, failure-aware blueprint before a single
            production file changes.
          </p>
          <div class="hero__actions" data-hero-reveal>
            <a class="button button--primary" href="#toolkit">
              Choose your toolkit <span aria-hidden="true">↓</span>
            </a>
            <a
              class="button button--text"
              href="${DOWNLOADS[2].href}"
              target="_blank"
              rel="noreferrer"
            >
              Read the raw prompt ${externalIcon}
            </a>
          </div>
          <dl class="hero__proof" data-hero-reveal>
            <div><dt>20</dt><dd>plan sections</dd></div>
            <div><dt>8+1</dt><dd>thinking checks</dd></div>
            <div><dt>3+</dt><dd>architecture branches</dd></div>
            <div><dt>0</dt><dd>guesses dressed as facts</dd></div>
          </dl>
        </div>

        <div class="hero__visual" aria-label="The robust planning workflow">
          <article class="planning-console">
            <div class="console-topbar">
              <div class="console-dots" aria-hidden="true"><span></span><span></span><span></span></div>
              <span>feature-plan.md</span>
              <span class="console-status">Planning only</span>
            </div>
            <div class="console-request">
              <span class="console-request__label">Feature request</span>
              <p>“Add collaborative workspaces with role-based access.”</p>
            </div>
            <div class="console-flow">
              <div class="console-step">
                <span class="console-step__number">01</span>
                <div><strong>Discover</strong><small>Repo · schema · auth · flows</small></div>
                <span class="console-check">${checkIcon}</span>
              </div>
              <div class="console-step">
                <span class="console-step__number">02</span>
                <div><strong>Map risk</strong><small>Dependencies · failures · UX</small></div>
                <span class="console-check">${checkIcon}</span>
              </div>
              <div class="console-step">
                <span class="console-step__number">03</span>
                <div><strong>Compare branches</strong><small>Conservative · modular · fast</small></div>
                <span class="console-check">${checkIcon}</span>
              </div>
              <div class="console-step console-step--active">
                <span class="console-step__number">04</span>
                <div><strong>Write & review</strong><small>Tasks · tests · rollout · rollback</small></div>
                <span class="console-loader" aria-hidden="true"></span>
              </div>
            </div>
            <div class="console-output">
              <span>OUTPUT</span>
              <p><strong>✓</strong> Production-ready plan, not a confident guess.</p>
            </div>
          </article>
          <aside class="floating-note floating-note--risk">
            <span>Risk caught</span>
            Existing clients need v1 compatibility
          </aside>
          <aside class="floating-note floating-note--rollback">
            <span>Rollback</span>
            Expand → migrate → contract
          </aside>
        </div>
      </div>

      <div class="hero-marquee" aria-hidden="true">
        <div>
          DISCOVER FIRST <span>✦</span> MAP THE BLAST RADIUS <span>✦</span> COMPARE BRANCHES
          <span>✦</span> DESIGN FOR FAILURE <span>✦</span> VALIDATE THE PLAN <span>✦</span>
          DISCOVER FIRST <span>✦</span> MAP THE BLAST RADIUS <span>✦</span> COMPARE BRANCHES
          <span>✦</span> DESIGN FOR FAILURE <span>✦</span> VALIDATE THE PLAN <span>✦</span>
        </div>
      </div>
    </section>

    <section class="comparison section" id="why" aria-labelledby="comparison-title">
      <div class="container">
        <header class="section-heading section-heading--wide" data-reveal>
          <p class="eyebrow">The expensive five-word prompt</p>
          <h2 id="comparison-title">“AI, make me a feature.”</h2>
          <p>
            It sounds fast because all the difficult questions are hidden. Pre-planning surfaces
            them while they are still cheap to answer.
          </p>
        </header>

        <div class="comparison-grid">
          <article class="comparison-card comparison-card--guess" data-reveal>
            <div class="comparison-card__topline">
              <span>Prompt-first</span><span class="signal signal--danger">Unverified</span>
            </div>
            <h3>Ship the assumption.</h3>
            <p>Code starts before the system is understood.</p>
            <ul>
              <li><span>01</span><strong>Invented context</strong><small>The model fills gaps from memory.</small></li>
              <li><span>02</span><strong>Happy-path architecture</strong><small>Retries and partial writes arrive later.</small></li>
              <li><span>03</span><strong>Hidden blast radius</strong><small>Existing clients become the test suite.</small></li>
              <li><span>04</span><strong>Rollback by panic</strong><small>No staged path back to safety.</small></li>
            </ul>
            <div class="card-outcome card-outcome--danger">
              <span>Outcome</span> Fast first draft. Expensive second week.
            </div>
          </article>

          <div class="comparison-vs" aria-hidden="true">
            <span>VS</span>
            <i></i>
          </div>

          <article class="comparison-card comparison-card--plan" data-reveal>
            <div class="comparison-card__topline">
              <span>Plan-first</span><span class="signal signal--safe">Evidence-led</span>
            </div>
            <h3>Build the understanding.</h3>
            <p>Discovery earns the right to design.</p>
            <ul>
              <li><span>01</span><strong>Observed reality</strong><small>Code, schema, tools, and constraints are inspected.</small></li>
              <li><span>02</span><strong>Failure-aware design</strong><small>Degradation, recovery, and replay are explicit.</small></li>
              <li><span>03</span><strong>Compared architecture</strong><small>The simplest robust branch wins.</small></li>
              <li><span>04</span><strong>Safe execution order</strong><small>Every phase has evidence and an exit path.</small></li>
            </ul>
            <div class="card-outcome card-outcome--safe">
              <span>Outcome</span> A plan another developer can safely execute.
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="runtime-update section" id="runtime-update" aria-labelledby="runtime-update-title">
      <div class="container runtime-update__layout">
        <div class="runtime-update__copy" data-reveal>
          <p class="eyebrow">Update · Optional deeper check</p>
          <h2 id="runtime-update-title">Runtime Semantics Audit</h2>
          <p>
            Some plans look right on paper, then fail when two requests land together, a queue retries,
            or a transaction behaves differently than expected. This new opt-in mode makes the planner
            show those hidden assumptions before anyone treats the plan as safe.
          </p>
          <a class="button button--primary" href="./runtime-semantics.html">
            Read about the update <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div class="runtime-update__panel" data-reveal aria-label="Runtime Semantics Audit summary">
          <div class="runtime-switch">
            <span>Switch</span>
            <strong>OFF by default</strong>
          </div>
          <ul>
            <li><span>01</span><strong>Find the hidden assumptions</strong><small>Timing, ownership, transactions, and delivery order.</small></li>
            <li><span>02</span><strong>Show where the plan may be wrong</strong><small>Not reassurance — a focused review target.</small></li>
            <li><span>03</span><strong>Hand reviewers a short hotlist</strong><small>The diffs a seasoned engineer should inspect before merge.</small></li>
          </ul>
          <code>+runtime-audit</code>
        </div>
      </div>
    </section>

    <section class="method section" id="method" aria-labelledby="method-title">
      <div class="container method__intro">
        <div class="section-heading" data-reveal>
          <p class="eyebrow">The Veedence method</p>
          <h2 id="method-title">Discover. Map. Branch. Design. Review.</h2>
        </div>
        <p class="method__promise" data-reveal>
          A disciplined path from “wouldn’t it be useful if…” to a plan that names the modules,
          contracts, risks, validation, deployment order, and way back.
        </p>
      </div>

      <div class="container method-list">
        <div class="method-line" aria-hidden="true"><span class="method-line__progress"></span></div>
        ${METHOD_STEPS.map(
          (step) => `
            <article class="method-step" data-reveal>
              <div class="method-step__number">${step.number}</div>
              <div class="method-step__verb">${step.verb}</div>
              <div class="method-step__content">
                <h3>${step.title}</h3>
                <p>${step.body}</p>
              </div>
              <div class="method-step__output"><span>Output</span>${step.output}</div>
            </article>
          `,
        ).join("")}
      </div>
    </section>

    <section class="maps section" aria-labelledby="maps-title">
      <div class="maps-orbit" aria-hidden="true">
        <span class="orbit-ring orbit-ring--one"></span>
        <span class="orbit-ring orbit-ring--two"></span>
      </div>
      <div class="container">
        <header class="section-heading section-heading--split" data-reveal>
          <div>
            <p class="eyebrow">Eight disciplines + optional ninth</p>
            <h2 id="maps-title">See the whole system, not just the ticket.</h2>
          </div>
          <p>
            The planner builds eight connected working maps, then can add the Runtime Semantics
            check when the work needs deeper proof around timing, ownership, and transactions.
          </p>
        </header>
        <div class="maps-grid">
          ${THINKING_MAPS.map(
            ([number, title, body]) => `
              <article class="map-card" data-reveal>
                <div class="map-card__head"><span>${number}</span><i aria-hidden="true"></i></div>
                <h3>${title}</h3>
                <p>${body}</p>
              </article>
            `,
          ).join("")}
        </div>
      </div>
    </section>

    <section class="blueprint section" aria-labelledby="blueprint-title">
      <div class="container blueprint__layout">
        <div class="blueprint__copy" data-reveal>
          <p class="eyebrow">One repeatable blueprint</p>
          <h2 id="blueprint-title">The plan is the product before the product.</h2>
          <p>
            A predictable structure makes plans easier to review, hand over, estimate, and turn
            into tracked work. Conditional sections stay honest: “not applicable” needs evidence.
          </p>
          <div class="blueprint-tabs" role="tablist" aria-label="Plan quality views">
            <button id="tab-coverage" role="tab" aria-selected="true" aria-controls="panel-coverage" data-plan-tab="coverage">Coverage</button>
            <button id="tab-execution" role="tab" aria-selected="false" aria-controls="panel-execution" tabindex="-1" data-plan-tab="execution">Execution</button>
            <button id="tab-review" role="tab" aria-selected="false" aria-controls="panel-review" tabindex="-1" data-plan-tab="review">Review</button>
          </div>
          <div class="blueprint-panel" id="panel-coverage" role="tabpanel" aria-labelledby="tab-coverage" data-plan-panel="coverage">
            Maps data, APIs, UX, security, failure isolation, operations, rollout, and recovery.
          </div>
          <div class="blueprint-panel" id="panel-execution" role="tabpanel" aria-labelledby="tab-execution" data-plan-panel="execution" hidden>
            Orders checklist tasks by dependency, with ownership, interfaces, and acceptance evidence.
          </div>
          <div class="blueprint-panel" id="panel-review" role="tabpanel" aria-labelledby="tab-review" data-plan-panel="review" hidden>
            Traces every material risk to a decision, task, validation step, or explicit non-goal.
          </div>
        </div>

        <div class="plan-sheet" data-reveal aria-label="Example feature plan contents">
          <div class="plan-sheet__top">
            <span>FEATURE-PLAN / 01</span>
            <span class="signal signal--safe">Reviewed</span>
          </div>
          <div class="plan-sheet__title">
            <small>Production implementation plan</small>
            <strong>Collaborative workspaces</strong>
          </div>
          <ol>
            ${PLAN_SECTIONS.map(
              (section, index) => `
                <li><span>${String(index + 1).padStart(2, "0")}</span>${section}<i>${index < 4 ? "Observed" : "Planned"}</i></li>
              `,
            ).join("")}
          </ol>
          <div class="plan-sheet__stamp">SAFE TO<br />IMPLEMENT</div>
        </div>
      </div>
    </section>

    <section class="toolkit section" id="toolkit" aria-labelledby="toolkit-title">
      <div class="container">
        <header class="section-heading section-heading--split" data-reveal>
          <div>
            <p class="eyebrow">Free, open, ready to use</p>
            <h2 id="toolkit-title">Choose your planning surface.</h2>
          </div>
          <p>
            Same methodology. Three ways in. Install the native skill for repeat work, or take
            the raw prompt anywhere.
          </p>
        </header>

        <div class="download-grid">
          ${DOWNLOADS.map(
            (download) => `
              <a
                class="download-card download-card--${download.id}"
                href="${download.href}"
                target="_blank"
                rel="noreferrer"
                data-reveal
              >
                <div class="download-card__top">
                  <span>${download.index}</span>
                  <span>${externalIcon}</span>
                </div>
                <p class="download-card__eyebrow">${download.eyebrow}</p>
                <h3>${download.title}</h3>
                <p>${download.description}</p>
                <small>${download.detail}</small>
                <strong>${download.cta} <span aria-hidden="true">↗</span></strong>
              </a>
            `,
          ).join("")}
        </div>

        <div class="toolkit-note" data-reveal>
          <span>MIT licensed</span>
          <p>Use it. Adapt it. Improve it. Plan like the person who will be on-call for it.</p>
          <a href="https://github.com/Sim2K/Planning-Prompt" target="_blank" rel="noreferrer">
            Explore the repository ${externalIcon}
          </a>
        </div>
      </div>
    </section>

    <section class="founder section" aria-labelledby="founder-title">
      <div class="founder-grid" aria-hidden="true"></div>
      <div class="container founder__inner">
        <p class="eyebrow" data-reveal>From Veedence, with intent</p>
        <blockquote id="founder-title" data-reveal>
          Better vibe coding starts with
          <em>better questions.</em>
        </blockquote>
        <p class="founder__message" data-reveal>
          Simeon Williams from Veedence was happy to create and offer this. If you want to take
          your vibe coding to the next level, get in touch at
          <a href="mailto:hello@Veedence.co.uk">hello@Veedence.co.uk</a>.
        </p>
        <div class="founder__actions" data-reveal>
          <a class="button button--light" href="mailto:hello@Veedence.co.uk">
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
          <a class="button button--ghost-light" href="https://veedence.co.uk" target="_blank" rel="noreferrer">
            Visit Veedence.co.uk ${externalIcon}
          </a>
        </div>
        <aside class="founder-support" data-reveal aria-label="Optional support for the project">
          <div class="founder-support__icon" aria-hidden="true">☕🍫</div>
          <div class="founder-support__copy">
            <span>Optional support</span>
            <h3>Buy Simeon a hot chocolate.</h3>
            <p>
              Simeon doesn't drink coffee — even though he probably needs it after staying up
              late vibe coding things like this to help others.
            </p>
            <small>Never required, always appreciated. Please leave a message; it will be read. 🌙💚</small>
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
      <a class="brand brand--footer" href="#top">
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
initMotion();
