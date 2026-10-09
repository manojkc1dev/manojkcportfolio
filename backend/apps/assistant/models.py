"""
Assistant Models

No database models required for the deterministic assistant. The assistant
pulls live data from existing portfolio models (Profile, Project, Skill, etc.)
via the context_builder service. This module is intentionally kept empty.

If LLM conversation history or feedback logging is needed later, models
can be added here without touching the rest of the portfolio.
"""
