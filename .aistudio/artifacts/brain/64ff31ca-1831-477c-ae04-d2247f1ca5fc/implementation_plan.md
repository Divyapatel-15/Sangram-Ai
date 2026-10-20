# AI Archetypes & Personality Selection System

SANGRAM AI will introduce an interactive archetype selection layer allowing users to pair each chosen AI model with a distinct debate persona (such as *Analytical Logician* or *Creative Visionary*), enriching how fighters clash in the debate arena.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following choices were confirmed based on your preferences:
> - **Presentation**: Interactive cards featuring archetype badges, traits, debate styles, and custom SVG icons.
> - **Model Relationship**: Personas enhance base models (users pair each fighter model with an archetype, with intelligent default recommendations).
> - **Roster**: 6 core debate archetypes — **Analytical Logician**, **Creative Visionary**, **Pragmatic Realist**, **Inquisitive Skeptic**, **Integrative Synthesizer**, and **Bold Provocateur**.

- **Fighter Persona Defaults**: Each model defaults to an intuitive natural archetype (e.g., Claude → Logician, Gemini → Synthesizer, Grok → Provocateur, ChatGPT → Pragmatist, Llama → Skeptic, Mistral → Visionary), but users can change or reassign any archetype to any slot with one click.
- **Arena Integration**: The active archetype badge, trait, and perspective styling will propagate into the Fighter Slot preview, the live Debate Arena timeline headers, the round summaries, and debate history records.

---

## 1. Overview & Core Concept

- **What It Does**: Enhances the matchup configuration workflow by letting users select not just *which* AI models enter the arena, but *what debate stance and cognitive philosophy* each model adopts.
- **Target Audience**: Researchers, developers, decision-makers, and curious minds who want to observe adversarial debates between distinct philosophical viewpoints (e.g., rigorous formal analysis vs. disruptive lateral thinking).
- **Key Value**: Deepens the substance and contrast of debates by giving users direct agency over the argumentative angle of each participant.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Model & Persona Selection in Config**:
   - The user selects Fighter 01 and Fighter 02 from the existing model catalog.
   - Below the fighter slots (or tabbed within the configuration flow), a dedicated **Debate Archetype Catalog** presents 6 interactive cards.
   - A slot toggle selector (`Fighter 01: [Model]` | `Fighter 02: [Model]`) indicates which fighter is actively receiving the persona.
   - Clicking an archetype card assigns that persona, updates the fighter's card with its signature archetype badge, icon, and primary traits, and provides instant visual confirmation.
2. **Fighter Slot Preview**:
   - Each fighter slot displays:
     - Model Name & Provider (e.g., *Claude · Anthropic*)
     - Assigned Archetype Tag with custom icon (e.g., *Analytical Logician · Axiomatic Rigor*)
     - Quick "Change Persona" trigger to rapidly swap stances.
3. **Arena Experience**:
   - During the debate rounds, message headers feature the composite identity: `[Model Icon] Claude (Analytical Logician) · Round 1`.
   - The archetype's signature tagline and tactical stance appear as contextual kickers above their arguments.
4. **Results & History**:
   - The synthesized final resolution explicitly credits how the clashing archetypes (e.g., Logician's axioms vs. Visionary's foresight) shaped the consensus.
   - History entries store the archetype IDs and accurately restore them when replayed.

### Visual Identity & Theme

- **Aesthetic Direction**: Cyber-deliberative editorial dark theme adhering to SANGRAM's existing palette (`#050D1A` deep space navy, `#0E1B2E` slate cards, subtle hairline borders).
- **Color Discipline**: Archetype cards utilize the model's accent tokens (`--mc`, `--mc-soft`, `--mc-line`) while each archetype features a refined trait badge (e.g., deep sapphire for Logician, amber aurora for Visionary, emerald for Pragmatist, ruby for Provocateur).
- **Typography & Hierarchy**: Space Grotesk for display headers, Inter for readable debate descriptions, JetBrains Mono for traits and archetype badges.
- **Zero-Pill Restraint**: Static metadata is rendered as unboxed typography (`Analytical Logician · Axiomatic Rigor`), reserving bordered pill shapes strictly for interactive persona selection buttons.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Two-Tier Fighter Identity (Model + Archetype)**
  - *Chosen Approach*: Retain the authentic model identities (ChatGPT, Claude, Gemini, etc.) and add an archetype selector that modulates each fighter's cognitive stance.
  - *Why*: Preserves SANGRAM's core identity as a multi-model debate platform while fulfilling the user's requirement for personality archetypes.
  - *Alternatives Considered*: Complete replacement of models with fictional personas (rejected as it discards the model provider comparison value).

- **Decision 2: Interactive Grid with Active Fighter Slot Toggle**
  - *Chosen Approach*: A 6-card interactive grid with an intuitive active slot switcher (`Assigning to Fighter 01` / `Fighter 02`), plus direct inline dropdown/modal fallback within each slot.
  - *Why*: Highly visual, scannable, and engaging on desktop while maintaining compact accessibility on mobile.

- **Decision 3: Archetype-Aware Battle Simulation & Transcript Engine**
  - *Chosen Approach*: Extend `src/services/battleService.js` to incorporate archetype traits into fighter personas, battle transcripts, and synthesis summaries.
  - *Why*: Ensures the selected archetypes actually manifest in the debate output rather than being cosmetic-only labels.

---

## 4. Technical Architecture & Data Strategy

### System Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    App State (App.jsx)                      │
│   selected = [ { ...model, archetype }, { ...model, archetype } ]
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │     Config.jsx       │        │      Arena.jsx       │
    │  - FighterSlot (x2)  │        │  - Timeline.jsx      │
    │  - ModelCatalog      │        │  - SpeechCards       │
    │  - ArchetypeCatalog  │        │  - Results.jsx       │
    └──────────┬───────────┘        └──────────────────────┘
               │
               ▼
    ┌─────────────────────────────────────────────────────────┐
    │  src/data/archetypes.js                                 │
    │  - 6 archetypes: logician, visionary, pragmatist,       │
    │    skeptic, synthesizer, provocateur                    │
    │  - Icons, traits, mottos, debate styles                 │
    │  - defaultArchetypeForModel(modelId)                    │
    └─────────────────────────────────────────────────────────┘
```

### 6 Core Archetypes Specification (`src/data/archetypes.js`)

1. **Analytical Logician**
   - *Motto*: "Truth through systematic deduction and formal validity."
   - *Traits*: First principles, deductive proofs, formal rigor, invariant checking.
   - *Debate Style*: Demands precise definitions, exposes hidden fallacies, constructs step-by-step proofs.
2. **Creative Visionary**
   - *Motto*: "Break the problem space with lateral perspective."
   - *Traits*: Paradigm shifts, future extrapolation, associative leaps, expansive scope.
   - *Debate Style*: Challenges orthodox constraints, reframes the baseline question, envisions emergent futures.
3. **Pragmatic Realist**
   - *Motto*: "Execution viability dictates actual value."
   - *Traits*: Real-world constraints, friction audits, operational feasibility, trade-off clarity.
   - *Debate Style*: Drags abstract theories down to operational reality, tests for implementation failure modes.
4. **Inquisitive Skeptic**
   - *Motto*: "Stress-test every assumption until only the robust survives."
   - *Traits*: Epistemic caution, falsifiability testing, edge-case probing, bias detection.
   - *Debate Style*: Probes counter-examples, interrogates overconfident leaps, checks boundary conditions.
5. **Integrative Synthesizer**
   - *Motto*: "Superior answers integrate opposing truths."
   - *Traits*: Dialectical harmony, holistic systems thinking, bridge building, balanced nuance.
   - *Debate Style*: Identifies common ground behind apparent contradictions, builds multi-dimensional frameworks.
6. **Bold Provocateur**
   - *Motto*: "Consensus is comfort; friction generates breakthrough."
   - *Traits*: Contrarian angles, productive dissent, status quo disruption, sharp provocation.
   - *Debate Style*: Questions foundational dogmas, introduces high-friction counter-hypotheses, tests intellectual complacency.

### State & Integration Plan

- **`src/data/archetypes.js`**: Defines the catalog of 6 archetypes with SVG icons, traits, badges, and helper functions.
- **`src/components/ArchetypeCatalog.jsx`**: Interactive card grid allowing seamless assignment to either Fighter 01 or Fighter 02, displaying traits, badges, and active state.
- **`src/components/Config.jsx`**: Embeds `ArchetypeCatalog`, displays the selected archetype within `FighterSlot`, and supports changing/customizing archetype for each fighter.
- **`src/services/battleService.js`**: Integrates archetype profiles into fighter metadata and argument framing so transcripts reflect the model-archetype pair.
- **`src/components/Arena.jsx` & `Timeline.jsx`**: Displays archetype indicators alongside model badges in debate speech cards.
- **`src/services/historyStore.js` & `shareLink.js`**: Updates persistence and sharing to serialize and restore archetype selections.
