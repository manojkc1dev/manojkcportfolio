---
trigger: always_on
---

# Portfolio Workspace Rules

## Project

This is a production personal portfolio application.

The frontend is an existing React + TypeScript application whose UI/UX must be preserved.

The backend is being migrated to:

* Python
* Django
* Django REST Framework
* PostgreSQL
* Redis
* Celery
* JWT authentication

## Core Rule

DO NOT redesign the existing frontend unless explicitly requested.

DO NOT remove existing functionality unless explicitly requested.

DO NOT invent requirements.

DO NOT change existing UI/UX unnecessarily.

Prefer minimal, targeted changes.

## Architecture

Use:

Frontend:
React + TypeScript + Vite

Backend:
Django + Django REST Framework

Database:
PostgreSQL

Authentication:
JWT using Django REST Framework SimpleJWT

Cache/Broker:
Redis

Background jobs:
Celery

## Backend Architecture

Prefer a modular Django structure.

Separate:

* authentication
* portfolio/projects
* services
* blog
* contact/inquiries
* site configuration
* administration

Use serializers for API representation.

Use service-layer logic where business logic becomes non-trivial.

Keep views thin.

Use database constraints for data integrity.

Use indexes for frequently queried fields.

Use slugs for public content where appropriate.

## API

All API endpoints must be documented before implementation.

Use predictable REST conventions.

Public endpoints must never expose administrator-only information.

Admin endpoints must require authentication and appropriate authorization.

Use pagination for potentially large collections.

Use filtering/search only where required by the existing frontend.

## Security

Never expose secrets in source code.

Never commit:

.env
database passwords
JWT secrets
API keys
production credentials

Use environment variables.

Configure CORS explicitly.

Use secure production settings.

Never disable authentication simply to make development easier.

## Database

PostgreSQL is the production database.

Use Django migrations.

Never manually modify production database schema.

Do not destroy existing data during migrations.

Prefer reversible migrations.

## Authentication

Use JWT access and refresh tokens.

Keep authentication state predictable.

Do not store sensitive credentials in localStorage unless explicitly justified.

Protect admin endpoints server-side.

Frontend route protection is not a replacement for backend authorization.

## Redis/Celery

Redis must only be introduced where useful.

Use Celery for genuinely asynchronous work.

Do not add Celery tasks merely for architectural complexity.

## Development Process

Work in phases.

Before implementation:

1. inspect relevant files
2. understand existing behavior
3. produce an implementation plan
4. identify affected files
5. identify risks
6. implement the smallest safe change
7. run tests
8. run type checks
9. run linting
10. provide a concise verification report

## Git

Use feature branches.

Never commit directly to main during active development.

Use small, meaningful commits.

Commit messages should describe the actual change.

Example:

feat(api): add portfolio project endpoints

fix(auth): handle expired access tokens

test(projects): add project API coverage

docs(api): document project endpoints

## Token Efficiency

Do not repeatedly reread the entire repository.

Use documentation in /docs as the primary architectural context.

Inspect only files relevant to the current phase.

Do not regenerate documentation that already exists unless it has become outdated.

Do not rewrite working code unnecessarily.

## Verification

Every implementation phase must end with:

* files changed
* tests executed
* checks passed
* known issues
* next recommended phase

Never claim success without actually running the relevant verification commands.
