import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/sections.css";
import "./styles/responsive.css";

import { initCopyButtons } from "./copy";
import { initPageMotion } from "./motion";
import { initNavigation } from "./navigation";
import { initTheme } from "./theme";

const externalIcon = `
  <svg aria-hidden="true" viewBox="0 0 20 20">
    <path d="M7 13 13.5 6.5M9 6h5v5M14 12v3H5V6h3" />
  </svg>`;

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("App root not found.");

const copyBlock = (label: string, text: string, ariaLabel: string): string => `
  <div class="copy-block" data-copy data-reveal>
    <div class="copy-block__head">
      <span>${label}</span>
      <button class="copy-block__button" type="button" data-copy-button aria-label="Copy ${ariaLabel} to clipboard">Copy</button>
    </div>
    <pre data-copy-source>${text}</pre>
  </div>`;

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
        <a href="./how-to-use.html" class="is-active" aria-current="page" data-nav-link>How to use</a>
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
      <a href="./how-to-use.html" data-nav-link><span>04</span> How to use</a>
      <a href="./index.html#toolkit" data-nav-link><span>05</span> Get the toolkit</a>
      <a href="mailto:hello@Veedence.co.uk"><span>06</span> Talk to Veedence</a>
    </nav>
  </header>

  <main id="main">
    <p class="visually-hidden" role="status" aria-live="polite" data-copy-status></p>

    <section class="runtime-page-hero" id="top" aria-labelledby="howto-title">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container runtime-page-hero__layout">
        <div>
          <p class="eyebrow" data-hero-reveal>
            <span class="status-dot"></span>
            The guide · Claude Code · Codex · Any LLM
          </p>
          <h1 id="howto-title" data-hero-reveal>
            Use it in
            <em class="em-spaced">one line.</em>
          </h1>
          <p class="runtime-page-hero__lead" data-hero-reveal>
            The planner works the same everywhere: describe the feature, get an evidence-grounded,
            reviewable plan. The only thing that changes per platform is how you call it - and every
            call is on this page, ready to copy.
          </p>
          <div class="runtime-page-hero__actions" data-hero-reveal>
            <a class="button button--primary" href="#claude">
              Start with Claude Code <span aria-hidden="true">↓</span>
            </a>
            <a class="button button--text" href="./index.html#toolkit">
              Get the toolkit first <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <article class="runtime-audit-card" data-hero-card aria-label="Invocation cheat sheet">
          <div class="runtime-audit-card__top">
            <span>Cheat sheet</span>
            <span class="signal signal--safe">Copy-ready</span>
          </div>
          <h2>Every way to call it.</h2>
          <p>
            Install once, then any of these starts a full planning run. It's read-only by design —
            it plans, it never touches code without your explicit go.
          </p>
          <dl>
            <div><dt>Claude Code</dt><dd><code>/robust-feature-planner</code></dd></div>
            <div><dt>OpenAI Codex</dt><dd><code>$robust-feature-planner</code></dd></div>
            <div><dt>Any LLM</dt><dd>Paste the raw prompt</dd></div>
            <div><dt>Deeper check</dt><dd><code>+runtime-audit</code></dd></div>
          </dl>
        </article>
      </div>
    </section>

    <section class="runtime-plain section" id="claude" aria-labelledby="howto-claude-title">
      <div class="container">
        <header class="section-heading section-heading--split" data-reveal>
          <div>
            <p class="eyebrow">01 · Claude Code</p>
            <h2 id="howto-claude-title">It triggers itself. Or call it by name.</h2>
          </div>
          <p>
            Once the skill folder sits in <code>~/.claude/skills/</code>, Claude Code activates it
            automatically whenever you describe a planning task. Prefer to be explicit? Use the
            slash command.
          </p>
        </header>
        <div class="copy-grid">
          ${copyBlock(
            "Not installed yet? Tell your AI",
            "Go to https://plannerskill.veedence.com/ and get the skill",
            "the one-sentence install request",
          )}
          ${copyBlock("Slash command", "/robust-feature-planner", "the Claude Code slash command")}
          ${copyBlock(
            "Or just describe your goal",
            "Plan a feature that lets users export their account data as a CSV.",
            "an example planning request",
          )}
          ${copyBlock(
            "Review an existing plan",
            "Review this implementation plan against the real project and tell me what's missing.",
            "an example plan-review request",
          )}
        </div>
      </div>
    </section>

    <section class="runtime-use section" id="codex" aria-labelledby="howto-codex-title">
      <div class="container runtime-use__layout">
        <header class="section-heading" data-reveal>
          <p class="eyebrow">02 · OpenAI Codex</p>
          <h2 id="howto-codex-title">Same skill, called with a dollar.</h2>
          <p>
            Codex uses a <code>$</code> reference instead of a slash. Drop the skill folder into
            your Codex skills directory, then reference it in the request.
          </p>
        </header>
        <div class="copy-grid copy-grid--single">
          ${copyBlock(
            "Codex invocation",
            "Use $robust-feature-planner to create a production-ready implementation plan for: &lt;your feature&gt;",
            "the Codex invocation",
          )}
          ${copyBlock(
            "Hand it to any agent",
            "Read https://github.com/Sim2K/Planning-Prompt and use the Robust Feature Planner version for your platform to create a production-ready implementation plan for:\n\n&lt;FEATURE_REQUEST&gt;\n\nTarget project:\n&lt;PROJECT_PATH_OR_REPOSITORY&gt;\n\nPlanning only. Discover the real project, compare architecture branches, review the plan for regressions, and do not implement changes unless I explicitly authorize it.",
            "the agent hand-off prompt",
          )}
        </div>
      </div>
    </section>

    <section class="runtime-plain section" id="raw-prompt" aria-labelledby="howto-raw-title">
      <div class="container">
        <header class="section-heading section-heading--split" data-reveal>
          <div>
            <p class="eyebrow">03 · Any LLM</p>
            <h2 id="howto-raw-title">No install. Just paste.</h2>
          </div>
          <p>
            The raw prompt is fully self-contained - ChatGPT, Gemini, Cursor, Copilot, anything.
            Copy it from the repo, fill the placeholders below, send. Pro tip: leave
            <code>PROJECT_CONTEXT</code> blank on purpose and let the AI discover the project itself.
          </p>
        </header>
        <div class="copy-grid copy-grid--single">
          ${copyBlock(
            "The placeholders to fill",
            "&lt;FEATURE_REQUEST&gt;\nDescribe the feature here.\n&lt;/FEATURE_REQUEST&gt;\n\n&lt;PROJECT_CONTEXT&gt;\nStack, goals, constraints, roles, services, deadlines, or files to inspect.\n(Leave blank to let the AI discover the project itself.)\n&lt;/PROJECT_CONTEXT&gt;\n\n&lt;RUNTIME_AUDIT&gt;\nOFF\n&lt;/RUNTIME_AUDIT&gt;",
            "the raw-prompt placeholders",
          )}
        </div>
        <div class="howto-raw-actions" data-reveal>
          <a
            class="button button--primary"
            href="https://github.com/Sim2K/Planning-Prompt/blob/main/Veedence.co.uk-Robust-Feature-Planning-Prompt.md"
            target="_blank"
            rel="noreferrer"
          >
            Open the raw prompt on GitHub ${externalIcon}
          </a>
        </div>
      </div>
    </section>

    <section class="runtime-command section" id="audit" aria-labelledby="howto-audit-title">
      <div class="container runtime-command__layout">
        <div class="section-heading" data-reveal>
          <p class="eyebrow">04 · Optional deeper check</p>
          <h2 id="howto-audit-title">Go deeper when the feature is scary.</h2>
          <p>
            Money, queues, shared state, retries - for those, add one token to any planning request
            and the plan must expose its own timing, ownership, and transaction assumptions, ranked
            for a human reviewer. Off by default; the planner may offer it when it spots risk, but
            never runs it uninvited.
          </p>
          <a class="button button--text" href="./runtime-semantics.html">
            How the Runtime Semantics Audit works <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div class="copy-grid copy-grid--single">
          ${copyBlock("Activation token", "+runtime-audit", "the runtime audit activation token")}
          ${copyBlock(
            "Or ask in plain words",
            "Where might this plan be wrong at runtime? Run the runtime audit.",
            "the plain-language runtime audit request",
          )}
        </div>
      </div>
    </section>

    <section class="runtime-use section" aria-labelledby="howto-after-title">
      <div class="container runtime-use__layout">
        <header class="section-heading" data-reveal>
          <p class="eyebrow">What happens next</p>
          <h2 id="howto-after-title">You get a plan, not a surprise.</h2>
          <p class="runtime-caveat">
            Every run ends the same way: a complete, validated plan and the line “The plan is
            complete and awaiting your approval. No implementation has started.” Nothing is built
            until you say so.
          </p>
        </header>
        <ul class="runtime-checklist">
          <li data-reveal><span>01</span><strong>Discovery with receipts</strong><small>Every finding labeled Observed, Inferred, or Unknown - with the file paths it came from.</small></li>
          <li data-reveal><span>02</span><strong>Three real architectures</strong><small>Conservative, modular, fastest-acceptable - winner justified, rejections named.</small></li>
          <li data-reveal><span>03</span><strong>A 20-section checklist plan</strong><small>Failure modes, rollback order, security, UX states - with traceable A/R/P IDs throughout.</small></li>
          <li data-reveal><span>04</span><strong>Optional structural validation</strong><small>python scripts/validate_plan.py your-plan.md --strict - fails skeleton sections and untraced risks.</small></li>
          <li data-reveal><span>05</span><strong>Your explicit go decides</strong><small>Approve the plan and hand it back for implementation - or to any developer, human or AI.</small></li>
        </ul>
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
initCopyButtons();
