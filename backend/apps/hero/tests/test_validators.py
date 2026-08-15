"""
Tests for hero app validators.
"""
from django.test import TestCase
from ..validators import validate_hero_availability, validate_hero_images, validate_cta_buttons


class HeroValidatorTest(TestCase):
    """Test Hero validators."""
    
    def test_validate_hero_availability(self):
        """Test validating availability status."""
        # Valid status
        validate_hero_availability('available')
        
        # Invalid status
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_hero_availability('invalid_status')
    
    def test_validate_hero_images(self):
        """Test validating hero images."""
        # Missing profile image
        data = {'name': 'John Doe'}
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_hero_images(data)
        
        # With profile image
        data = {'profile_image': 'image.jpg'}
        result = validate_hero_images(data)
        self.assertEqual(result, data)
    
    def test_validate_cta_buttons(self):
        """Test validating CTA buttons."""
        # Text without URL
        data = {'resume_button_text': 'Download Resume'}
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_cta_buttons(data)
        
        # Text with URL
        data = {
            'resume_button_text': 'Download Resume',
            'resume_button_url': 'https://example.com/resume.pdf'
        }
        result = validate_cta_buttons(data)
        self.assertEqual(result, data)
