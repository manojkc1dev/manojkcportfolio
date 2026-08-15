"""
Tests for education app validators.
"""
from django.test import TestCase
from ..validators import validate_education_dates, validate_cgpa


class EducationValidatorTest(TestCase):
    """Test Education validators."""
    
    def test_validate_education_dates(self):
        """Test validating education dates."""
        from datetime import date
        # Valid dates
        validate_education_dates(date(2016, 1, 1), date(2020, 1, 1), False)
        
        # Invalid dates
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_education_dates(date(2020, 1, 1), date(2016, 1, 1), False)
    
    def test_validate_cgpa(self):
        """Test validating CGPA."""
        # Valid CGPA
        validate_cgpa(8.5)
        
        # Invalid CGPA
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_cgpa(11)
