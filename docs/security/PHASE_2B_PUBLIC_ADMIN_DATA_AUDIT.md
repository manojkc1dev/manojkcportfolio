# Phase 2B - Public vs Admin Data Access Audit

## Audit Date: August 31, 2026

## Data Classification

### Public Data (Accessible without authentication)
Data that should be visible to all visitors on the public portfolio:

| Entity | Public Fields | Access Method | Status |
|--------|---------------|---------------|--------|
| Hero | name, title, subtitle, typingTexts, avatarUrl, emailUrl, resumeUrl | GET /api/v1/hero/ | ✅ PASS |
| About | name, title, bio, skills, interests, location, email, phone | GET /api/v1/about/ | ✅ PASS |
| TechStack | name, category, icon, proficiency | GET /api/v1/tech-stack/ | ✅ PASS |
| Skills | name, category, proficiency | GET /api/v1/skills/ | ✅ PASS |
| Projects | title, description, thumbnail, coverImage, githubUrl, liveDemoUrl, technologies, status (published only) | GET /api/v1/projects/ | ✅ PASS |
| Experience | position, company, startDate, endDate, description, technologies | GET /api/v1/experience/ | ✅ PASS |
| Education | degree, institution, startDate, endDate, description, gpa | GET /api/v1/education/ | ✅ PASS |
| Certifications | title, issuer, date, credentialId, credentialUrl | GET /api/v1/certifications/ | ✅ PASS |
| Blogs | title, slug, excerpt, content, publishedAt, author, tags, categories | GET /api/v1/blog/ | ✅ PASS |
| Socials | platform, url, icon | GET /api/v1/socials/ | ✅ PASS |
| Resume | pdfUrl, docxUrl, downloadsCount | GET /api/v1/resume/ | ✅ PASS |
| Services | title, description, icon, pricing | GET /api/v1/services/ | ✅ PASS |
| Clients | name, logo, website, industry, review | GET /api/v1/clients/ | ✅ PASS |
| Testimonials | clientName, clientLogo, testimonial, rating, date | GET /api/v1/testimonials/ | ✅ PASS |

### Admin-Only Data (Requires authentication)
Data that should only be accessible to authenticated users:

| Entity | Admin-Only Fields | Access Method | Status |
|--------|------------------|---------------|--------|
| Contact Messages | All fields (name, email, phone, subject, message, ip, country, browser, device, status, starred) | GET /api/v1/contact/ | ✅ PASS |
| Newsletter Subscribers | All fields (email, subscribedAt, status, source) | GET /api/v1/newsletter/ | ✅ PASS |
| Analytics | All fields (visitor data, session data, geographic data) | GET /api/v1/analytics/ | ✅ PASS |
| Media Files | All fields (name, url, fileType, fileSize, uploadedAt, uploadedBy) | GET /api/v1/media/ | ✅ PASS |
| Audit Logs | All fields (userEmail, userRole, action, module, details, ipAddress, timestamp) | GET /api/v1/audit-logs/ | ✅ PASS |
| SEO Config | All fields (title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard) | GET /api/v1/seo/ | ✅ PASS |
| Dashboard Analytics | All fields (aggregated statistics) | GET /api/v1/dashboard/analytics/ | ✅ PASS |
| User Management | All user data (email, username, role, isActive, dateJoined) | GET /api/v1/auth/users/ | ✅ PASS |
| Settings | All system settings | GET /api/v1/settings/ | ✅ PASS |

### Draft/Unpublished Content
Content that should not be publicly accessible:

| Entity | Draft Status | Public Access | Status |
|--------|--------------|---------------|--------|
| Projects | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |
| Blogs | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |
| About | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |
| Hero | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |
| Certifications | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |
| Experience | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |
| Education | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |
| Services | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |
| Clients | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |
| Testimonials | status='draft' | ❌ Should not be accessible | ⚠️ PARTIAL - List views filtered, detail views not filtered |

## Access Control Verification

### Public Endpoints Test

| Endpoint | Unauthenticated GET | Expected | Actual | Status |
|----------|---------------------|----------|--------|--------|
| /api/v1/hero/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/about/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/tech-stack/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/skills/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/projects/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/experience/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/education/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/certifications/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/blog/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/socials/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/resume/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/services/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/clients/ | ✅ 200 | 200 | 200 | ✅ PASS |
| /api/v1/testimonials/ | ✅ 200 | 200 | 200 | ✅ PASS |

### Admin-Only Endpoints Test

| Endpoint | Unauthenticated GET | Expected | Actual | Status |
|----------|---------------------|----------|--------|--------|
| /api/v1/contact/ | ❌ 401 | 401 | 401 | ✅ PASS |
| /api/v1/newsletter/ | ❌ 401 | 401 | 401 | ✅ PASS |
| /api/v1/analytics/ | ❌ 401 | 401 | 401 | ✅ PASS |
| /api/v1/media/ | ❌ 401 | 401 | 401 | ✅ PASS |
| /api/v1/audit-logs/ | ❌ 401 | 401 | 401 | ✅ PASS |
| /api/v1/seo/ | ❌ 401 | 401 | 401 | ✅ PASS |
| /api/v1/dashboard/analytics/ | ❌ 401 | 401 | 401 | ✅ PASS |
| /api/v1/auth/users/ | ❌ 401 | 401 | 401 | ✅ PASS |
| /api/v1/settings/ | ❌ 401 | 401 | 401 | ✅ PASS |

### Draft Content Access Test

| Test Case | Method | Unauthenticated | Expected | Actual | Status |
|----------|--------|-----------------|----------|--------|--------|
| GET /api/v1/projects/ (list) | GET | ✅ 200 (filtered) | 200 (published only) | 200 (filtered) | ✅ PASS |
| GET /api/v1/projects/{draft_id}/ (detail) | GET | ⚠️ 200 (unfiltered) | 403/404 | 200 (unfiltered) | ❌ FAIL |
| GET /api/v1/blog/ (list) | GET | ✅ 200 (filtered) | 200 (published only) | 200 (filtered) | ✅ PASS |
| GET /api/v1/blog/{draft_slug}/ (detail) | GET | ⚠️ 200 (unfiltered) | 403/404 | 200 (unfiltered) | ❌ FAIL |

## ID Manipulation Tests

### Test: Accessing Admin Data via ID Manipulation

| Test Case | Method | Unauthenticated | Expected | Actual | Status |
|----------|--------|-----------------|----------|--------|--------|
| GET /api/v1/contact/{id}/ | GET | ❌ 401 | 401 | 401 | ✅ PASS |
| GET /api/v1/newsletter/{id}/ | GET | ❌ 401 | 401 | 401 | ✅ PASS |
| GET /api/v1/analytics/{id}/ | GET | ❌ 401 | 401 | 401 | ✅ PASS |
| GET /api/v1/media/{id}/ | GET | ❌ 401 | 401 | 401 | ✅ PASS |
| GET /api/v1/audit-logs/{id}/ | GET | ❌ 401 | 401 | 401 | ✅ PASS |
| GET /api/v1/seo/{id}/ | GET | ❌ 401 | 401 | 401 | ✅ PASS |
| GET /api/v1/dashboard/analytics/ | GET | ❌ 401 | 401 | 401 | ✅ PASS |
| GET /api/v1/auth/users/{id}/ | GET | ❌ 401 | 401 | 401 | ✅ PASS |
| GET /api/v1/settings/{id}/ | GET | ❌ 401 | 401 | 401 | ✅ PASS |

### Test: Accessing Draft Content via ID Manipulation

| Test Case | Method | Unauthenticated | Expected | Actual | Status |
|----------|--------|-----------------|----------|--------|--------|
| GET /api/v1/projects/{draft_id}/ | GET | ❌ 403/404 | 403/404 | 200 | ❌ FAIL |
| GET /api/v1/blog/{draft_slug}/ | GET | ❌ 403/404 | 403/404 | 200 | ❌ FAIL |
| GET /api/v1/about/{draft_id}/ | GET | ❌ 403/404 | 403/404 | 200 | ❌ FAIL |

## Query Parameter Tests

### Test: Filtering by Status

| Test Case | Query Parameter | Unauthenticated | Expected | Actual | Status |
|----------|-----------------|-----------------|----------|--------|--------|
| GET /api/v1/projects/?status=draft | status=draft | ❌ 403/404 | 403/404 | 200 (filtered by queryset) | ⚠️ PARTIAL |
| GET /api/v1/blog/?status=draft | status=draft | ❌ 403/404 | 403/404 | 200 (filtered by queryset) | ⚠️ PARTIAL |

## Summary

**Public Data Access:** ✅ **PASS**
- All public endpoints are accessible to unauthenticated users
- Public data is correctly exposed via list views
- Queryset filtering works for list views

**Admin Data Access:** ✅ **PASS**
- All admin-only endpoints require authentication
- No admin data is accessible without proper authentication
- ID manipulation cannot bypass authentication requirements

**Draft Content Access:** ❌ **FAIL**
- List views correctly filter draft content for unauthenticated users
- Detail views do NOT filter draft content for unauthenticated users
- Draft content is accessible via direct ID access to detail views

**Critical Issue:** Detail views for CMS entities do not apply queryset filtering for unauthenticated users, allowing draft/unpublished content to be accessed via direct ID manipulation.

**Recommendation:** Apply queryset filtering to detail views or implement object-level permission checks to prevent unauthorized access to draft content.

**Verdict:** Public vs Admin data separation is mostly correct, but draft content exposure via detail views is a security concern that needs to be addressed.
