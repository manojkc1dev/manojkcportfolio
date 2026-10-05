"""
context_builder.py

Fetches and structures live portfolio data from existing Django models
into a flat, assistant-readable context dict.  All DB access is read-only.
"""
from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)


def build_assistant_context() -> dict[str, Any]:
    """
    Return a structured snapshot of public portfolio data.

    Pulls from every installed portfolio app.  Each section is
    independently try/except guarded so that a missing table or empty
    DB does not crash the endpoint during fresh deployments.
    """
    ctx: dict[str, Any] = {}

    # ── Profile ───────────────────────────────────────────────────────────────
    try:
        from apps.siteconfig.models import SiteProfile  # noqa: PLC0415
        profile = SiteProfile.objects.filter(is_active=True).first()
        if profile:
            ctx['profile'] = {
                'name': profile.owner_name,
                'title': profile.owner_title,
                'bio': profile.bio,
                'location': getattr(profile, 'location', ''),
                'email': getattr(profile, 'contact_email', ''),
                'phone': getattr(profile, 'phone', ''),
                'github': getattr(profile, 'github_url', ''),
                'linkedin': getattr(profile, 'linkedin_url', ''),
            }
    except Exception:  # noqa: BLE001
        logger.debug('context_builder: siteconfig not available', exc_info=True)

    # ── Skills ────────────────────────────────────────────────────────────────
    try:
        from apps.skills.models import SkillCategory  # noqa: PLC0415
        skill_cats = SkillCategory.objects.prefetch_related('skills').order_by('order')
        ctx['skills'] = [
            {
                'category': cat.title,
                'items': [
                    {
                        'name': s.name,
                        'level': s.level,
                        'proficiency': s.proficiency,
                        'years': s.years,
                    }
                    for s in cat.skills.all()
                ],
            }
            for cat in skill_cats
        ]
    except Exception:  # noqa: BLE001
        logger.debug('context_builder: skills not available', exc_info=True)

    # ── Projects ──────────────────────────────────────────────────────────────
    try:
        from apps.portfolio.models import Project  # noqa: PLC0415
        projects = Project.objects.filter(visibility='Published').order_by('order')
        ctx['projects'] = [
            {
                'id': p.id,
                'title': p.title,
                'tagline': p.tagline,
                'description': p.description,
                'category': p.category,
                'tech': p.tech,
                'highlights': p.highlights,
                'status': p.status,
                'role': p.role,
                'client': p.client,
                'industry': p.industry,
                'year': p.year,
            }
            for p in projects
        ]
    except Exception:  # noqa: BLE001
        logger.debug('context_builder: portfolio not available', exc_info=True)

    # ── Experience ────────────────────────────────────────────────────────────
    try:
        from apps.experience.models import Experience  # noqa: PLC0415
        exps = Experience.objects.order_by('-start_date')
        ctx['experience'] = [
            {
                'title': e.title,
                'company': e.company,
                'type': e.type,
                'start_date': str(e.start_date),
                'end_date': str(e.end_date) if e.end_date else 'Present',
                'description': e.description,
                'tech': getattr(e, 'tech', []),
            }
            for e in exps
        ]
    except Exception:  # noqa: BLE001
        logger.debug('context_builder: experience not available', exc_info=True)

    # ── Services ──────────────────────────────────────────────────────────────
    try:
        from apps.services.models import Service  # noqa: PLC0415
        services = Service.objects.filter(is_published=True).order_by('order')
        ctx['services'] = [
            {
                'title': s.title,
                'short_summary': s.short_summary,
                'features': s.features,
                'technologies': s.technologies,
            }
            for s in services
        ]
    except Exception:  # noqa: BLE001
        logger.debug('context_builder: services not available', exc_info=True)

    return ctx
