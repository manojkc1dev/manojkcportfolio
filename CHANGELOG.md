# Changelog

All notable changes to the Portfolio CMS project will be documented in this file.

## [1.0.0] - 2024-08-08

### Added

#### Frontend
- Complete API service layer with data transformation (snake_case → camelCase)
- LoadingSpinner component with customizable props
- SkeletonLoader component with multiple variants (text, avatar, card, list)
- LoadingState component for managing loading states
- ErrorBoundary component with fallback UI and development error details
- EmptyState component for empty data scenarios
- Toast notification system with ToastContext
- Toast component with success, error, info, and warning variants
- Retry utility with exponential backoff
- JWT authentication integration with token storage and automatic refresh
- Axios instance with request/response interceptors
- Automatic token refresh on 401 responses

#### Backend
- Enhanced RBAC system with 10+ permission classes:
  - IsViewerOrAbove
  - CanManageUsers
  - CanViewAnalytics
  - CanManageSettings
  - IsAdminOrSuperAdmin
  - IsEditorOrAbove
  - IsContentManagerOrAbove
  - CanPublish
  - CanDelete
  - CanExport
- Custom throttling classes for rate limiting:
  - BurstRateThrottle (100/min)
  - SustainedRateThrottle (1000/hour)
  - AuthenticatedBurstRateThrottle (200/min)
  - AuthenticatedSustainedRateThrottle (2000/hour)
  - AdminRateThrottle (1000/min)
  - StrictRateThrottle (5/min)
- Comprehensive security settings:
  - HSTS with 1-year max-age
  - SSL redirect for production
  - Content Security Policy
  - Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Database optimizations:
  - Composite indexes for common query patterns
  - Foreign key indexes
  - select_related for N+1 query prevention
- Enhanced media serializers with:
  - URL generation for file fields
  - File size validation (max 10MB)
  - File type validation
  - MIME type auto-detection
  - Dedicated MediaUploadView with proper parsers
- OpenAPI schema enhancement with 25+ API tags
- Postman collection export script and setup guide

#### DevOps
- Frontend Dockerfile with multi-stage build
- Updated docker-compose.yml with frontend service
- Enhanced nginx.conf with frontend upstream
- Comprehensive deployment guide (DEPLOYMENT.md)
- Postman setup guide (POSTMAN_SETUP.md)

### Removed

#### Backend
- SaaS-specific apps (10 apps removed):
  - tenants
  - subscriptions
  - usage
  - api_keys
  - rate_limiting
  - domains
  - analytics_saas
  - webhooks
  - white_labeling
  - compliance
- Tenant-related middleware from settings
- Unused dependencies:
  - stripe
  - dnspython

#### Frontend
- Unused dependencies:
  - @google/genai
  - express
  - @types/express

### Changed

#### Backend
- Updated REST Framework throttling configuration to use custom throttling classes
- Enhanced drf-spectacular settings with comprehensive API tags
- Updated INSTALLED_APPS to remove SaaS apps
- Updated MIDDLEWARE to remove tenant middleware
- Enhanced media views with proper parsers and permissions

#### Frontend
- Updated package.json to remove unused dependencies
- Fixed all TypeScript type mismatches across service files
- Enhanced CMSContext with JWT authentication implementation

### Fixed

#### Frontend
- TypeScript type inference issues in all service files
- Type mismatches between backend snake_case and frontend camelCase
- Import errors for ApiResponse type
- AxiosInstance import (changed from named to default import)

#### Backend
- Permission class implementations
- Throttling configuration
- Media serializer validation

### Security

- Added comprehensive rate limiting for all endpoints
- Implemented JWT authentication with automatic token refresh
- Added security headers for production
- Implemented file upload validation
- Added CSP configuration
- Enhanced CSRF protection

### Performance

- Added database indexes for common query patterns
- Implemented select_related to prevent N+1 queries
- Added connection pooling configuration
- Implemented caching with Redis
- Added Gzip compression in Nginx
- Optimized static file serving

### Documentation

- Created comprehensive DEPLOYMENT.md
- Created POSTMAN_SETUP.md
- Created OpenAPI export script
- Enhanced API documentation with drf-spectacular
- Added inline code documentation

---

## [0.1.0] - Initial Release

### Added

- Initial project structure
- Django backend with REST Framework
- React frontend with TypeScript
- Basic CRUD operations for content modules
- User authentication system
- Admin panel
- Docker configuration
