# Deployment Guide

This guide covers deploying the Portfolio CMS application using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Git
- A domain name (for production deployment)

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd manojkcportfolio
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your production values:

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-very-secure-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database (use Docker Compose defaults or external database)
DATABASE_URL=postgresql://portfolio_user:portfolio_password@db:5432/portfolio_cms

# Redis (use Docker Compose defaults or external Redis)
REDIS_URL=redis://redis:6379/0

# Cloudinary (for file storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AWS S3 (alternative file storage)
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password

# Sentry (error tracking)
SENTRY_DSN=your-sentry-dsn

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
POSTHOG_API_KEY=your-posthog-api-key
POSTHOG_HOST=https://app.posthog.com
```

### 3. Configure Frontend Environment

Create `frontend/.env`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## Development Deployment

### Start All Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Django backend API
- React frontend
- Celery worker
- Celery beat scheduler
- Nginx reverse proxy

### Run Database Migrations

```bash
docker-compose exec backend python manage.py migrate
```

### Create Superuser

```bash
docker-compose exec backend python manage.py createsuperuser
```

### Collect Static Files

```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

### Access the Application

- Frontend: http://localhost
- Backend API: http://localhost/api/
- Admin Panel: http://localhost/admin/
- API Documentation: http://localhost/api/docs/

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

## Production Deployment

### 1. Prepare Production Environment

Update `backend/.env` with production values:

```env
DEBUG=False
SECRET_KEY=<generate-a-secure-secret-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

Generate a secure secret key:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2. Configure SSL/HTTPS

For production, use SSL certificates. You can use Let's Encrypt with Certbot:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Update `nginx.conf` to include SSL configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of your configuration
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. Deploy with Docker Compose

```bash
# Build and start services
docker-compose -f docker-compose.yml up -d --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

### 4. Configure Firewall

```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

### 5. Set Up Automatic SSL Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job for renewal
# Verify with: sudo systemctl status certbot.timer
```

## Monitoring and Maintenance

### Health Checks

Check service health:

```bash
# Backend health
curl http://localhost/health/

# Docker health status
docker-compose ps
```

### Database Backups

Create automated backups:

```bash
# Backup database
docker-compose exec db pg_dump -U portfolio_user portfolio_cms > backup.sql

# Restore database
docker-compose exec -T db psql -U portfolio_user portfolio_cms < backup.sql
```

Set up cron job for automated backups:

```bash
# Add to crontab
0 2 * * * cd /path/to/project && docker-compose exec -T db pg_dump -U portfolio_user portfolio_cms > /backups/portfolio_$(date +\%Y\%m\%d).sql
```

### Log Management

View and manage logs:

```bash
# View logs
docker-compose logs -f --tail=100

# Rotate logs (add to docker-compose.yml)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Update Deployment

To update the application:

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs <service-name>

# Check resource usage
docker stats

# Rebuild without cache
docker-compose build --no-cache <service-name>
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Permission Issues

```bash
# Fix media file permissions
docker-compose exec backend chown -R www-data:www-data /app/media
```

### Static Files Not Loading

```bash
# Recollect static files
docker-compose exec backend python manage.py collectstatic --noinput --clear

# Restart nginx
docker-compose restart nginx
```

## Scaling

### Horizontal Scaling

To scale backend services:

```bash
# Scale backend workers
docker-compose up -d --scale backend=3
```

Update nginx upstream configuration for load balancing:

```nginx
upstream backend {
    least_conn;
    server backend:8000;
    server backend:8001;
    server backend:8002;
}
```

### Database Scaling

For high-traffic deployments, consider:
- Using managed database services (AWS RDS, Google Cloud SQL)
- Read replicas for read-heavy workloads
- Connection pooling (PgBouncer)

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong SECRET_KEY
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Enable security headers
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerting
- [ ] Keep dependencies updated
- [ ] Review and audit logs regularly

## Performance Optimization

- Enable Redis caching
- Configure CDN for static files
- Use database connection pooling
- Enable Gzip compression
- Optimize database queries
- Use CDN for media files
- Enable HTTP/2
- Configure proper caching headers

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review documentation in `/docs` folder
- Check GitHub issues
