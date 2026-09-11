"""
Custom exception handlers for REST API.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for REST API.
    Provides consistent error response format matching frontend expectations.
    
    Standard format:
    {
        "success": false,
        "message": "Error message",
        "data": null,
        "errors": {}
    }
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Log the error
        logger.error(
            f"API Error: {exc}",
            extra={
                'status_code': response.status_code,
                'view': context['view'].__class__.__name__,
                'request': context['request'],
            }
        )

        # Customize error response format to match standard
        custom_response_data = {
            'success': False,
            'message': str(exc),
            'data': None,
            'errors': response.data if isinstance(response.data, dict) else {'detail': str(response.data)}
        }

        response.data = custom_response_data

    return response


class PortfolioCMSException(Exception):
    """Base exception for Portfolio CMS."""
    pass


class ValidationException(PortfolioCMSException):
    """Exception for validation errors."""
    pass


class NotFoundException(PortfolioCMSException):
    """Exception for resource not found errors."""
    pass


class PermissionException(PortfolioCMSException):
    """Exception for permission errors."""
    pass


class RateLimitException(PortfolioCMSException):
    """Exception for rate limit errors."""
    pass
