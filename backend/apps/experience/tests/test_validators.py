"""
Tests for experience app validators.
"""
from django.test import TestCase
from django.core.exceptions import ValidationError
from ..validators import validate_employment_type, validate_experience_dates


class ExperienceValidatorTest(TestCase):
    """Test Experience validators."""
    
    def test_validate_employment_type(self):
        """Test validating employment type."""
        # Valid type
        validate_employment_type('full_time')
        
        # Invalid type
        with self.assertRaises(ValidationError):
            validate_employment_type('invalid_type')
    
    def test_validate_experience_dates(self):
        """Test validating experience dates."""
        from datetime import date
        # Valid dates
        validate_experience_dates(date(2020, 1, 1), date(2021, 1, 1), False)
        
        # Invalid dates
        with self.assertRaises(ValidationError):
            validate_experience_dates(date(2021, 1, 1), date(2020, 1, 1), False)
