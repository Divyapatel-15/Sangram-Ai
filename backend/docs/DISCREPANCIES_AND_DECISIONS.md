# SANGRAM AI — Contract Discrepancies & Team Decisions

This document records the architectural discrepancies identified during Developer 1's frontend inspection, along with the proposed resolutions and decisions requiring team agreement.

---

## 1. Identified Discrepancies & Resolutions

### Discrepancy A: `prompt` vs `question`
- **Frontend Observation**: In `src/components/Config.jsx` and `src/services/mock/mockBattleService.js`, the input parameter for a debate dilemma is referenced as `prompt`. However, in `docs/BACKEND_CONTRACT.md`, `src/services/battleService.js`, and `src/services/historyStore.js`, the field is consistently named `question`.
- **Architectural Resolution**:
  - The canonical API contract field is `question` (string, 10–1000 characters).
  - To maintain smooth frontend compatibility, Developer 4 should accept either `question` or `prompt` via Pydantic field aliases or request pre-validation:
    ```python
    class BattleCreateRequest(BaseSchema):
        question: str = Field(..., validation_alias=AliasChoices("question", "prompt"))
    ```

---

### Discrepancy B: Catalog Model IDs vs Provider Model Identifiers
- **Frontend Observation**: The UI models catalog (`src/data/models.js`) exposes friendly brand IDs: `chatgpt`, `gemini`, `claude`, `llama`, `mistral`, `grok`. Display labels are futuristic projections (`GPT-5`, `Claude Sonnet 4.5`, `Gemini 2.5 Pro`). In `models.js`, `apiModel` is explicitly documented as `null (frontend prototype)`.
- **Architectural Resolution**:
  - The REST API boundary strictly consumes and returns the friendly IDs (`chatgpt`, `claude`).
  - **Developer 3 (AI Gateway)** is responsible for maintaining the server-side mapping dictionary between friendly IDs and exact provider model strings (e.g., mapping `claude` to `claude-3-5-sonnet-20241022`, or `chatgpt` to `gpt-4o`). The browser never sees or handles raw provider model strings.

---

### Discrepancy C: History Summaries vs Full Battle Transcripts
- **Frontend Observation**: `mockBattleService.getRecentBattles()` returns condensed summary cards (`title`, `topic`, `date`, `models`, `roundsCount`, `summary`, `consensusScore`), whereas `battleService.js` consumes a full multi-stage transcript containing all turns and insights.
- **Architectural Resolution**:
  - `GET /api/battles` returns paginated `BattleSummaryCard` objects to prevent transferring large message transcripts on list views.
  - `GET /api/battles/{id}` and `GET /api/s/{token}` return the full normalized `Battle` object for active arena views.

---

### Discrepancy D: Simulated Agreement Scores vs Real Convergence
- **Frontend Observation**: In the prototype, `agreement.score` is hard-coded (e.g. 78, 88, 92) with `demo: true` and labeled "Demo agreement estimate".
- **Architectural Resolution**:
  - In the live backend schema, `agreement` is `Optional[BattleAgreement] = None`.
  - The score is strictly `None` / omitted until Developer 4's claim-graph engine genuinely computes semantic convergence.
  - When computed, it emits `{ score: int, note: str, method: "claim-graph-v1", computedAt: "...", demo: false }`. The backend never fabricates fake convergence scores.

---

### Discrepancy E: `NETWORK_OFFLINE` Error Code
- **Frontend Observation**: `NETWORK_OFFLINE` is included in `src/components/ErrorStates.jsx`.
- **Architectural Resolution**:
  - `NETWORK_OFFLINE` is a **browser-side transport condition** (e.g., `navigator.onLine === false` or `fetch()` throwing a `TypeError: Failed to fetch`).
  - The backend server does not emit `NETWORK_OFFLINE`. The server emits `503 SERVICE_UNAVAILABLE` (when downstream dependencies fail) or `504 TIMEOUT` (when provider gateways time out). The frontend network layer catches client transport drops and renders `NETWORK_OFFLINE` locally.

---

## 2. Architectural Decisions Requiring Team Alignment

1. **SSE Transport Mechanism**:
   - *Recommendation*: Use HttpOnly session cookies (`sangram_session`) for browser `EventSource` connections, with an authenticated `fetch` fallback.
   - *Agreement needed with*: Developer 2 (Cookie auth) and Developer 4 (SSE stream).
2. **Idempotency Strategy**:
   - *Recommendation*: Support both `clientBattleId` in the JSON body and standard `Idempotency-Key` header on `POST /api/battles`.
   - *Agreement needed with*: Developer 4 and Developer 5.
3. **Database Migration Strategy**:
   - *Recommendation*: Alembic auto-generation based on `app.db.base.Base.metadata`.
   - *Agreement needed with*: Developer 2.
