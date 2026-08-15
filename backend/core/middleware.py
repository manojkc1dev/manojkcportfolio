"""
Custom middleware for Portfolio CMS.
"""
import logging
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import AuditLog

User = get_user_model()
logger = logging.getLogger(__name__)


class AuditLogMiddleware:
    """
    Middleware to log all requests and actions.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Process request
        response = self.get_response(request)

        # Log the request
        self.log_request(request, response)

        return response

    def log_request(self, request, response):
        """Log request details to audit log."""
        try:
            # Only log API requests
            if request.path.startswith('/api/'):
                user = request.user if request.user.is_authenticated else None
                
                # Determine action based on method
                action_map = {
                    'GET': 'view',
                    'POST': 'create',
                    'PUT': 'update',
                    'PATCH': 'update',
                    'DELETE': 'delete',
                }
                action = action_map.get(request.method, 'view')

                AuditLog.objects.create(
                    user=user,
                    action=action,
                    model_name='API',
                    object_repr=f'{request.method} {request.path}',
                    ip_address=self.get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    request_method=request.method,
                    request_path=request.path,
                    extra_data={
                        'status_code': response.status_code,
                        'response_time': getattr(response, 'response_time', None),
                    }
                )
        except Exception as e:
            logger.error(f"Error in AuditLogMiddleware: {e}")

    def get_client_ip(self, request):
        """Get client IP address."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class RequestLogMiddleware:
    """
    Middleware to log all requests for debugging and monitoring.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = timezone.now()

        response = self.get_response(request)

        # Calculate response time
        duration = (timezone.now() - start_time).total_seconds()
        response.response_time = duration

        # Log slow requests
        if duration > 1.0:
            logger.warning(
                f"Slow request: {request.method} {request.path} took {duration:.2f}s"
            )

        return response
