"""
Custom schema extensions for API documentation.
"""
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes


def get_common_schemas():
    """Common schema extensions."""
    return {
        'tags': ['Portfolio CMS'],
        'description': 'Enterprise Portfolio CMS API',
    }


def get_auth_schemas():
    """Authentication schema extensions."""
    return {
        'tags': ['Authentication'],
        'description': 'User authentication and authorization endpoints',
    }


def get_hero_schemas():
    """Hero section schema extensions."""
    return {
        'tags': ['Hero'],
        'description': 'Hero section management endpoints',
    }


def get_projects_schemas():
    """Projects schema extensions."""
    return {
        'tags': ['Projects'],
        'description': 'Project management endpoints',
    }


def get_blogs_schemas():
    """Blogs schema extensions."""
    return {
        'tags': ['Blogs'],
        'description': 'Blog content management endpoints',
    }


def get_contact_schemas():
    """Contact schema extensions."""
    return {
        'tags': ['Contact'],
        'description': 'Contact form and communication endpoints',
    }


def get_skills_schemas():
    """Skills schema extensions."""
    return {
        'tags': ['Skills'],
        'description': 'Skills and expertise management endpoints',
    }


def get_experience_schemas():
    """Experience schema extensions."""
    return {
        'tags': ['Experience'],
        'description': 'Work experience management endpoints',
    }


def get_education_schemas():
    """Education schema extensions."""
    return {
        'tags': ['Education'],
        'description': 'Education history management endpoints',
    }


def get_services_schemas():
    """Services schema extensions."""
    return {
        'tags': ['Services'],
        'description': 'Services and offerings management endpoints',
    }


# Common parameters
COMMON_PARAMETERS = [
    OpenApiParameter(
        name='page',
        type=OpenApiTypes.INT,
        location=OpenApiParameter.QUERY,
        description='Page number for pagination',
        required=False,
        default=1,
    ),
    OpenApiParameter(
        name='page_size',
        type=OpenApiTypes.INT,
        location=OpenApiParameter.QUERY,
        description='Number of items per page',
        required=False,
        default=20,
    ),
    OpenApiParameter(
        name='search',
        type=OpenApiTypes.STR,
        location=OpenApiParameter.QUERY,
        description='Search query string',
        required=False,
    ),
    OpenApiParameter(
        name='ordering',
        type=OpenApiTypes.STR,
        location=OpenApiParameter.QUERY,
        description='Ordering field (e.g., -created_at)',
        required=False,
    ),
]


# Common responses
SUCCESS_RESPONSE = {
    'description': 'Successful operation',
    'examples': [
        OpenApiExample(
            'Success Response',
            value={'message': 'Operation successful', 'data': {}},
        )
    ],
}

ERROR_RESPONSE = {
    'description': 'Error occurred',
    'examples': [
        OpenApiExample(
            'Error Response',
            value={'error': 'Error message', 'details': {}},
        )
    ],
}

NOT_FOUND_RESPONSE = {
    'description': 'Resource not found',
    'examples': [
        OpenApiExample(
            'Not Found Response',
            value={'error': 'Resource not found', 'details': {}},
        )
    ],
}

VALIDATION_ERROR_RESPONSE = {
    'description': 'Validation error',
    'examples': [
        OpenApiExample(
            'Validation Error Response',
            value={'error': 'Validation failed', 'details': {'field': ['error message']}},
        )
    ],
}
