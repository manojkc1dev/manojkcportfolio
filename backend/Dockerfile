# ==============================================================================
# Manoj KC Portfolio — Production Backend Container
# Multi-arch compatible, lean Debian slim base, non-root user execution
# ==============================================================================

FROM python:3.12-slim

# Enforce Python environment optimization
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=core.settings.production \
    PORT=8000

# Install required system runtime libraries (curl for healthchecks, libpq for PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root system user and dedicated app directory
RUN groupadd -r -g 1000 appgroup && \
    useradd -r -u 1000 -g appgroup -d /app -s /bin/sh appuser

WORKDIR /app

# Ensure staticfiles and media directories exist with appropriate permissions
RUN mkdir -p /app/staticfiles /app/media && \
    chown -R appuser:appgroup /app

# Install Python dependencies first to take advantage of Docker layer caching
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copy backend source code into container
COPY --chown=appuser:appgroup . /app

# Switch to non-root user for runtime execution
USER appuser

# Document exposed HTTP service port
EXPOSE 8000

# Health check verifies the HTTP liveness probe endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health/ || exit 1

# Start Gunicorn WSGI production server
CMD ["gunicorn", "--config", "gunicorn.conf.py", "core.wsgi:application"]
