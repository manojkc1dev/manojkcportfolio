"""
Gunicorn production configuration for Manoj KC Portfolio Django REST backend.
Configurable via environment variables for compatibility with Render, DigitalOcean,
Cloud VPS, and Docker container environments.
"""
import multiprocessing
import os

# ---------------------------------------------------------------------------
# Server Socket & Binding
# ---------------------------------------------------------------------------
# Render, Heroku, and Cloud Run pass the bound port in $PORT
_host = os.getenv("GUNICORN_HOST", "0.0.0.0")
_port = os.getenv("PORT", os.getenv("GUNICORN_PORT", "8000"))
bind = f"{_host}:{_port}"
backlog = int(os.getenv("GUNICORN_BACKLOG", "2048"))

# ---------------------------------------------------------------------------
# Worker Processes & Concurrency
# ---------------------------------------------------------------------------
# Default to 3 workers for standard container / 512MB-1GB RAM instances.
# Can be scaled via GUNICORN_WORKERS environment variable.
_cpu_count = multiprocessing.cpu_count()
_default_workers = min(max(_cpu_count * 2, 2), 4)
workers = int(os.getenv("GUNICORN_WORKERS", str(_default_workers)))
threads = int(os.getenv("GUNICORN_THREADS", "2"))
worker_class = os.getenv("GUNICORN_WORKER_CLASS", "gthread")

# Shared memory directory for worker heartbeats (improves stability in Docker/PaaS)
if os.path.exists("/dev/shm"):
    worker_tmp_dir = "/dev/shm"

# ---------------------------------------------------------------------------
# Timeouts & Keep-Alive
# ---------------------------------------------------------------------------
timeout = int(os.getenv("GUNICORN_TIMEOUT", "60"))
graceful_timeout = int(os.getenv("GUNICORN_GRACEFUL_TIMEOUT", "30"))
keepalive = int(os.getenv("GUNICORN_KEEPALIVE", "2"))

# ---------------------------------------------------------------------------
# Process Recycling (Memory Management)
# ---------------------------------------------------------------------------
# Restart workers after serving a given number of requests to guard against
# memory fragmentation / slow memory leaks over extended uptimes.
max_requests = int(os.getenv("GUNICORN_MAX_REQUESTS", "1000"))
max_requests_jitter = int(os.getenv("GUNICORN_MAX_REQUESTS_JITTER", "100"))

# ---------------------------------------------------------------------------
# Logging & Observability
# ---------------------------------------------------------------------------
# Log directly to standard output / error for container & platform log collectors
accesslog = os.getenv("GUNICORN_ACCESSLOG", "-")
errorlog = os.getenv("GUNICORN_ERRORLOG", "-")
loglevel = os.getenv("GUNICORN_LOGLEVEL", "info")
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(L)ss'

# ---------------------------------------------------------------------------
# Security & Request Limits
# ---------------------------------------------------------------------------
# Guard against oversized HTTP headers and malformed requests
limit_request_line = int(os.getenv("GUNICORN_LIMIT_REQUEST_LINE", "4094"))
limit_request_fields = int(os.getenv("GUNICORN_LIMIT_REQUEST_FIELDS", "100"))
limit_request_field_size = int(os.getenv("GUNICORN_LIMIT_REQUEST_FIELD_SIZE", "8190"))

# ---------------------------------------------------------------------------
# Process Lifecycle Hooks
# ---------------------------------------------------------------------------
def on_starting(server):
    """Log startup information before workers are spawned."""
    server.log.info("Starting Gunicorn WSGI server on %s with %s workers (%s threads)", bind, workers, threads)


def when_ready(server):
    """Log readiness confirmation."""
    server.log.info("Gunicorn WSGI server is ready. Accepting incoming connections.")


def worker_int(worker):
    """Log worker termination signal."""
    worker.log.info("Worker terminated by INT/QUIT signal (pid: %s)", worker.pid)
