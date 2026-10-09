"""
Assistant Views

Three thin API endpoints backed by context_builder + intent_router:
  GET  /api/v1/assistant/context/   — public portfolio context snapshot
  POST /api/v1/assistant/query/     — deterministic Q&A
  POST /api/v1/assistant/feedback/  — optional rating (logged, not stored)
"""
from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .context_builder import build_assistant_context
from .intent_router import route
from .serializers import (
    AssistantContextResponseSerializer,
    AssistantFeedbackInputSerializer,
    AssistantQueryInputSerializer,
    AssistantQueryResponseSerializer,
)

logger = logging.getLogger(__name__)


class AssistantQueryThrottle(AnonRateThrottle):
    """30 queries / minute per anonymous IP — isolated scope."""
    scope = 'assistant_anon'
    rate = '30/min'



class AssistantContextView(APIView):
    """
    GET /api/v1/assistant/context/

    Returns a public snapshot of portfolio data used by the assistant.
    This endpoint is intentionally public — it only exposes the same
    data that is already served by other public portfolio endpoints.
    """
    permission_classes = [AllowAny]
    throttle_classes = [AssistantQueryThrottle]

    def get(self, request: Request) -> Response:
        ctx = build_assistant_context()
        serializer = AssistantContextResponseSerializer(ctx)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssistantQueryView(APIView):
    """
    POST /api/v1/assistant/query/

    Body: { "query": "<user question>" }
    Returns: intent, answer, confidence, suggested_actions, data_source
    """
    permission_classes = [AllowAny]
    throttle_classes = [AssistantQueryThrottle]

    def post(self, request: Request) -> Response:
        in_serializer = AssistantQueryInputSerializer(data=request.data)
        if not in_serializer.is_valid():
            return Response(in_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        query: str = in_serializer.validated_data['query']

        try:
            ctx = build_assistant_context()
        except Exception:
            logger.exception('context_builder failed — using empty context')
            ctx = {}

        result = route(query, ctx)

        out_serializer = AssistantQueryResponseSerializer({
            'intent': result.intent,
            'answer': result.answer,
            'confidence': result.confidence,
            'suggested_actions': [
                {
                    'label': a.label,
                    'action_type': a.action_type,
                    'target': a.target,
                }
                for a in result.suggested_actions
            ],
            'data_source': result.data_source,
        })
        return Response(out_serializer.data, status=status.HTTP_200_OK)


class AssistantFeedbackView(APIView):
    """
    POST /api/v1/assistant/feedback/

    Body: { "query": "...", "intent": "...", "rating": "helpful|not_helpful", "comment": "..." }
    Feedback is logged — no persistent storage required for MVP.
    """
    permission_classes = [AllowAny]
    throttle_classes = [AssistantQueryThrottle]

    def post(self, request: Request) -> Response:
        in_serializer = AssistantFeedbackInputSerializer(data=request.data)
        if not in_serializer.is_valid():
            return Response(in_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = in_serializer.validated_data
        logger.info(
            'assistant_feedback intent=%s rating=%s query=%r comment=%r',
            data['intent'],
            data['rating'],
            data['query'][:80],
            data.get('comment', '')[:200],
        )
        return Response({'status': 'received'}, status=status.HTTP_200_OK)
