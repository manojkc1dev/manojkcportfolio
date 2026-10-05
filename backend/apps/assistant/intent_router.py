"""
intent_router.py

Deterministic intent classification and answer generation for the
portfolio AI assistant.  No paid LLM required.

The router:
1. Receives raw user query text + assembled portfolio context.
2. Classifies the intent via keyword/regex scoring.
3. Generates a structured text answer drawn from the real context data.
4. Returns suggested follow-up actions.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Literal


# ─── Types ────────────────────────────────────────────────────────────────────

IntentId = Literal[
    'greeting',
    'tech_stack',
    'database_optimization',
    'payments',
    'rates_hiring',
    'projects',
    'security',
    'contact',
    'experience',
    'services',
    'about',
    'fallback',
]


@dataclass
class SuggestedAction:
    label: str
    action_type: Literal['link', 'query']
    target: str


@dataclass
class RouterResult:
    intent: IntentId
    answer: str
    confidence: float          # 0.0 – 1.0
    suggested_actions: list[SuggestedAction] = field(default_factory=list)
    data_source: Literal['live_db', 'static_fallback'] = 'static_fallback'


# ─── Intent Definitions ───────────────────────────────────────────────────────

_INTENTS: list[dict[str, Any]] = [
    {
        'id': 'greeting',
        'keywords': ['hi', 'hello', 'hey', 'namaste', 'morning', 'afternoon', 'evening', 'sup', 'yo', 'start', 'help'],
        'patterns': [r'\b(hi|hello|hey|namaste|greetings|good\s+(morning|afternoon|evening))\b'],
        'actions': [
            SuggestedAction('🛠️ Tech Stack', 'query', 'What backend technologies does Manoj specialize in?'),
            SuggestedAction('⚡ PostgreSQL Tuning', 'query', 'How does Manoj optimize database performance?'),
            SuggestedAction('💳 Payment Integrations', 'query', 'What payment gateways has Manoj integrated?'),
            SuggestedAction('💼 Rates & Availability', 'query', "What are Manoj's rates and freelance availability?"),
        ],
    },
    {
        'id': 'tech_stack',
        'keywords': ['tech', 'stack', 'technology', 'skill', 'language', 'python', 'django', 'drf',
                     'fastapi', 'rest', 'api', 'tool', 'framework', 'speciali'],
        'patterns': [r'what\s+(backend\s+)?technolog', r'tech\s*stack', r'what\s+tools', r'speciali[sz]e'],
        'actions': [
            SuggestedAction('📂 View Skills', 'link', '#skills'),
            SuggestedAction('⚡ PostgreSQL Tuning', 'query', 'How does Manoj optimize database performance?'),
            SuggestedAction('📁 Projects', 'link', '#projects'),
        ],
    },
    {
        'id': 'database_optimization',
        'keywords': ['database', 'postgres', 'postgresql', 'optimize', 'optimization', 'performance',
                     'query', 'slow', 'n+1', 'index', 'explain', 'analyze', 'redis', 'cache', 'caching'],
        'patterns': [r'optimize\s+(database|postgres|query|performance)', r'n\+1', r'index', r'slow\s+quer'],
        'actions': [
            SuggestedAction('📂 View Projects', 'link', '#projects'),
            SuggestedAction('💳 Payment Pipelines', 'query', 'What payment gateways has Manoj integrated?'),
            SuggestedAction('💬 Architecture Audit', 'link', '#contact'),
        ],
    },
    {
        'id': 'payments',
        'keywords': ['payment', 'gateway', 'khalti', 'esewa', 'connectips', 'stripe', 'checkout',
                     'webhook', 'idempotency', 'fintech', 'transaction', 'ledger'],
        'patterns': [r'what\s+payment', r'payment\s+gateway', r'khalti', r'esewa', r'stripe', r'webhook'],
        'actions': [
            SuggestedAction('📂 View FinTech Projects', 'link', '#projects'),
            SuggestedAction('💼 Rates & Timelines', 'query', "What are Manoj's rates and freelance availability?"),
            SuggestedAction('💬 Inquire Custom Engine', 'link', 'https://wa.me/9779842203976'),
        ],
    },
    {
        'id': 'rates_hiring',
        'keywords': ['rate', 'price', 'pricing', 'cost', 'hire', 'hiring', 'available', 'availability',
                     'freelance', 'remote', 'budget', 'quote', 'contract', 'salary', 'work'],
        'patterns': [r'rate', r'pric(e|ing)', r'how\s+much', r'is\s+manoj\s+available', r'freelance', r'hire'],
        'actions': [
            SuggestedAction('💬 WhatsApp', 'link', 'https://wa.me/9779842203976'),
            SuggestedAction('✉️ Email', 'link', 'mailto:manojkc1dev@gmail.com'),
            SuggestedAction('📝 Contact Form', 'link', '#contact'),
        ],
    },
    {
        'id': 'projects',
        'keywords': ['project', 'portfolio', 'work', 'built', 'build', 'made', 'created', 'erp',
                     'inventory', 'warehouse', 'agritech', 'retail', 'billing'],
        'patterns': [r'what\s+(project|work|have\s+you\s+built)', r'show\s+me', r'portfolio', r'case\s+study'],
        'actions': [
            SuggestedAction('📂 View All Projects', 'link', '#projects'),
            SuggestedAction('⚡ PostgreSQL Used', 'query', 'How does Manoj optimize database performance?'),
            SuggestedAction('💬 Custom Project', 'link', '#contact'),
        ],
    },
    {
        'id': 'security',
        'keywords': ['security', 'auth', 'authentication', 'jwt', 'rbac', 'permission', 'owasp',
                     'safe', 'protect', 'cors', 'csrf', 'sql', 'injection'],
        'patterns': [r'security', r'authentication', r'jwt', r'rbac', r'how\s+do\s+you\s+secure'],
        'actions': [
            SuggestedAction('🛠️ Engineering Philosophy', 'link', '#about'),
            SuggestedAction('💳 Payment Security', 'query', 'What payment gateways has Manoj integrated?'),
            SuggestedAction('📩 Security Audit', 'link', '#contact'),
        ],
    },
    {
        'id': 'contact',
        'keywords': ['contact', 'reach', 'email', 'phone', 'whatsapp', 'call', 'talk', 'address',
                     'location', 'message', 'connect'],
        'patterns': [r'how\s+to\s+contact', r'phone', r'email', r'whatsapp', r'reach', r'location'],
        'actions': [
            SuggestedAction('💬 WhatsApp', 'link', 'https://wa.me/9779842203976'),
            SuggestedAction('✉️ Email Manoj', 'link', 'mailto:manojkc1dev@gmail.com'),
            SuggestedAction('📝 Contact Form', 'link', '#contact'),
        ],
    },
    {
        'id': 'experience',
        'keywords': ['experience', 'career', 'job', 'work history', 'background', 'worked', 'company',
                     'employer', 'years', 'junior', 'senior'],
        'patterns': [r'experience', r'career', r'work\s+history', r'background', r'how\s+many\s+years'],
        'actions': [
            SuggestedAction('📂 View Projects', 'link', '#projects'),
            SuggestedAction('📄 Resume', 'link', '#resume'),
            SuggestedAction('💼 Hire Manoj', 'query', "What are Manoj's rates and freelance availability?"),
        ],
    },
    {
        'id': 'services',
        'keywords': ['service', 'offer', 'providing', 'consultancy', 'consulting', 'development',
                     'api development', 'backend development', 'fullstack'],
        'patterns': [r'what\s+service', r'what\s+do\s+you\s+offer', r'service', r'consultanc'],
        'actions': [
            SuggestedAction('🛠️ View Services', 'link', '#services'),
            SuggestedAction('💼 Rates', 'query', "What are Manoj's rates and freelance availability?"),
            SuggestedAction('💬 Custom Quote', 'link', '#contact'),
        ],
    },
    {
        'id': 'about',
        'keywords': ['about', 'who', 'manoj', 'bio', 'profile', 'story', 'background', 'education', 'degree'],
        'patterns': [r'who\s+is', r'about\s+manoj', r'tell\s+me\s+about', r'bio', r'profile'],
        'actions': [
            SuggestedAction('👤 About Section', 'link', '#about'),
            SuggestedAction('📄 Resume', 'link', '#resume'),
            SuggestedAction('💬 Contact', 'link', '#contact'),
        ],
    },
]


# ─── Scoring ──────────────────────────────────────────────────────────────────

def _score(query: str, intent: dict[str, Any]) -> int:
    score = 0
    clean = query.lower()
    for pat in intent.get('patterns', []):
        if re.search(pat, clean):
            score += 8
    for kw in intent.get('keywords', []):
        if kw in clean:
            score += 3
    return score


def _classify(query: str) -> tuple[dict[str, Any] | None, int]:
    best, best_score = None, 0
    for intent in _INTENTS:
        s = _score(query, intent)
        if s > best_score:
            best_score = s
            best = intent
    return best, best_score


# ─── Answer Generators ────────────────────────────────────────────────────────

def _answer_tech_stack(ctx: dict[str, Any]) -> tuple[str, str]:
    skills = ctx.get('skills', [])
    if not skills:
        return _static_tech_stack(), 'static_fallback'

    lines = ["Manoj's core technical stack (from live portfolio data):\n"]
    for cat in skills:
        if cat.get('items'):
            names = ', '.join(s['name'] for s in cat['items'][:8])
            lines.append(f"• {cat['category']}: {names}")
    return '\n'.join(lines), 'live_db'


def _answer_projects(ctx: dict[str, Any]) -> tuple[str, str]:
    projects = ctx.get('projects', [])
    if not projects:
        return _static_projects(), 'static_fallback'

    lines = [f"Manoj has {len(projects)} published project(s) in his portfolio:\n"]
    for p in projects[:5]:  # cap at 5
        tech_str = ', '.join(p.get('tech', [])[:4]) if p.get('tech') else ''
        line = f"• **{p['title']}** — {p.get('tagline') or p.get('description', '')[:80]}"
        if tech_str:
            line += f"\n  Stack: {tech_str}"
        lines.append(line)
    if len(projects) > 5:
        lines.append(f"\n…and {len(projects) - 5} more. View the Projects section for full case studies.")
    return '\n'.join(lines), 'live_db'


def _answer_experience(ctx: dict[str, Any]) -> tuple[str, str]:
    exps = ctx.get('experience', [])
    if not exps:
        return _static_experience(), 'static_fallback'

    lines = ["Manoj's career experience:\n"]
    for e in exps[:4]:
        period = f"{e['start_date'][:7]} – {e['end_date'][:7] if e['end_date'] != 'Present' else 'Present'}"
        lines.append(f"• **{e['title']}** at {e['company']} ({period})")
        if e.get('description'):
            lines.append(f"  {e['description'][:100]}...")
    return '\n'.join(lines), 'live_db'


def _answer_services(ctx: dict[str, Any]) -> tuple[str, str]:
    services = ctx.get('services', [])
    if not services:
        return _static_services(), 'static_fallback'

    lines = ["Manoj offers the following engineering services:\n"]
    for s in services:
        lines.append(f"• **{s['title']}** — {s.get('short_summary', '')}")
    return '\n'.join(lines), 'live_db'


def _answer_about(ctx: dict[str, Any]) -> tuple[str, str]:
    profile = ctx.get('profile')
    if not profile:
        return _static_about(), 'static_fallback'

    parts = [f"**{profile.get('name', 'Manoj K.C.')}** — {profile.get('title', 'Full-Stack Engineer')}"]
    if profile.get('bio'):
        parts.append(f"\n{profile['bio'][:300]}")
    if profile.get('location'):
        parts.append(f"\n📍 {profile['location']}")
    return '\n'.join(parts), 'live_db'


# ─── Static Fallbacks ─────────────────────────────────────────────────────────

def _static_tech_stack() -> str:
    return (
        "Manoj's core backend engineering stack:\n\n"
        "• Languages: Python 3.12, TypeScript, SQL\n"
        "• Frameworks: Django 5.x, Django REST Framework, FastAPI\n"
        "• Databases: PostgreSQL (advanced indexing, schema design), MySQL\n"
        "• Cache & Async: Redis, Celery\n"
        "• Auth & Security: JWT, OAuth2, RBAC, CORS/CSRF hardening\n"
        "• DevOps: Docker, GitHub Actions CI/CD, Nginx, Linux"
    )


def _static_db() -> str:
    return (
        "Manoj resolves database bottlenecks via a 4-pillar methodology:\n\n"
        "1. Execution Plan Profiling: PostgreSQL EXPLAIN (ANALYZE, BUFFERS)\n"
        "2. N+1 Elimination: select_related / prefetch_related with Prefetch() objects\n"
        "3. Strategic Indexing: composite B-Tree and partial indexes\n"
        "4. Redis Query Caching: serialized querysets with transaction-safe invalidation\n\n"
        "Verified outcome: ~30% latency reduction on high-traffic endpoints."
    )


def _static_payments() -> str:
    return (
        "Manoj has integrated production payment gateways:\n\n"
        "• Khalti API v2 — server-to-server token verification\n"
        "• eSewa EPAY v2 — HMAC-SHA256 request signatures\n"
        "• Stripe — PaymentIntents, webhook events, customer portal\n\n"
        "Enterprise protections:\n"
        "✓ DB-level idempotency keys (prevent double-charging)\n"
        "✓ Cryptographic webhook signature verification\n"
        "✓ Dead-letter queue with exponential-backoff replay\n"
        "✓ Two-phase ledger reconciliation"
    )


def _static_rates() -> str:
    return (
        "Manoj is available for remote freelance contracts worldwide:\n\n"
        "• Availability: Immediate — Remote or Kathmandu on-site\n"
        "• Hours: Sun–Fri 9:00 AM – 6:00 PM NPT (UTC+5:45)\n\n"
        "Transparent pricing:\n"
        "• REST API / Small Module: NPR 50K–100K (~$380–$750) · 1-2 weeks\n"
        "• Full-Stack Web App: NPR 100K–200K (~$750–$1,500) · 3-4 weeks\n"
        "• Enterprise ERP / FinTech: NPR 200K–400K+ (~$1,500–$3,000+) · 2-3 months\n\n"
        "Every project includes source code, Docker configs, docs, and post-launch support."
    )


def _static_security() -> str:
    return (
        "Manoj enforces enterprise security across all API deployments:\n\n"
        "• Auth: Stateless JWT — short-lived access tokens, encrypted refresh tokens in HttpOnly SameSite cookies, blacklisting on logout\n"
        "• Authorization: Granular RBAC via custom DRF permissions\n"
        "• Data: Parameterized ORM queries, strict input sanitization, Redis rate-limiting\n"
        "• Transport: HTTPS, HSTS, strict CORS, Content Security Policy"
    )


def _static_contact() -> str:
    return (
        "Direct channels to reach Manoj K.C.:\n\n"
        "• Phone / WhatsApp: +977 9842203976\n"
        "• Email: manojkc1dev@gmail.com\n"
        "• LinkedIn: linkedin.com/in/manojkc1dev\n"
        "• GitHub: github.com/manojkc1dev\n"
        "• Location: Kathmandu, Nepal"
    )


def _static_greeting() -> str:
    return (
        "Namaste! 🙏 I'm Manoj's Technical Portfolio Assistant.\n\n"
        "I can answer questions about Manoj's backend architectures, PostgreSQL "
        "performance work, payment integrations, engineering services, or "
        "availability for freelance/full-time contracts.\n\n"
        "Select a topic below or type any technical question:"
    )


def _static_projects() -> str:
    return (
        "Manoj's portfolio features production engineering projects including:\n\n"
        "• Himalayan Retail ERP — multi-branch inventory, Celery sync, VAT billing\n"
        "• Agritech Platform — supply-chain management, farmer-buyer marketplace\n"
        "• FinTech Settlement API — Khalti/eSewa/Stripe with idempotency guarantees\n\n"
        "Visit the Projects section for full case studies."
    )


def _static_experience() -> str:
    return (
        "Manoj K.C. is a full-stack engineer based in Kathmandu with several years of "
        "professional backend engineering experience across Django, PostgreSQL, and "
        "distributed systems.\n\n"
        "Visit the Experience section for the detailed timeline."
    )


def _static_services() -> str:
    return (
        "Manoj offers professional engineering services:\n\n"
        "• Backend API Development (Django / DRF / FastAPI)\n"
        "• PostgreSQL Performance Optimization\n"
        "• Payment Gateway Integration (Khalti, eSewa, Stripe)\n"
        "• Full-Stack Web Application Development\n"
        "• Technical Architecture Consulting\n\n"
        "Visit the Services section for detailed scopes and deliverables."
    )


def _static_about() -> str:
    return (
        "Manoj K.C. is a full-stack software engineer based in Kathmandu, Nepal, "
        "specializing in Django REST backends, PostgreSQL performance engineering, "
        "and production payment pipeline integrations.\n\n"
        "He builds clean, scalable, and well-documented systems for clients worldwide."
    )


def _static_fallback_answer() -> str:
    return (
        "I'm here to provide verified technical facts about Manoj's backend engineering, "
        "database architectures, payment pipelines, or contract rates.\n\n"
        "Please choose a topic below or ask a specific technical question:"
    )


# ─── Public API ───────────────────────────────────────────────────────────────

_FALLBACK_ACTIONS = [
    SuggestedAction('⚡ Backend & Tech Stack', 'query', 'What backend technologies does Manoj specialize in?'),
    SuggestedAction('🚀 Database Optimization', 'query', 'How does Manoj optimize database performance?'),
    SuggestedAction('💳 Payment Gateways', 'query', 'What payment gateways has Manoj integrated?'),
    SuggestedAction('💼 Rates & Availability', 'query', "What are Manoj's rates and freelance availability?"),
]


def route(query: str, context: dict[str, Any]) -> RouterResult:
    """
    Classify query intent and produce a structured answer.

    Args:
        query:   Raw user question string.
        context: Portfolio context from context_builder.build_assistant_context().

    Returns:
        RouterResult with answer text, confidence, suggested actions, and source.
    """
    intent_def, score = _classify(query)

    if not intent_def or score < 3:
        return RouterResult(
            intent='fallback',
            answer=_static_fallback_answer(),
            confidence=0.0,
            suggested_actions=_FALLBACK_ACTIONS,
            data_source='static_fallback',
        )

    intent_id: IntentId = intent_def['id']
    actions: list[SuggestedAction] = intent_def.get('actions', [])
    confidence = min(1.0, score / 24)  # normalize to 0–1

    # ── Generate answer per intent ────────────────────────────────────────────
    if intent_id == 'greeting':
        answer = _static_greeting()
        source = 'static_fallback'

    elif intent_id == 'tech_stack':
        answer, source = _answer_tech_stack(context)

    elif intent_id == 'database_optimization':
        answer = _static_db()
        source = 'static_fallback'

    elif intent_id == 'payments':
        answer = _static_payments()
        source = 'static_fallback'

    elif intent_id == 'rates_hiring':
        answer = _static_rates()
        source = 'static_fallback'

    elif intent_id == 'projects':
        answer, source = _answer_projects(context)

    elif intent_id == 'security':
        answer = _static_security()
        source = 'static_fallback'

    elif intent_id == 'contact':
        answer = _static_contact()
        source = 'static_fallback'

    elif intent_id == 'experience':
        answer, source = _answer_experience(context)

    elif intent_id == 'services':
        answer, source = _answer_services(context)

    elif intent_id == 'about':
        answer, source = _answer_about(context)

    else:
        answer = _static_fallback_answer()
        source = 'static_fallback'
        actions = _FALLBACK_ACTIONS

    return RouterResult(
        intent=intent_id,
        answer=answer,
        confidence=round(confidence, 2),
        suggested_actions=actions,
        data_source=source,  # type: ignore[arg-type]
    )
