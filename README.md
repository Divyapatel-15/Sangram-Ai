# SANGRAM AI — Different Minds. One Arena.

A futuristic multi-page **AI SaaS Dialectic Workspace**. Select multiple AI model profiles, pose complex dilemmas, watch structured cross-examination rounds in an adversarial War Room arena, and review a single consolidated synthesis verdict.

> **Prototype Status:** Frontend Only. Responses, authentication, and payment flows are simulated via centralized client-side mock services. No external API keys or live payment gateways are required.

---

## 🏛 Product Architecture

The application is built on **React 18 + Vite** with a modular multi-page routing structure powered by `react-router-dom`:

```text
sangram-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # Reusable UI primitives (Button, Input, Card, Badge, Modal, Skeleton, EmptyState)
│   │   │   ├── Icons.jsx           # SVG Icon library
│   │   │   └── ...                 # Arena, Config, Timeline, and Debate components
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Frontend authentication state & session provider
│   │   │   └── ToastContext.jsx    # Global toast notification alerts provider
│   │   ├── data/
│   │   │   ├── models.js           # 6 combatant model profiles (ChatGPT, Gemini, Claude, Llama, Mistral, Grok)
│   │   │   ├── archetypes.js       # Cognitive personas (Devil's Advocate, Pragmatist, Purist, etc.)
│   │   │   ├── mockBattles.js      # Centralized debate scenarios and ADR records
│   │   │   ├── mockPlans.js        # Pricing plans (Free Scout, Pro Dialectic, Power Thinker, Team)
│   │   │   ├── mockInvoices.js     # Billing statements and receipt records
│   │   │   ├── mockUser.js         # User profile and credit quotas
│   │   │   └── mockFaqs.js         # FAQ knowledgebase items
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx    # Public website shell with navigation, top announcement, and footer
│   │   │   ├── AuthLayout.jsx      # Ambient particle backdrop for authentication screens
│   │   │   └── DashboardLayout.jsx # SaaS App Shell with sidebar navigation, top bar, and breadcrumbs
│   │   ├── pages/
│   │   │   ├── auth/               # Login, Signup, Verify Email, Forgot Password, Reset Password, Onboarding
│   │   │   ├── public/             # Home, Features, How It Works, Models, Pricing, About, FAQ, Contact, Legal
│   │   │   ├── app/                # Dashboard, War Room Arena, History, Saved Answers, Model Library, Usage, Billing, Settings
│   │   │   ├── checkout/           # Checkout flow, Success, Cancelled, and Failed states
│   │   │   └── NotFoundPage.jsx    # Custom 404 Arena error page
│   │   ├── services/
│   │   │   ├── mock/               # Mock service adapters (Auth, Battle, Billing, Models, Saved, User)
│   │   │   ├── battleService.js    # Deterministic debate generation engine
│   │   │   └── historyStore.js     # Browser localStorage persistence
│   │   ├── styles/
│   │   │   ├── global.css          # Design system variables & Obsidian Precision tokens
│   │   │   ├── App.css             # Component, animation, and marketing section styles
│   │   │   ├── auth.css            # Root interactive arena showdown & light trails styles
│   │   │   └── dashboard.css       # SaaS War Room dialectic topology network & shell styles
│   │   ├── App.jsx                 # Central router with 37 registered routes
│   │   └── main.jsx                # DOM entrypoint
│   ├── public/                     # Static assets (logo, favicon, standalone NEURAL motion landing)
│   ├── index.html                  # HTML template with Google Fonts (Space Grotesk, Inter, JetBrains Mono)
│   └── package.json                # Dependencies (React 18, React-Router-DOM, Vite)
└── README.md                       # Documentation
```

---

## 🗺 Complete Route Map

| Category | Route | Description |
| :--- | :--- | :--- |
| **Root Entry** | `/` | Branded Sangram AI login experience with animated arena clash, light trails, central VS badge & form reveal |
| **Auth** | `/auth/login` | Standard sign-in page with quick demo fill |
| | `/auth/signup` | Free registration with terms agreement |
| | `/auth/verify-email` | 6-digit confirmation code simulation |
| | `/auth/forgot-password` | Password recovery workflow |
| | `/auth/reset-password` | New password selection screen |
| | `/onboarding` | 3-step setup (Role selection, combatant models, cognitive lens) |
| **Public Website** | `/home` | 11-section landing page with looping video hero, benefits, steps, and pricing preview |
| | `/features` | Core dialectic capabilities breakdown |
| | `/how-it-works` | 4-step workflow: Select Models → Ask → Debate → Synthesize |
| | `/models` | The 6 combatants catalog with interactive matchup selector |
| | `/pricing` | Monthly/yearly billing toggle, plan cards, and full comparison matrix |
| | `/about` | Mission, philosophy, and prototype transparency |
| | `/faq` | Frequently asked questions accordion |
| | `/contact` | Working contact inquiry form with toast feedback |
| | `/privacy` | Privacy policy and zero-data-retention disclosure |
| | `/terms` | Terms of service |
| | `/refund-policy` | 14-day money-back guarantee policy |
| **Workspace Shell** | `/app` | Main dashboard with battle metrics, recent battles, and saved ADRs |
| | `/app/arena/new` | War Room deployment setup with question, context, models, and archetypes |
| | `/app/arena/:id` | Live dialectic arena with active SVG topology graph, stream transcript, and synthesis |
| | `/app/history` | Filterable and searchable debate history archive |
| | `/app/saved` | Saved architectural decision records (ADRs) with copy text actions |
| | `/app/models` | Active model catalog and chamber deployment slots |
| | `/app/usage` | Token usage counters and consumption breakdown by model |
| | `/app/billing` | Subscription overview, current tier, and payment history |
| | `/app/billing/manage` | Payment method configuration, billing address, and cancel modal |
| | `/app/billing/invoices` | Detailed invoice list with mock PDF receipt downloads |
| | `/app/billing/upgrade` | Tier comparison and upgrade modal |
| | `/app/settings/profile` | User avatar, name, email, and role configuration |
| | `/app/settings/security` | Password change form, 2FA toggle, and active session manager |
| | `/app/settings/preferences` | Obsidian Precision vs Deep Navy theme toggle and motion preferences |
| **Checkout Flow** | `/checkout` | Plan selection, billing interval, tax calculation, promo code, and payment method |
| | `/checkout/success` | Order confirmation with mock transaction ID |
| | `/checkout/cancelled` | Cancellation status screen with return actions |
| | `/checkout/failed` | Transaction error simulation with retry shortcut |
| **Error Handling** | `*` | 404 Chamber Not Found page |

---

## 🚀 How to Run Locally

```bash
# 1. Clone repository (or navigate to cloned folder)
git clone https://github.com/Nickroy07/Sangram-Ai.git
cd Sangram-Ai/frontend

# 2. Install dependencies
npm install

# 3. Start local development server (Vite on port 3000)
npm run dev

# 4. Open in browser
# http://localhost:3000 (Root Interactive Arena Login)
# http://localhost:3000/home (Public Marketing Website)
# http://localhost:3000/app (Workspace Dashboard)

# 5. Build for production
npm run build
```

---

## 🎨 Design Tokens & Visual Direction

- **Movement:** Obsidian Precision & Atmospheric Depth (inspired by modern developer tools)
- **Backgrounds:** `#050D1A` (Main), `#09172B` (Section), `#0E213A` (Card/Container)
- **Accents:** `#00D9FF` (Electric Cyan), `#4388FF` (Electric Blue)
- **Text:** `#F5F8FF` (Primary), `#9BAEC7` (Secondary), `#6C829E` (Muted)
- **Borders:** `#203954`
- **Typography:** `Space Grotesk` (Display & Headlines), `Inter` (Body & UI), `JetBrains Mono` (Code & Meta)
