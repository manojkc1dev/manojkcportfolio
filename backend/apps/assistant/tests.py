"""
Tests for the AI Assistant API endpoints.
"""
import json

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from apps.assistant.intent_router import route


class IntentRouterTests(TestCase):
    """Unit tests for deterministic intent classification."""

    def setUp(self):
        self.ctx = {}  # empty context — uses static fallbacks

    def _route(self, query: str):
        return route(query, self.ctx)

    def test_greeting_intent(self):
        result = self._route('hello')
        self.assertEqual(result.intent, 'greeting')
        self.assertGreater(result.confidence, 0)

    def test_tech_stack_intent(self):
        result = self._route('What backend technologies does Manoj specialize in?')
        self.assertEqual(result.intent, 'tech_stack')

    def test_database_intent(self):
        result = self._route('How does Manoj optimize PostgreSQL performance?')
        self.assertEqual(result.intent, 'database_optimization')

    def test_payments_intent(self):
        result = self._route('What payment gateways has Manoj integrated?')
        self.assertEqual(result.intent, 'payments')

    def test_rates_intent(self):
        result = self._route("What are Manoj's freelance rates?")
        self.assertEqual(result.intent, 'rates_hiring')

    def test_contact_intent(self):
        result = self._route('How do I contact Manoj?')
        self.assertEqual(result.intent, 'contact')

    def test_security_intent(self):
        result = self._route('How does Manoj handle authentication and RBAC?')
        self.assertEqual(result.intent, 'security')

    def test_projects_intent(self):
        result = self._route('What projects has Manoj built?')
        self.assertEqual(result.intent, 'projects')

    def test_fallback_on_unknown(self):
        result = self._route('zxq7wk unrecognized gibberish xyz')
        self.assertEqual(result.intent, 'fallback')
        self.assertEqual(result.confidence, 0.0)

    def test_result_has_answer(self):
        result = self._route('hello')
        self.assertIsInstance(result.answer, str)
        self.assertGreater(len(result.answer), 10)

    def test_result_has_suggested_actions(self):
        result = self._route('hello')
        self.assertIsInstance(result.suggested_actions, list)
        self.assertGreater(len(result.suggested_actions), 0)

    def test_namaste_greeting(self):
        result = self._route('Namaste!')
        self.assertEqual(result.intent, 'greeting')


class AssistantContextAPITests(TestCase):
    """Integration tests for GET /api/v1/assistant/context/"""

    def setUp(self):
        self.client = APIClient()

    def test_context_returns_200(self):
        response = self.client.get('/api/v1/assistant/context/')
        self.assertEqual(response.status_code, 200)

    def test_context_is_json(self):
        response = self.client.get('/api/v1/assistant/context/')
        self.assertEqual(response['Content-Type'], 'application/json')


class AssistantQueryAPITests(TestCase):
    """Integration tests for POST /api/v1/assistant/query/"""

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/v1/assistant/query/'

    def test_query_returns_200(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'query': 'hello'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)

    def test_query_response_fields(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'query': 'What is Manoj\'s tech stack?'}),
            content_type='application/json',
        )
        data = response.json()
        self.assertIn('intent', data)
        self.assertIn('answer', data)
        self.assertIn('confidence', data)
        self.assertIn('suggested_actions', data)
        self.assertIn('data_source', data)

    def test_empty_query_returns_400(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'query': ''}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_missing_query_returns_400(self):
        response = self.client.post(
            self.url,
            data=json.dumps({}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_tech_stack_query(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'query': 'What backend technologies does Manoj specialize in?'}),
            content_type='application/json',
        )
        data = response.json()
        self.assertEqual(data['intent'], 'tech_stack')
        self.assertIn('Django', data['answer'])

    def test_greeting_query(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'query': 'hello'}),
            content_type='application/json',
        )
        data = response.json()
        self.assertEqual(data['intent'], 'greeting')

    def test_suggested_actions_structure(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'query': 'hello'}),
            content_type='application/json',
        )
        actions = response.json()['suggested_actions']
        self.assertIsInstance(actions, list)
        for action in actions:
            self.assertIn('label', action)
            self.assertIn('action_type', action)
            self.assertIn('target', action)


class AssistantFeedbackAPITests(TestCase):
    """Integration tests for POST /api/v1/assistant/feedback/"""

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/v1/assistant/feedback/'

    def test_helpful_feedback_returns_200(self):
        response = self.client.post(
            self.url,
            data=json.dumps({
                'query': 'What is Manoj\'s tech stack?',
                'intent': 'tech_stack',
                'rating': 'helpful',
            }),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'received')

    def test_not_helpful_feedback_returns_200(self):
        response = self.client.post(
            self.url,
            data=json.dumps({
                'query': 'Something confusing',
                'intent': 'fallback',
                'rating': 'not_helpful',
                'comment': 'The answer was not relevant.',
            }),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)

    def test_invalid_rating_returns_400(self):
        response = self.client.post(
            self.url,
            data=json.dumps({
                'query': 'Test',
                'intent': 'greeting',
                'rating': 'invalid_value',
            }),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)
