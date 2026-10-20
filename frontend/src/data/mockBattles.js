/**
 * Centralized Mock Battle Data for Sangram AI
 * 
 * Provides realistic dialectic sessions with structured rounds:
 * 1. Opening Claims
 * 2. Cross-Examination & Critiques
 * 3. Defend & Revise
 * 4. Consolidated Synthesis Verdict
 */

export const mockBattlesList = [
  {
    id: 'battle-microservices-monolith',
    title: 'Microservices vs Modular Monolith for Early-Stage B2B SaaS',
    topic: 'Architecture & Scaling',
    date: '2026-10-18T14:32:00Z',
    models: ['claude', 'chatgpt', 'gemini'],
    status: 'completed',
    roundsCount: 4,
    tags: ['Architecture', 'Engineering', 'Cloud'],
    summary: 'Consensus strongly favored a Modular Monolith with strict package boundaries for teams under 15 engineers, deferring distributed microservices until independent deployability becomes a measured organizational bottleneck.',
    consensusScore: 94,
    tensions: [
      'Operational tax of distributed tracing vs monolithic blast radius',
      'Team cognitive load during rapid pivots'
    ]
  },
  {
    id: 'battle-python-rust-ai',
    title: 'Python vs Rust for High-Throughput LLM Inference Pipelines',
    topic: 'AI Infrastructure',
    date: '2026-10-17T09:15:00Z',
    models: ['chatgpt', 'llama'],
    status: 'completed',
    roundsCount: 3,
    tags: ['AI/ML', 'Performance', 'Systems'],
    summary: 'Hybrids prevail: Use Rust for token-streaming gateways, tensor memory buffers, and orchestration kernels (vLLM/Candle); retain Python for rapid model experimentation and client SDK interfaces.',
    consensusScore: 91,
    tensions: [
      'Developer velocity vs p99 tail latency guarantees',
      'Ecosystem package maturity in zero-copy tensor manipulation'
    ]
  },
  {
    id: 'battle-sql-nosql-graph',
    title: 'PostgreSQL vs Dedicated Vector DB for RAG Implementations',
    topic: 'Data Systems',
    date: '2026-10-15T18:40:00Z',
    models: ['gemini', 'claude'],
    status: 'completed',
    roundsCount: 3,
    tags: ['Databases', 'RAG', 'Postgres'],
    summary: 'PostgreSQL with pgvector is overwhelmingly sufficient for sub-10M vector catalogs with relational metadata constraints; dedicated vector DBs become necessary only for massive multi-tenant shard scale.',
    consensusScore: 96,
    tensions: [
      'Index build times on concurrent writes in pgvector vs specialized HNSW engines',
      'ACID transactional parity across document chunks and relational entities'
    ]
  },
  {
    id: 'battle-agile-shape-up',
    title: 'Two-Week Scrum Sprints vs Basecamp Shape-Up Method',
    topic: 'Product Management',
    date: '2026-10-12T11:20:00Z',
    models: ['mistral', 'grok'],
    status: 'completed',
    roundsCount: 3,
    tags: ['Product', 'Workflow', 'Leadership'],
    summary: 'Scrum shines in maintenance and deterministic feature delivery, while Shape-Up prevents burnout and provides deep 6-week uninterrupted focus for exploratory product releases.',
    consensusScore: 88,
    tensions: [
      'Predictable release cadence for stakeholders vs uninterrupted engineering deep-work',
      'Handling sudden high-priority bugs during active betting cycles'
    ]
  }
];

export const getBattleById = (id) => {
  const found = mockBattlesList.find(b => b.id === id);
  if (found) return found;
  // Fallback template for any custom ID
  return {
    id: id || 'battle-sample',
    title: 'Comparative Model Dialectic in Sangram Arena',
    topic: 'General Dialectic',
    date: new Date().toISOString(),
    models: ['chatgpt', 'claude'],
    status: 'completed',
    roundsCount: 3,
    tags: ['Debate', 'Dialectic', 'Analysis'],
    summary: 'The competing models converged on a unified first-principles solution after examining counterarguments and stress-testing edge cases.',
    consensusScore: 92,
    tensions: ['Execution speed vs exhaustive edge-case coverage']
  };
};

export const mockSavedAnswersList = [
  {
    id: 'saved-1',
    battleId: 'battle-microservices-monolith',
    title: 'Modular Monolith Architectural Decision Record (ADR)',
    question: 'When should a B2B SaaS startup transition from monolith to microservices?',
    dateSaved: '2026-10-18T15:00:00Z',
    modelsUsed: ['Claude 3.5 Sonnet', 'GPT-5', 'Gemini 2.5 Pro'],
    tags: ['Architecture', 'Best Practices'],
    verdict: `### Synthesis & Consolidated Verdict:
1. **Default to Modular Monolith**: Enforce boundaries through domain modules rather than network hops.
2. **Key Metric to Watch**: Transition only when two teams repeatedly collide on deployment schedules or when a single service demands 10x hardware specialization (e.g., GPU video processing).
3. **Database Rule**: Keep a single database initially, but strictly forbid cross-module joins using code linters.`,
    isFavorite: true
  },
  {
    id: 'saved-2',
    battleId: 'battle-sql-nosql-graph',
    title: 'PgVector vs Pinecone Decision Matrix',
    question: 'Should our startup start with pgvector in Postgres or provision a managed Pinecone cluster?',
    dateSaved: '2026-10-15T19:10:00Z',
    modelsUsed: ['Gemini 2.5 Pro', 'Claude Sonnet 4.5'],
    tags: ['Databases', 'RAG'],
    verdict: `### Consolidated Architecture Recommendation:
- **Phase 1 (<5M vectors)**: Stay with PostgreSQL + pgvector (HNSW index). Keeps metadata filtering trivial and prevents dual-system synchronization bugs.
- **Phase 2 (>10M vectors or sub-15ms p99 SLA)**: Offload embeddings to a distributed vector index while keeping PostgreSQL as the relational source of truth.`,
    isFavorite: false
  }
];
