"""
Django management command to create a bootstrap admin user for development/testing.
This command is safe to run in DEBUG mode only and reads credentials from environment variables.
"""
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.contrib.auth import get_user_model
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a bootstrap admin user for development/testing (DEBUG mode only)'

    def handle(self, *args, **options):
        # Safety check: only allow in DEBUG mode
        if not settings.DEBUG:
            raise CommandError(
                'This command can only be run in DEBUG mode. '
                'Set DEBUG=True in your environment or use this for development only.'
            )

        # Get credentials from environment variables
        username = os.environ.get('DJANGO_BOOTSTRAP_ADMIN_USERNAME')
        password = os.environ.get('DJANGO_BOOTSTRAP_ADMIN_PASSWORD')
        email = os.environ.get('DJANGO_BOOTSTRAP_ADMIN_EMAIL', f'{username}@dev.local' if username else None)

        if not username or not password:
            raise CommandError(
                'Environment variables DJANGO_BOOTSTRAP_ADMIN_USERNAME and '
                'DJANGO_BOOTSTRAP_ADMIN_PASSWORD must be set.'
            )

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'User "{username}" already exists. Skipping creation.')
            )
            return

        # Create the bootstrap admin user
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role='super_admin',
                is_verified=True,
                is_active=True
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created bootstrap admin user: {username}\n'
                    f'Email: {email}\n'
                    f'Role: super_admin\n'
                    f'WARNING: This is a development/bootstrap user. '
                    f'Change the password before production deployment.'
                )
            )
        except Exception as e:
            raise CommandError(f'Failed to create bootstrap admin user: {str(e)}')
