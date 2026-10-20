import React, { useEffect, useState } from 'react'
import { models, accentVars } from '../data/models'
import {
  BrandLogo,
  ModelIcon,
  IconCompare,
  IconChallenge,
  IconSynthesize,
  IconStepSelect,
  IconStepQuestion,
  IconStepBattle,
  IconStepAnswer,
  IconArrowRight,
  IconInfo,
  IconContention,
  IconHistory
} from './Icons'

/* ------------------------------------------------------------------
   Scroll-reveal hook — IntersectionObserver, no deps
   ------------------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-revealed'); obs.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/* ------------------------------------------------------------------
   Hero + custom arena visualization
   ------------------------------------------------------------------ */

function ArenaVisual() {
  const a = models[0] // ChatGPT
  const b = models[2] // Claude

  return (
    <div className="arena-visual" role="img" aria-label="Arena visualization: two AI models debate across a shared timeline and converge on one synthesized answer">
      <div className="arena-glow" aria-hidden="true" />
      <div className="arena-grid" aria-hidden="true" />

      <div className="arena-visual-head">
        <span className="arena-visual-title">ARENA · LIVE VIEW (SIMULATED)</span>
        <span className="arena-visual-stages" aria-hidden="true">ARGUE → CHALLENGE → SYNTHESIZE</span>
      </div>

      <div className="arena-combatants">
        <div className="arena-fighter arena-fighter--a" style={accentVars(a)}>
          <div className="arena-fighter-top">
            <span className="fighter-slot-tag">FIGHTER 01</span>
            <span className="fighter-live-dot" aria-hidden="true" />
          </div>
          <div className="arena-fighter-main">
            <ModelIcon id={a.id} size={38} />
            <div>
              <div className="arena-fighter-name">{a.name}</div>
              <div className="arena-fighter-meta">{a.provider}</div>
            </div>
          </div>
          <p className="arena-fighter-stance"><span>OPENING THESIS</span>{a.desc}</p>
        </div>

        <div className="arena-vs" aria-hidden="true">
          <span className="arena-vs-line" />
          <span className="arena-vs-node">VS</span>
          <span className="arena-vs-line" />
        </div>

        <div className="arena-fighter arena-fighter--b" style={accentVars(b)}>
          <div className="arena-fighter-top">
            <span className="fighter-slot-tag">FIGHTER 02</span>
            <span className="fighter-live-dot" aria-hidden="true" />
          </div>
          <div className="arena-fighter-main">
            <ModelIcon id={b.id} size={38} />
            <div>
              <div className="arena-fighter-name">{b.name}</div>
              <div className="arena-fighter-meta">{b.provider}</div>
            </div>
          </div>
          <p className="arena-fighter-stance"><span>COUNTER-THESIS</span>Challenges abstraction with immediate feedback loops and verifiable outcomes.</p>
        </div>
      </div>

      <svg className="arena-schematic" viewBox="0 0 420 58" preserveAspectRatio="none" aria-hidden="true">
        <path d="M105 0v20q0 8 8 8h89q8 0 8 8v14" fill="none" stroke={a.accent.color} strokeOpacity="0.55" strokeWidth="1.5" />
        <path d="M315 0v20q0 8-8 8h-89q-8 0-8 8v14" fill="none" stroke={b.accent.color} strokeOpacity="0.55" strokeWidth="1.5" />
        <circle cx="105" cy="3" r="3" fill={a.accent.color} />
        <circle cx="315" cy="3" r="3" fill={b.accent.color} />
        <circle cx="210" cy="28" r="4.5" fill="#0E213A" stroke="var(--accent-primary)" strokeWidth="1.5" />
      </svg>

      <div className="arena-synthesis">
        <div className="arena-synthesis-row">
          <span className="arena-synthesis-tag">STAGE 05 · SYNTHESIS</span>
          <span className="arena-synthesis-rounds">R1 OPEN · R2 COUNTER · R3 REBUT · R4 FINAL</span>
        </div>
        <p>One consolidated answer distilled from the strongest surviving arguments of both models.</p>
      </div>

      <div className="arena-visual-foot" aria-hidden="true">
        <span>ARGUE</span><i>→</i><span>CHALLENGE</span><i>→</i><span>SYNTHESIZE</span>
      </div>
    </div>
  )
}

function Hero({ onEnter, onHowItWorks }) {
  return (
    <section className="hero" id="top">
      {/* Motion Series Video Background & Veil */}
      <video
        className="hero-art-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4"
      />
      <div className="hero-veil" aria-hidden="true" />

      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            DIFFERENT MINDS. ONE ARENA.
          </p>
          <h1>What Happens When AI&nbsp;Challenges AI?</h1>
          <p className="hero-sub">
            Bring different AI models into one arena. Compare their reasoning,
            challenge their answers, and discover one consolidated response.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn-primary btn-lg btn-glass-cta" onClick={onEnter}>
              <span>Enter the Arena</span>
              <IconArrowRight size={16} />
            </button>
            <button type="button" className="btn-secondary btn-lg" onClick={onHowItWorks}>
              <span>Explore How It Works</span>
            </button>
          </div>
          <div className="hero-meta-row">
            <p className="hero-proto-label">
              <span className="demo-dot" aria-hidden="true" />
              Demo Mode · Simulated responses — frontend prototype, no live model APIs
            </p>
            <a
              href="/neural-landing.html"
              target="_blank"
              rel="noopener noreferrer"
              className="neural-link-pill"
              title="Open the standalone Motion Series / NEURAL template"
            >
              <span>NEURAL Template</span>
              <svg width="11" height="10" viewBox="0 0 10 9" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M0 4.5 H9.1 M5.4 0.9 L9.2 4.5 L5.4 8.1"/>
              </svg>
            </a>
          </div>
        </div>
        <ArenaVisual />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   About section
   ------------------------------------------------------------------ */

function About() {
  return (
    <section className="section-about" id="about" aria-labelledby="about-h">
      <div className="container">
        <div className="about-grid">
          <div data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />WHAT IS SANGRAM AI</p>
            <h2 id="about-h">A New Way to Work With AI</h2>
            <p className="about-lead">
              Sangram AI explores what happens when you bring multiple AI perspectives into one arena.
              Instead of asking one model and accepting its answer, you pit different minds against each
              other and watch the reasoning unfold.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              The word "Sangram" (संग्राम) means battle or contest in Sanskrit — a deliberate collision
              of ideas that produces something stronger than either input alone.
            </p>
          </div>
          <div className="about-vision" data-reveal>
            <div className="about-vision-card">
              <span className="about-vision-label">THE VISION</span>
              <blockquote>
                "Better answers come from adversarial clarity, not chatbot noise."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Example debate preview
   ------------------------------------------------------------------ */

const EXAMPLE_TURNS = [
  {
    who: 'a', kind: 'Opening Argument',
    text: 'TypeScript first: a typed contract between modules is the cheapest correctness you can buy, and the discipline compounds across every framework that comes after it.',
    contention: null
  },
  {
    who: 'b', kind: 'Counterargument',
    text: 'The contract argument assumes the contract is right. Types describe structure, not behavior — teams ship type-safe products that are confidently wrong, while a model-backed prototype proves the feature was worth typing at all.',
    contention: 'Whether correctness leverage starts at the code boundary (types) or at the outcome boundary (validated behavior).'
  },
  {
    who: 'a', kind: 'Rebuttal — position refined',
    text: 'Conceded on confidence: types catch drift, not delusion. But evaluation suites are code too — typed tests, typed schemas, typed prompts. The disagreement becomes sequencing, and I hold: the type system is where the eval harness stops lying to you.',
    contention: null
  }
]

function ExampleDebate({ onEnter }) {
  const a = models[0]
  const b = models[2]
  return (
    <section className="section-example" aria-labelledby="example-h">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">DEBATE IN MOTION</p>
          <h2 id="example-h">What a round actually looks like</h2>
          <p>
            A condensed excerpt demonstrating the shared-timeline format: one claim, one genuine challenge, one refined position.
          </p>
        </div>

        <div className="example-card" data-reveal>
          <div className="example-flag">
            <IconInfo size={13} />
            <span>Demonstration data — curated example, not generated by live APIs</span>
          </div>

          <div className="example-question">
            <span className="example-q-label">QUESTION</span>
            <p>Which should a junior developer prioritize first — TypeScript fundamentals or shipping AI-backed prototypes?</p>
          </div>

          <div className="example-timeline" role="list">
            {EXAMPLE_TURNS.map((t, i) => {
              const model = t.who === 'a' ? a : b
              return (
                <div key={i} role="listitem" className={`example-msg ${t.who === 'a' ? 'side-a' : 'side-b'}`} style={accentVars(model)}>
                  <span className="example-avatar"><ModelIcon id={model.id} size={26} /></span>
                  <div className="example-body">
                    <div className="example-meta">
                      <strong className="example-name">{model.name}</strong>
                      <span className="example-kind">{t.kind}</span>
                    </div>
                    {t.contention && (
                      <p className="example-contention"><IconContention size={12} /><span>{t.contention}</span></p>
                    )}
                    <p className="example-text">{t.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="example-foot">
            <p className="example-verdict"><span>SYNTHESIZED</span> Fundamentals and prototyping merge into one loop: typed, small, shipped weekly — types stop the eval harness from lying, prototypes stop the roadmap from drifting.</p>
            <button type="button" className="btn-primary" onClick={onEnter}>
              <span>Run this matchup in the Arena</span>
              <IconArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------
   Landing composition
   ------------------------------------------------------------------ */

const BENEFITS = [
  {
    icon: <IconCompare size={19} />,
    title: 'Two minds, one question',
    desc: 'Pick any two model profiles and put a single question through both — no prompt juggling, no side-by-side reading.'
  },
  {
    icon: <IconChallenge size={19} />,
    title: 'Arguments that answer each other',
    desc: 'Counterarguments and rebuttals respond to named claims in a shared timeline, so disagreements stay concrete.'
  },
  {
    icon: <IconSynthesize size={19} />,
    title: 'One consolidated answer',
    desc: 'The synthesis stage merges the strongest surviving reasoning into a single conclusion you can copy, share or export.'
  }
]

const HOW_STEPS = [
  { icon: <IconStepSelect size={17} />, num: '01', title: 'Select models', desc: 'Assign two distinct model profiles to the fighter slots.' },
  { icon: <IconStepQuestion size={17} />, num: '02', title: 'Ask one question', desc: 'Anything worth reasoning over — technical, strategic, or open-ended.' },
  { icon: <IconStepBattle size={17} />, num: '03', title: 'Watch the debate', desc: 'Four rounds stream into one timeline: opening, counter, rebuttal, final.' },
  { icon: <IconStepAnswer size={17} />, num: '04', title: 'Receive the answer', desc: 'One synthesized conclusion with each model\'s supporting insight.' }
]

const USE_CASES = [
  { title: 'Comparing technical approaches', desc: 'Put two candidate architectures in the ring and see which claims survive challenge.' },
  { title: 'Exploring competing explanations', desc: 'Watch rival interpretations pressure-test each other instead of accepting the first fluent answer.' },
  { title: 'Evaluating programming choices', desc: 'Language, framework, database — get the trade-offs argued from both sides, then merged.' },
  { title: 'Decision trade-offs', desc: 'Before committing, see assumptions named, contested and reconciled in one record.' }
]

export default function Landing({ onEnter, onOpenHistory }) {
  useReveal()

  const scrollTo = (sel) => document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <main id="main">
      <Hero onEnter={onEnter} onHowItWorks={() => scrollTo('#how')} />

      {/* About */}
      <About />

      {/* Benefits */}
      <section className="section-benefits" id="benefits" aria-labelledby="benefits-h">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />WHY SANGRAM</p>
            <h2 id="benefits-h">Adversarial clarity, not chatbot noise</h2>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map((b, i) => (
              <article key={b.title} className="benefit-card" data-reveal>
                <span className="benefit-icon" aria-hidden="true">{b.icon}</span>
                <h3><span className="benefit-num" aria-hidden="true">0{i + 1}</span>{b.title}</h3>
                <p>{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-how" id="how" aria-labelledby="how-h">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />DEBATE PROTOCOL</p>
            <h2 id="how-h">How It Works</h2>
            <p>A linear four-stage journey from model selection to one synthesized conclusion.</p>
          </div>
          <ol className="how-grid">
            {HOW_STEPS.map((s) => (
              <li key={s.num} className="how-step" data-reveal>
                <span className="how-icon" aria-hidden="true">{s.icon}</span>
                <span className="how-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Model showcase */}
      <section className="section-showcase" id="models" aria-labelledby="models-h">
        <div className="container">
          <div className="section-head section-head-split" data-reveal>
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />MODEL ROSTER</p>
              <h2 id="models-h">Six profiles, any pairing</h2>
              <p>Simulated fighter profiles with distinct reasoning personas. Identifiers are for display only — no live APIs are connected.</p>
            </div>
            <button type="button" className="btn-secondary" onClick={onEnter}>
              <span>Configure Matchup</span>
              <IconArrowRight size={14} />
            </button>
          </div>
          <div className="showcase-grid">
            {models.map((m) => (
              <div key={m.id} className="showcase-item" style={accentVars(m)} data-reveal>
                <ModelIcon id={m.id} size={34} />
                <div className="showcase-item-body">
                  <strong>{m.name}</strong>
                  <span className="showcase-item-meta">{m.provider} · reference id: {m.modelLabel}</span>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="showcase-foot-note">
            <IconInfo size={12} />
            <span>Display names and reference identifiers are not claimed to be current flagship models and are not wired to any provider API.</span>
          </p>
        </div>
      </section>

      {/* Example debate preview */}
      <ExampleDebate onEnter={onEnter} />

      {/* Use cases */}
      <section className="section-usecases" aria-labelledby="use-h">
        <div className="container">
          <div className="section-head" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />BUILT FOR DECISIONS</p>
            <h2 id="use-h">Where a debate beats a single answer</h2>
          </div>
          <div className="usecase-grid">
            {USE_CASES.map((u) => (
              <article key={u.title} className="usecase-card" data-reveal>
                <h3>{u.title}</h3>
                <p>{u.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-cta" aria-labelledby="cta-h">
        <div className="container">
          <div className="cta-surface" data-reveal>
            <div>
              <h2 id="cta-h">Ready to put two AI perspectives to the test?</h2>
              <p>Select two models, enter one question, and review the full four-round debate alongside a single synthesized answer.</p>
            </div>
            <div className="cta-actions">
              <button type="button" className="btn-primary btn-lg" onClick={onEnter}>
                <span>Enter the Arena</span>
                <IconArrowRight size={16} />
              </button>
              <button type="button" className="btn-ghost" onClick={onOpenHistory}>
                <IconHistory size={15} />
                <span>Recent battles</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onEnter={onEnter} onOpenHistory={onOpenHistory} />
    </main>
  )
}


const CONTACT_EMAIL = 'nikhil@sangramai.tech'

function Footer({ onEnter, onOpenHistory }) {
  const scrollTo = (sel) =>
    document.querySelector(sel)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

  return (
    <footer className="footer no-print">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <BrandLogo showTagline size="sm" />
          <p className="footer-about">
            SANGRAM AI is a multi-model debate and synthesis arena:
            two distinct AI minds challenge each other's reasoning
            in one shared timeline and converge on a stronger
            consolidated answer.
          </p>
          <p className="footer-note">
            Frontend prototype. Battles use local demo data.
          </p>
        </div>

        <nav className="footer-col" aria-label="Footer navigation">
          <h3>Platform</h3>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('#about') }}>About Sangram</a>
          <a href="#benefits" onClick={(e) => { e.preventDefault(); scrollTo('#benefits') }}>Why Sangram</a>
          <a href="#how" onClick={(e) => { e.preventDefault(); scrollTo('#how') }}>How It Works</a>
          <a href="#models" onClick={(e) => { e.preventDefault(); scrollTo('#models') }}>Model Roster</a>
          <button type="button" className="footer-link-btn" onClick={onEnter}>
            Enter the Arena
          </button>
          <button type="button" className="footer-link-btn" onClick={onOpenHistory}>
            Recent battles
          </button>
        </nav>

        <div className="footer-col">
          <h3>Contact</h3>
          <a
            className="footer-contact-link"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=nikhil%40sangramai.tech"
          >
            {CONTACT_EMAIL}
          </a>

          <a
            className="footer-contact-link"
            href="https://wa.me/917822902947"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp: +91 78229 02947
          </a>

          <a
            className="footer-github-link"
            href="https://github.com/Nickroy07/Sangram-Ai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sangram AI source code on GitHub"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            GitHub
          </a>

          <p className="footer-note">
            For demo feedback and partnership enquiries.
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} SANGRAM AI — Different Minds. One Arena.
        </span>
        <span>Multi-model debate &amp; synthesis · frontend prototype</span>
      </div>
    </footer>
  )
}
