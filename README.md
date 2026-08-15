# Enterprise Portfolio CMS

A production-ready, enterprise-grade Portfolio Content Management System built with Django 5, Django REST Framework, PostgreSQL, Redis, Celery, and Docker. Designed for professional software engineers to manage their portfolio content through a powerful admin panel and RESTful APIs.

## Features

### Core Features
- **JWT Authentication** with role-based access control (RBAC)
- **Soft Delete** functionality for data recovery
- **Audit Logging** for complete compliance tracking
- **API Versioning** with OpenAPI/Swagger/ReDoc documentation
- **Redis Caching** for optimal performance
- **Celery** for background task processing
- **Docker** containerization for easy deployment
- **Nginx** reverse proxy with SSL support

### Portfolio Modules
- **Hero Section** - Fully customizable hero with typing animation
- **About Section** - Bio, mission, vision, highlights
- **Tech Stack** - Dynamic technology categories and items
- **Skills** - Skill categories with proficiency levels
- **Projects** - Comprehensive project management with galleries, videos, features
- **Experience** - Work experience with achievements
- **Education** - Academic background
- **Certifications** - Professional certifications
- **Services** - Service offerings
- **Clients** - Client information and reviews
- **Testimonials** - Client testimonials
- **Blog CMS** - Markdown blog with rich editor
- **Contact** - Contact form with spam detection
- **Resume** - Resume management with download tracking
- **Social Links** - All social media platforms
- **SEO** - Complete SEO optimization with schema.org
- **Analytics** - Visitor tracking and statistics
- **Newsletter** - Email subscription management
- **Timeline** - Career timeline
- **FAQs** - Frequently asked questions
- **Achievements** - Awards and achievements
- **Media Manager** - File management with compression
- **Search** - Global search functionality
- **Dashboard** - Analytics dashboard with charts

## Technology Stack

### Backend
- Python 3.11+
- Django 5+
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- Docker
- Gunicorn
- Nginx
- drf-spectacular (OpenAPI/Swagger/ReDoc)
- django-filter
- CORS
- WhiteNoise
- django-environ
- Cloudinary / AWS S3

### Frontend (To be implemented)
- React
- Next.js (optional)
- TailwindCSS
- Axios
- React Query
- Framer Motion
- TypeScript (optional)

## Architecture

The project follows **Clean Architecture** principles with feature-based apps. Every app contains:
- `models.py` - Database models
- `serializers.py` - DRF serializers
- `views.py` - API views
- `permissions.py` - Custom permissions
- `filters.py` - Query filters
- `selectors.py` - Query selectors
- `services.py` - Business logic
- `validators.py` - Custom validators
- `signals.py` - Django signals
- `urls.py` - URL routing
- `admin.py` - Admin configuration
- `tasks.py` - Celery tasks
- `tests/` - Test suite
- `docs/` - Documentation

## Project Structure

```
portfolio_backend/
├── config/              # Django configuration
│   ├── settings.py      # Main settings
│   ├── urls.py          # Main URL routing
│   ├── wsgi.py          # WSGI configuration
│   ├── asgi.py          # ASGI configuration
│   └── celery.py        # Celery configuration
├── core/                # Core functionality
│   ├── models.py        # Base models (BaseModel, SoftDelete, AuditLog)
│   ├── permissions.py   # Custom permissions
│   ├── paginators.py    # Custom paginators
│   ├── filters.py       # Common filters
│   ├── serializers.py   # Common serializers
│   ├── middleware.py    # Custom middleware
│   └── exceptions.py    # Custom exceptions
├── apps/                # Feature-based apps
│   ├── accounts/        # User authentication & management
│   ├── hero/           # Hero section
│   ├── about/          # About section
│   ├── skills/         # Skills management
│   ├── techstack/      # Technology stack
│   ├── projects/       # Projects (main)
│   ├── project_categories/
│   ├── project_images/
│   ├── project_gallery/
│   ├── project_videos/
│   ├── project_features/
│   ├── project_technologies/
│   ├── experience/     # Work experience
│   ├── education/      # Education
│   ├── certifications/  # Certifications
│   ├── services/       # Services
│   ├── clients/        # Clients
│   ├── testimonials/   # Testimonials
│   ├── blogs/          # Blog CMS
│   ├── contact/        # Contact form
│   ├── resume/         # Resume management
│   ├── socials/        # Social links
│   ├── seo/            # SEO settings
│   ├── analytics/      # Analytics
│   ├── newsletter/     # Newsletter
│   ├── timeline/       # Timeline
│   ├── faqs/           # FAQs
│   ├── achievements/    # Achievements
│   ├── media/          # Media manager
│   ├── audit_logs/     # Audit logs
│   ├── dashboard/      # Admin dashboard
│   ├── search/         # Global search
│   └── settings/       # App settings
├── api/                # API configuration
│   └── v1/             # API v1 endpoints
├── common/             # Common utilities
├── manage.py           # Django management script
├── requirements.txt     # Python dependencies
├── Dockerfile          # Docker configuration
├── gunicorn.conf.py    # Gunicorn configuration
└── .env.example        # Environment variables template
```

## Installation

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional but recommended)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd portfolio_backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run database migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Run development server**
```bash
python manage.py runserver
```

### Docker Setup

1. **Build and start containers**
```bash
docker-compose up -d
```

2. **Run migrations**
```bash
docker-compose exec backend python manage.py migrate
```

3. **Create superuser**
```bash
docker-compose exec backend python manage.py createsuperuser
```

4. **Access the application**
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin
- API Docs (Swagger): http://localhost:8000/api/docs/
- API Docs (ReDoc): http://localhost:8000/api/redoc/

## User Roles

The system supports role-based access control:

- **Super Admin** - Full system access, can manage all users
- **Admin** - Can manage content and users (except super admins)
- **Editor** - Can create, edit, and publish content
- **Content Manager** - Can manage content (no publishing)
- **Viewer** - Read-only access to published content

## API Endpoints

### Authentication
- `POST /api/v1/auth/login/` - Login and get JWT tokens
- `POST /api/v1/auth/register/` - Register new user
- `POST /api/v1/auth/logout/` - Logout (blacklist token)
- `POST /api/v1/auth/refresh/` - Refresh access token

### Projects
- `GET /api/v1/projects/` - List all projects
- `POST /api/v1/projects/` - Create new project
- `GET /api/v1/projects/{slug}/` - Get project details
- `PUT /api/v1/projects/{slug}/` - Update project
- `DELETE /api/v1/projects/{slug}/` - Delete project
- `POST /api/v1/projects/{slug}/like/` - Like project
- `POST /api/v1/projects/{slug}/share/` - Share project
- `POST /api/v1/projects/{slug}/publish/` - Publish project

### Project Categories
- `GET /api/v1/projects/categories/` - List categories
- `POST /api/v1/projects/categories/` - Create category
- `GET /api/v1/projects/categories/{slug}/` - Get category
- `PUT /api/v1/projects/categories/{slug}/` - Update category
- `DELETE /api/v1/projects/categories/{slug}/` - Delete category

### Users
- `GET /api/v1/users/` - List all users (admin only)
- `GET /api/v1/users/me/` - Get current user
- `PUT /api/v1/users/me/` - Update current user
- `POST /api/v1/users/me/change-password/` - Change password
- `GET /api/v1/users/me/profile/` - Get user profile
- `PUT /api/v1/users/me/profile/` - Update user profile

## Admin Panel

Access the admin panel at `/admin/` with your superuser credentials.

The admin panel includes:
- User management with role assignment
- Content management for all modules
- Audit log viewing
- Analytics dashboard
- Media management
- SEO settings

## Celery Tasks

Celery is configured for background task processing:

### Available Tasks
- Email sending (verification, password reset, welcome)
- Login log cleanup
- Account unlock
- Analytics aggregation

### Running Celery
```bash
# Start Celery worker
celery -A config worker -l info

# Start Celery beat (scheduled tasks)
celery -A config beat -l info
```

## Testing

Run the test suite:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=.
```

## Deployment

### Production Deployment

1. **Set environment variables**
```bash
DEBUG=False
SECRET_KEY=<your-secret-key>
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

2. **Build Docker images**
```bash
docker-compose -f docker-compose.yml build
```

3. **Start production containers**
```bash
docker-compose -f docker-compose.yml up -d
```

4. **Run production commands**
```bash
docker-compose exec backend python manage.py collectstatic --noinput
docker-compose exec backend python manage.py migrate
```

### Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Backup database regularly

### Performance Checklist

- [ ] Enable Redis caching
- [ ] Configure database connection pooling
- [ ] Use select_related/prefetch_related
- [ ] Optimize database queries
- [ ] Enable CDN for static files
- [ ] Configure Gunicorn workers
- [ ] Enable Nginx caching
- [ ] Monitor performance metrics
- [ ] Use database indexes
- [ ] Implement pagination

## Monitoring

### Health Check
```bash
curl http://localhost:8000/health/
```

### Logs
- Application logs: `/app/logs/django.log`
- Nginx logs: `/var/log/nginx/`

### Metrics
- API response times
- Database query performance
- Cache hit rates
- Error rates
- User activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

Built with enterprise-grade technologies and following best practices from companies like Stripe, GitLab, Atlassian, Netflix, and Microsoft.
