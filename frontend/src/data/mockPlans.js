/**
 * Centralized Plan & Pricing Configuration for Sangram AI
 * 
 * Honest prototype notice:
 * No payment gateway is attached in this phase.
 * Plans and pricing tiers are proposed SaaS tiers for UI review.
 */

export const billingFrequencies = [
  { id: 'monthly', label: 'Monthly', discountBadge: null },
  { id: 'yearly', label: 'Yearly', discountBadge: 'Save 20%' }
];

export const plans = [
  {
    id: 'free',
    name: 'Free Scout',
    tagline: 'Explore multi-model dialectics with daily credits.',
    popular: false,
    price: {
      monthly: 0,
      yearly: 0
    },
    period: '/ month',
    description: 'Perfect for curious minds exploring how different models compare and debate.',
    badge: 'Starter',
    features: [
      { text: '5 Arena Battles per day', included: true },
      { text: 'Access to 3 Flagship Models (GPT-5, Gemini, Claude)', included: true },
      { text: 'Standard Dialectic Synthesis', included: true },
      { text: '7-Day History Storage', included: true },
      { text: 'Export answers to Markdown', included: true },
      { text: 'Full 6-Model Arena Matrix', included: false },
      { text: 'Custom Cognitive Archetypes', included: false },
      { text: 'Live War Room Topology & Steerability', included: false },
      { text: 'Priority Generation Queue', included: false }
    ],
    cta: 'Start Free',
    ctaLink: '/auth/signup',
    limits: {
      dailyBattles: 5,
      savedAnswers: 20,
      parallelModels: 2
    }
  },
  {
    id: 'pro',
    name: 'Pro Dialectic',
    tagline: 'For researchers, developers & decision makers.',
    popular: true,
    price: {
      monthly: 29,
      yearly: 24
    },
    period: '/ month',
    description: 'Full arena power with unlimited debates, all 6 models, and advanced cognitive synthesis.',
    badge: 'Most Popular',
    features: [
      { text: 'Unlimited Arena Battles', included: true },
      { text: 'All 6 Models (GPT, Claude, Gemini, Llama, Mistral, Grok)', included: true },
      { text: 'Advanced Cross-Examination & Consensus Synthesis', included: true },
      { text: 'Unlimited History & Saved Answers', included: true },
      { text: 'Custom Cognitive Archetypes (Devil’s Advocate, Pragmatist)', included: true },
      { text: 'Interactive War Room Dialectic Topology', included: true },
      { text: 'High-speed Parallel Generation Queue', included: true },
      { text: 'Dedicated API Access & Webhooks', included: false },
      { text: 'Team Workspace & Shared Chamber', included: false }
    ],
    cta: 'Get Pro Access',
    ctaLink: '/checkout?plan=pro',
    limits: {
      dailyBattles: 'Unlimited',
      savedAnswers: 'Unlimited',
      parallelModels: 3
    }
  },
  {
    id: 'power',
    name: 'Power Thinker',
    tagline: 'Deep research suites with multi-model arbitration.',
    popular: false,
    price: {
      monthly: 79,
      yearly: 64
    },
    period: '/ month',
    description: 'Heavy computational dialectic runs with 4-way parallel clash and deep thesis audits.',
    badge: 'Advanced',
    features: [
      { text: 'All Pro Dialectic Features', included: true },
      { text: '4-Way Simultaneous Model Battles', included: true },
      { text: 'Red-Team Assassin Audit Round', included: true },
      { text: 'Epistemic Uncertainty Heatmaps', included: true },
      { text: 'Export to PDF, Markdown & Notion', included: true },
      { text: 'Extended 128k Token Context Debate Depth', included: true },
      { text: 'Early Access to New Model Weights & Checkpoints', included: true },
      { text: 'Team Shared Workspace', included: false }
    ],
    cta: 'Upgrade to Power',
    ctaLink: '/checkout?plan=power',
    limits: {
      dailyBattles: 'Unlimited',
      savedAnswers: 'Unlimited',
      parallelModels: 4
    }
  },
  {
    id: 'team',
    name: 'Team / Enterprise',
    tagline: 'Collaborative war room chambers for engineering squads.',
    popular: false,
    price: {
      monthly: 199,
      yearly: 159
    },
    period: '/ month',
    description: 'Centralized organizational dialectics, team history, shared archetypes, and private chambers.',
    badge: 'Enterprise',
    features: [
      { text: 'Up to 15 Team Members included', included: true },
      { text: 'Shared Team War Rooms & Private Chambers', included: true },
      { text: 'Custom Enterprise Cognitive Personas', included: true },
      { text: 'Centralized Billing & Invoice Management', included: true },
      { text: 'Audit Logs & Team Analytics', included: true },
      { text: 'SLA Guarantee & Dedicated Slack Channel', included: true },
      { text: 'SOC2 Compliant Data Privacy Agreement', included: true },
      { text: 'Custom LLM Fine-Tuned Model Integrations', included: true }
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    limits: {
      dailyBattles: 'Unlimited',
      savedAnswers: 'Unlimited',
      parallelModels: 6
    }
  }
];

export const featureComparisonMatrix = [
  {
    category: 'Arena Capabilities',
    rows: [
      { name: 'Simultaneous Models per Battle', free: '2 Models', pro: '3 Models', power: '4 Models', team: '6 Models' },
      { name: 'Debate Rounds Depth', free: '2 Rounds', pro: '4 Rounds', power: '6 Rounds', team: 'Unlimited' },
      { name: 'Cross-Examination Dialectic', free: 'Basic', pro: 'Full Dialectic', power: 'Deep Audit', power: 'Deep Audit' },
      { name: 'Consensus Synthesis Engine', free: 'Standard', pro: 'Advanced Multi-Lens', power: 'Epistemic Heatmap', team: 'Epistemic Heatmap' },
      { name: 'Red-Team Assassin Stress-Test', free: '—', pro: 'Included', power: 'Deep Vector', team: 'Deep Vector' }
    ]
  },
  {
    category: 'Models & Personas',
    rows: [
      { name: 'Model Library Access', free: '3 Models', pro: 'All 6 Models', power: 'All + Early Betas', team: 'All + Custom LLMs' },
      { name: 'Cognitive Archetypes', free: 'Default Only', pro: '6 Personas', power: 'Custom Persona Builder', team: 'Team Shared Personas' },
      { name: 'System Context Injection', free: '500 words', pro: '4,000 words', power: '16,000 words', team: '32,000 words' }
    ]
  },
  {
    category: 'Collaboration & Export',
    rows: [
      { name: 'History Retention', free: '7 Days', pro: 'Permanent', power: 'Permanent', team: 'Permanent + Audit Log' },
      { name: 'Saved Answers & Collections', free: '20 Items', pro: 'Unlimited', power: 'Unlimited', team: 'Unlimited Shared' },
      { name: 'Export Formats', free: 'Markdown', pro: 'MD, JSON, Text', power: 'MD, JSON, PDF, Notion', team: 'All Formats + Webhook' },
      { name: 'Team Seats', free: '1 User', pro: '1 User', power: '1 User', team: 'Up to 15 Included' }
    ]
  }
];
