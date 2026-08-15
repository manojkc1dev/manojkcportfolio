"""
Custom throttling classes for API rate limiting.
"""
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class BurstRateThrottle(AnonRateThrottle):
    """
    Burst rate limiting for anonymous users (short-term burst).
    """
    scope = 'burst'
    rate = '100/min'


class SustainedRateThrottle(AnonRateThrottle):
    """
    Sustained rate limiting for anonymous users (long-term).
    """
    scope = 'sustained'
    rate = '1000/hour'


class AuthenticatedBurstRateThrottle(UserRateThrottle):
    """
    Burst rate limiting for authenticated users.
    """
    scope = 'auth_burst'
    rate = '200/min'


class AuthenticatedSustainedRateThrottle(UserRateThrottle):
    """
    Sustained rate limiting for authenticated users.
    """
    scope = 'auth_sustained'
    rate = '2000/hour'


class AdminRateThrottle(UserRateThrottle):
    """
    Rate limiting for admin users (higher limits).
    """
    scope = 'admin'
    rate = '1000/min'


class StrictRateThrottle(AnonRateThrottle):
    """
    Strict rate limiting for sensitive endpoints (login, registration).
    """
    scope = 'strict'
    rate = '5/min'
