# Phase 2C - Repository Inventory

## Audit Date: September 4, 2026

## Repository Structure

### Root Directory

```
manojkcportfolio/
├── .git/
├── .gitignore
├── .env
├── .venv/
├── admin-frontend/          # Separate admin frontend (React + Vite)
├── backend/                 # Django REST Framework backend
├── docs/                    # Documentation directory
├── frontend/                # Main portfolio frontend (React + Vite)
├── docker-compose.yml
├── docker-compose.dev.yml
├── nginx.conf
├── sitemap.xml
└── *.md files (47 markdown files at root)
```

### Backend Structure

**Location:** `/backend/`

**Total Apps in apps/ directory:** 36

**Apps List:**
1. about/ (20 items)
2. accounts/ (28 items)
3. achievements/ (20 items)
4. analytics/ (20 items)
5. api/ (18 items) - **SUSPECTED ORPHANED**
6. audit_logs/ (18 items)
7. authentication/ (1 item - urls.py only) - **SUSPECTED ORPHANED**
8. blogs/ (24 items)
9. certifications/ (20 items)
10. clients/ (20 items)
11. common/ (18 items) - **SUSPECTED ORPHANED**
12. contact/ (26 items)
13. dashboard/ (21 items)
14. education/ (24 items)
15. experience/ (25 items)
16. faqs/ (20 items)
17. github/ (8 items)
18. hero/ (25 items)
19. media/ (0 items) - **EMPTY DIRECTORY**
20. newsletter/ (20 items)
21. notifications/ (18 items)
22. project_categories/ (21 items)
23. project_features/ (20 items)
24. project_gallery/ (20 items)
25. project_images/ (20 items)
26. project_technologies/ (20 items)
27. project_videos/ (20 items)
28. projects/ (25 items)
29. resume/ (20 items)
30. search/ (20 items)
31. seo/ (20 items)
32. services/ (23 items)
33. settings/ (21 items)
34. skills/ (25 items)
35. socials/ (20 items)
36. techstack/ (21 items)
37. testimonials/ (20 items)
38. timeline/ (20 items)

**Core Apps:**
- core/ (in backend/core/)

**API Structure:**
- api/ (in backend/api/)

### Frontend Structure

**Location:** `/frontend/`

**Total Components:** 40+ components
**Total Services:** 24 services
**Total TypeScript Files:** 72

**Frontend Structure:**
```
frontend/
├── src/
│   ├── api/              # Axios configuration
│   ├── assets/           # Static assets
│   ├── components/       # React components
│   │   ├── admin/        # Admin panel components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Shared components
│   │   └── portfolio/    # Portfolio display components
│   ├── context/          # React contexts
│   ├── data/             # Initial data
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library files
│   ├── services/         # API service files
│   ├── types.ts          # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── ...
```

### Admin Frontend Structure

**Location:** `/admin-frontend/`

**Status:** Separate admin frontend application
**Structure:**
```
admin-frontend/
├── src/
├── dist/
├── package.json
├── vite.config.ts
└── ...
```

**Note:** This appears to be a separate admin frontend that may be redundant with the admin components in the main frontend.

### Documentation Structure

**Location:** `/docs/`

**Total Markdown Files:** 47 (root) + docs/ subdirectory

**Documentation Categories:**
- Phase 2A audit reports (4 files at root)
- Phase 2B audit reports (14 files in docs/verification/ and docs/security/)
- Architecture documentation
- Security documentation
- Deployment documentation
- Implementation reports
- Audit reports (multiple phases)

### Git Status

**Branch:** integrate-phase27

**Staged Changes:** 10 files
**Unstaged Changes:** 25 files
**Untracked Files:** 30+ files

**Notable Untracked Files:**
- Phase 2A audit reports (4 files)
- Phase 2B audit reports (14 files in docs/)
- New migrations
- New test files
- New service files
- New components

## Key Findings

### Backend Apps

**Installed in INSTALLED_APPS:** 35 apps (from settings.py)
**Referenced in URLs:** 29 apps (from api/v1/urls.py)

**Suspected Orphaned Apps:**
1. `apps/api/` - Empty models.py and views.py, not in INSTALLED_APPS
2. `apps/common/` - Empty models.py and views.py, not in INSTALLED_APPS
3. `apps/authentication/` - Only has urls.py, not in INSTALLED_APPS
4. `apps/media/` - Empty directory (0 items), but has files in gitignore

**Apps in INSTALLED_APPS but not in URLs:**
- apps.notifications
- apps.audit_logs
- apps.project_gallery
- apps.project_images
- apps.project_videos
- apps.project_features
- apps.project_technologies

**Apps in URLs but not in INSTALLED_APPS:**
- None (all URL-referenced apps are in INSTALLED_APPS)

### Frontend Files

**Total Components:** 40+
**Total Services:** 24

**Component Categories:**
- Admin components: 13
- Auth components: 3
- Common components: 13
- Portfolio components: 11

**Service Files:** 24 services for all CMS entities

### Documentation

**Total Markdown Files:** 47

**Categories:**
- Phase reports: 18
- Audit reports: 8
- Architecture docs: 5
- Security docs: 3
- Deployment docs: 2
- Implementation docs: 3
- Other: 8

### Generated/Temporary Files

**Ignored by Git:**
- __pycache__/
- node_modules/
- dist/
- build/
- *.log
- .env
- media/
- staticfiles/
- db.sqlite3

**Potentially Tracked Generated Files:**
- .DS_Store (tracked at root)
- admin-frontend/.DS_Store (tracked)

## Next Steps

1. Complete duplicate app detection
2. Complete frontend file audit
3. Complete mock data audit
4. Complete configuration audit
5. Complete migration audit
6. Complete documentation audit
7. Create cleanup plan
