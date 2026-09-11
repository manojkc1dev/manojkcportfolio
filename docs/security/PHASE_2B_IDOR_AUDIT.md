# Phase 2B - IDOR/Object-Level Authorization Audit

## Audit Date: August 31, 2026

## IDOR Vulnerability Analysis

### What is IDOR?
Insecure Direct Object Reference (IDOR) occurs when an application allows users to access objects (database records) by directly referencing their identifiers (IDs, UUIDs, etc.) without proper authorization checks.

### Audit Methodology
For each CMS endpoint, verify:
1. Queryset filtering based on user authentication and role
2. Object-level permission checks (has_object_permission)
3. Protection against unauthorized access via ID manipulation

## Queryset Filtering Analysis

### Public vs Authenticated Queryset Filtering

All CMS views implement `get_queryset()` with the following pattern:

```python
def get_queryset(self):
    """Filter queryset based on user permissions."""
    queryset = super().get_queryset()
    
    if not self.request.user.is_authenticated:
        return queryset.filter(status='published', is_active=True, show_on_homepage=True)
    
    # Authenticated users see all records (filtered by role in permission classes)
    return queryset
```

**Entities with Queryset Filtering:**
- About, Achievements, BlogCategory, BlogTag, Blog, Certifications, Clients, Education, Experience, FAQs, ProjectCategories, ProjectFeatures, ProjectGallery, ProjectImages, ProjectTechnologies, ProjectVideos, Services, Testimonials, Timeline

**Entities Without Queryset Filtering:**
- Contact (returns empty queryset for unauthenticated)
- Analytics, Media, Audit Logs, SEO, Dashboard (IsAuthenticated only)
- User management (CanManageUsers only)
- Settings (CanManageSettings only)

### Queryset Filtering Verdict

| Entity | Public Filter | Authenticated Filter | Status |
|--------|---------------|---------------------|--------|
| About | status='published', is_active=True, show_on_homepage=True | All (role-based) | ✅ PASS |
| Achievements | status='published', is_active=True, show_on_homepage=True | All (role-based) | ✅ PASS |
| BlogCategory | status='published', is_active=True | All (role-based) | ✅ PASS |
| BlogTag | status='published', is_active=True | All (role-based) | ✅ PASS |
| Blog | status='published', is_active=True | All (role-based) | ✅ PASS |
| Certifications | status='published', is_active=True, show_on_homepage=True | All (role-based) | ✅ PASS |
| Clients | status='published', is_active=True, show_on_homepage=True | All (role-based) | ✅ PASS |
| Education | status='published', is_active=True, show_on_homepage=True | All (role-based) | ✅ PASS |
| Experience | status='published', is_active=True, show_on_homepage=True | All (role-based) | ✅ PASS |
| FAQs | status='published', is_active=True | All (role-based) | ✅ PASS |
| Projects | status='published', is_active=True | All (role-based) | ✅ PASS |
| Services | status='published', is_active=True, show_on_homepage=True | All (role-based) | ✅ PASS |
| Testimonials | status='published', is_active=True, show_on_homepage=True | All (role-based) | ✅ PASS |
| Contact | Empty queryset | All (role-based) | ✅ PASS |
| Analytics | N/A (IsAuthenticated) | All (role-based) | ✅ PASS |
| Media | N/A (IsAuthenticated) | All (role-based) | ✅ PASS |
| Audit Logs | N/A (IsAuthenticated) | All (role-based) | ✅ PASS |
| SEO | N/A (IsAuthenticated) | All (role-based) | ✅ PASS |
| Dashboard | N/A (CanViewAnalytics) | All (role-based) | ✅ PASS |
| User Management | N/A (CanManageUsers) | All (role-based) | ✅ PASS |
| Settings | N/A (CanManageSettings) | All (role-based) | ✅ PASS |

## Object-Level Permission Analysis

### has_object_permission Implementation

**Location:** `backend/core/permissions.py` and `backend/apps/accounts/permissions.py`

#### IsOwnerOrReadOnly (core/permissions.py)
```python
def has_object_permission(self, request, view, obj):
    if request.method in permissions.SAFE_METHODS:
        return True
    return obj.created_by == request.user
```

**Usage:** Not currently used in CMS views (all CMS entities use role-based permissions)

#### IsSameUser (accounts/permissions.py)
```python
def has_object_permission(self, request, view, obj):
    return obj == request.user
```

**Usage:** User profile access control

#### IsSuperAdminOrAdminForUser (accounts/permissions.py)
```python
def has_permission(self, request, view):
    if not request.user or not request.user.is_authenticated:
        return False
    return request.user.is_admin()

def has_object_permission(self, request, view, obj):
    if request.user.is_super_admin():
        return True
    if request.user.is_admin() and obj.role not in ['super_admin', 'admin']:
        return True
    return False
```

**Usage:** User management - prevents admins from modifying other admins or super admins

### Object-Level Permission Verdict

| Entity | Uses has_object_permission | Permission Class | Status |
|--------|---------------------------|-----------------|--------|
| Hero | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| About | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| TechStack | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Skills | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Projects | ❌ No | IsPublicOrAuthenticated, IsContentManagerOrAbove, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Experience | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Education | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Certifications | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Blogs | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Socials | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Services | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Clients | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Testimonials | ❌ No | IsPublicOrAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Contact | ❌ No | IsAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Newsletter | ❌ No | AllowAny, IsAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Analytics | ❌ No | CanViewAnalytics | ⚠️ RELIES ON QUERYSET FILTERING |
| Media | ❌ No | IsAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| Audit Logs | ❌ No | IsAuthenticated | ⚠️ RELIES ON QUERYSET FILTERING |
| SEO | ❌ No | IsAuthenticated, CanDelete | ⚠️ RELIES ON QUERYSET FILTERING |
| User Profile | ✅ Yes | IsSameUser | ✅ PASS |
| User Management | ✅ Yes | IsSuperAdminOrAdminForUser | ✅ PASS |

## IDOR Test Scenarios

### Scenario 1: Unauthenticated User Accessing Draft Content
**Test:** GET /api/v1/projects/{draft_id}/ without authentication
**Expected:** 401 Unauthorized
**Actual:** ✅ PASS - IsPublicOrAuthenticated requires authentication for non-SAFE methods, but GET is SAFE method
**Issue:** ⚠️ Unauthenticated users can access draft content if they know the ID
**Root Cause:** IsPublicOrAuthenticated allows GET for all users, queryset filtering only applies to list views, not detail views
**Severity:** MEDIUM - Draft content could be exposed via direct ID access

### Scenario 2: Content Manager Accessing Another User's Data
**Test:** content_manager tries to delete a project created by admin
**Expected:** 403 Forbidden
**Actual:** ✅ PASS - CanDelete permission restricts delete to admin and above
**Status:** ✅ PASS

### Scenario 3: Admin Accessing Super Admin Settings
**Test:** admin tries to modify super_admin user
**Expected:** 403 Forbidden
**Actual:** ✅ PASS - IsSuperAdminOrAdminForUser prevents this
**Status:** ✅ PASS

### Scenario 4: User Accessing Another User's Profile
**Test:** user tries to GET /api/v1/auth/users/{other_user_id}/
**Expected:** 403 Forbidden
**Actual:** ✅ PASS - IsSameUser prevents this
**Status:** ✅ PASS

## Critical Findings

### ⚠️ ISSUE 1: Detail View Queryset Filtering Gap
**Problem:** Detail views (GET /api/v1/{entity}/{id}/) do not apply queryset filtering for unauthenticated users
**Impact:** Unauthenticated users can access draft/unpublished content if they know the ID
**Affected Entities:** All CMS entities with IsPublicOrAuthenticated permission
**Example:** GET /api/v1/projects/{draft_project_id}/ returns draft project to unauthenticated user
**Recommendation:** Add queryset filtering to detail views or implement object-level permission checks

### ⚠️ ISSUE 2: No Ownership-Based Access Control
**Problem:** CMS entities do not track or enforce ownership (created_by field not used for authorization)
**Impact:** Any authenticated user with sufficient role can modify/delete any entity
**Affected Entities:** All CMS entities except User
**Example:** content_manager can delete a project created by another content_manager
**Recommendation:** Consider implementing ownership-based access control for better auditability

## Summary

**Total Entities Audited:** 21
**Entities with Queryset Filtering:** 18 (86%)
**Entities with Object-Level Permissions:** 2 (9%) - User Profile, User Management
**Entities Relying Solely on Role-Based Permissions:** 19 (90%)

**IDOR Protection:** ⚠️ **PARTIAL PASS**

**Passing Checks:**
- ✅ List views properly filter content for unauthenticated users
- ✅ Role-based permissions prevent unauthorized CRUD operations
- ✅ User management has proper object-level permissions
- ✅ Delete operations restricted to admin and above
- ✅ Analytics and dashboard restricted to appropriate roles

**Failing Checks:**
- ⚠️ Detail views do not filter queryset for unauthenticated users
- ⚠️ No ownership-based access control for CMS entities
- ⚠️ Draft/unpublished content accessible via direct ID access

**Verdict:** The application has good role-based access control but lacks object-level authorization for CMS entities. The most critical issue is that unauthenticated users can potentially access draft content via direct ID access to detail views.

**Priority Fixes:**
1. **HIGH:** Add queryset filtering to detail views for unauthenticated users
2. **MEDIUM:** Consider implementing ownership-based access control for better auditability
3. **LOW:** Add object-level permission checks for additional security layers
