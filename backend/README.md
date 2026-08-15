# Enterprise Portfolio CMS

A comprehensive, enterprise-grade Portfolio Content Management System built with Django and Django REST Framework.

## Features

- **Multi-App Architecture**: Modular structure with 22+ apps for different content types
- **Role-Based Access Control**: Content manager and public user roles
- **Comprehensive Admin Panel**: Full Django admin with custom configurations
- **RESTful API**: Complete REST API with DRF
- **API Documentation**: Swagger/ReDoc documentation with drf-spectacular
- **SEO Optimization**: Built-in SEO settings and meta tags
- **Media Management**: Cloudinary and AWS S3 integration
- **Email Integration**: Transactional email support
- **Analytics**: Built-in analytics tracking
- **Newsletter**: Newsletter subscription management
- **Search**: Search query tracking
- **Background Tasks**: Celery integration for async tasks
- **Testing**: Comprehensive test suite
- **Security**: JWT authentication, CORS, rate limiting

## Tech Stack

- **Backend**: Django 5.0+, Django REST Framework
- **Database**: PostgreSQL
- **Cache**: Redis
- **Task Queue**: Celery
- **File Storage**: Cloudinary, AWS S3
- **API Documentation**: drf-spectacular (Swagger/ReDoc)
- **Testing**: pytest, pytest-django
- **Code Quality**: black, flake8, isort, pylint, mypy

## Project Structure

```
portfolio_backend/
├── config/                 # Project configuration
│   ├── settings.py         # Django settings
│   ├── urls.py             # URL configuration
│   ├── wsgi.py             # WSGI configuration
│   └── asgi.py             # ASGI configuration
├── core/                   # Core functionality
│   ├── models.py           # Base models
│   ├── permissions.py      # Custom permissions
│   ├── exceptions.py       # Custom exceptions
│   ├── schema.py           # API schema extensions
│   └── utils.py            # Utility functions
├── apps/                   # Django apps
│   ├── accounts/           # User management
│   ├── hero/               # Hero section
│   ├── about/              # About section
│   ├── skills/             # Skills management
│   ├── techstack/          # Tech stack
│   ├── experience/         # Work experience
│   ├── education/          # Education history
│   ├── certifications/     # Certifications
│   ├── projects/           # Projects
│   ├── project_categories/ # Project categories
│   ├── project_images/     # Project images
│   ├── project_gallery/    # Project gallery
│   ├── project_videos/     # Project videos
│   ├── project_features/   # Project features
│   ├── project_technologies/ # Project technologies
│   ├── achievements/       # Achievements
│   ├── blogs/             # Blog posts
│   ├── contact/           # Contact form
│   ├── resume/            # Resume management
│   ├── socials/           # Social links
│   ├── seo/              # SEO settings
│   ├── analytics/        # Analytics
│   ├── newsletter/       # Newsletter
│   ├── timeline/         # Timeline
│   ├── testimonials/     # Testimonials
│   ├── faqs/             # FAQs
│   ├── clients/          # Clients
│   ├── services/         # Services
│   ├── media/            # Media management
│   ├── dashboard/        # Dashboard
│   └── search/           # Search
├── api/                   # API configuration
│   └── v1/               # API v1 endpoints
├── requirements.txt       # Python dependencies
├── .env.example         # Environment variables template
└── README.md            # This file
```

## Installation

### Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Redis 7+
- Node.js 18+ (for frontend)

### Setup

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

5. **Run migrations**
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

## Environment Variables

Create a `.env` file with the following variables:

```env
DEBUG=False
ALLOWED_HOSTS=['localhost', '127.0.0.1', 'yourdomain.com']
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_cms
REDIS_URL=redis://localhost:6379/0

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Sentry (optional)
SENTRY_DSN=your-sentry-dsn

# Analytics
GOOGLE_ANALYTICS_ID=your-ga-id
```

## API Documentation

Once the server is running, access the API documentation:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## API Endpoints

### Authentication
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/logout/` - User logout
- `POST /api/v1/auth/refresh/` - Refresh access token

### Hero
- `GET /api/v1/hero/` - List hero sections
- `POST /api/v1/hero/` - Create hero section
- `GET /api/v1/hero/{id}/` - Retrieve hero section
- `PUT /api/v1/hero/{id}/` - Update hero section
- `DELETE /api/v1/hero/{id}/` - Delete hero section

### Projects
- `GET /api/v1/projects/` - List projects
- `POST /api/v1/projects/` - Create project
- `GET /api/v1/projects/{slug}/` - Retrieve project
- `PUT /api/v1/projects/{slug}/` - Update project
- `DELETE /api/v1/projects/{slug}/` - Delete project

### Blogs
- `GET /api/v1/blogs/` - List blogs
- `POST /api/v1/blogs/` - Create blog
- `GET /api/v1/blogs/{slug}/` - Retrieve blog
- `PUT /api/v1/blogs/{slug}/` - Update blog
- `DELETE /api/v1/blogs/{slug}/` - Delete blog
- `GET /api/v1/blogs/categories/` - List blog categories
- `GET /api/v1/blogs/tags/` - List blog tags

### Contact
- `GET /api/v1/contact/` - List contact submissions
- `POST /api/v1/contact/` - Submit contact form
- `GET /api/v1/contact/{id}/` - Retrieve contact submission
- `PUT /api/v1/contact/{id}/` - Update contact submission
- `DELETE /api/v1/contact/{id}/` - Delete contact submission

### Skills
- `GET /api/v1/skills/` - List skills
- `POST /api/v1/skills/` - Create skill
- `GET /api/v1/skills/{slug}/` - Retrieve skill
- `PUT /api/v1/skills/{slug}/` - Update skill
- `DELETE /api/v1/skills/{slug}/` - Delete skill
- `GET /api/v1/skills/categories/` - List skill categories

### Experience
- `GET /api/v1/experience/` - List experience
- `POST /api/v1/experience/` - Create experience
- `GET /api/v1/experience/{id}/` - Retrieve experience
- `PUT /api/v1/experience/{id}/` - Update experience
- `DELETE /api/v1/experience/{id}/` - Delete experience

### Education
- `GET /api/v1/education/` - List education
- `POST /api/v1/education/` - Create education
- `GET /api/v1/education/{id}/` - Retrieve education
- `PUT /api/v1/education/{id}/` - Update education
- `DELETE /api/v1/education/{id}/` - Delete education

### Services
- `GET /api/v1/services/` - List services
- `POST /api/v1/services/` - Create service
- `GET /api/v1/services/{slug}/` - Retrieve service
- `PUT /api/v1/services/{slug}/` - Update service
- `DELETE /api/v1/services/{slug}/` - Delete service

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=apps --cov-report=html

# Run specific app tests
pytest apps/hero/tests.py

# Run with verbose output
pytest -v
```

## Code Quality

```bash
# Format code
black .

# Sort imports
isort .

# Lint code
flake8 .

# Type checking
mypy .

# Full linting
pylint apps/
```

## Deployment

### Production Setup

1. **Set environment variables**
```bash
export DEBUG=False
export SECRET_KEY=your-production-secret
export DATABASE_URL=postgresql://user:password@production-db:5432/portfolio_cms
```

2. **Collect static files**
```bash
python manage.py collectstatic --noinput
```

3. **Run migrations**
```bash
python manage.py migrate --noinput
```

4. **Start Gunicorn**
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

5. **Start Celery worker**
```bash
celery -A config worker -l info
```

6. **Start Celery beat**
```bash
celery -A config beat -l info
```

### Docker Deployment

```bash
# Build image
docker build -t portfolio-cms .

# Run container
docker run -p 8000:8000 portfolio-cms
```

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable CSRF protection
- [ ] Configure secure cookie settings
- [ ] Set up monitoring with Sentry
- [ ] Regular security updates
- [ ] Implement IP whitelisting
- [ ] Configure firewall rules

## Performance Checklist

- [ ] Enable database connection pooling
- [ ] Configure Redis caching
- [ ] Implement query optimization
- [ ] Use select_related/prefetch_related
- [ ] Enable database indexing
- [ ] Configure CDN for static files
- [ ] Implement pagination
- [ ] Use compression middleware
- [ ] Enable GZIP compression
- [ ] Configure lazy loading
- [ ] Monitor query performance
- [ ] Use background tasks for heavy operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Run tests and linting
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or open an issue in the repository.
