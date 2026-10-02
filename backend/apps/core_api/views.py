"""
Core API views for system health monitoring and root API information.
"""
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthCheckView(APIView):
    """
    Health check endpoint for container orchestrators, load balancers, and uptime monitors.
    Returns HTTP 200 with {"status": "ok"}.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return Response(
            {"status": "ok"},
            status=status.HTTP_200_OK,
            content_type="application/json"
        )
