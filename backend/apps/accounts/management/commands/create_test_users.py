"""
Django management command to create local test users for development and testing.
WARNING: These are TEST USERS ONLY. Do NOT use in production.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Create local test users for development/testing (DO NOT USE IN PRODUCTION)'

    def handle(self, *args, **options):
        # Verify we're not in production
        debug_mode = os.environ.get('DEBUG', 'False')
        if debug_mode.lower() != 'true':
            self.stdout.write(
                self.style.ERROR(
                    'ERROR: This command should only be run in DEBUG mode. '
                    'Set DEBUG=True in your environment to proceed.'
                )
            )
            return

        test_users = [
            {
                'username': 'test_super_admin',
                'email': 'super_admin@test.local',
                'password': 'TestSuperAdmin123!',
                'role': 'super_admin',
                'first_name': 'Test',
                'last_name': 'Super Admin',
            },
            {
                'username': 'test_admin',
                'email': 'admin@test.local',
                'password': 'TestAdmin123!',
                'role': 'admin',
                'first_name': 'Test',
                'last_name': 'Admin',
            },
            {
                'username': 'test_editor',
                'email': 'editor@test.local',
                'password': 'TestEditor123!',
                'role': 'editor',
                'first_name': 'Test',
                'last_name': 'Editor',
            },
            {
                'username': 'test_content_manager',
                'email': 'content_manager@test.local',
                'password': 'TestContentManager123!',
                'role': 'content_manager',
                'first_name': 'Test',
                'last_name': 'Content Manager',
            },
            {
                'username': 'test_viewer',
                'email': 'viewer@test.local',
                'password': 'TestViewer123!',
                'role': 'viewer',
                'first_name': 'Test',
                'last_name': 'Viewer',
            },
        ]

        created_count = 0
        updated_count = 0

        for user_data in test_users:
            username = user_data['username']
            email = user_data['email']
            
            try:
                user, created = User.objects.get_or_create(
                    username=username,
                    defaults={
                        'email': email,
                        'role': user_data['role'],
                        'first_name': user_data['first_name'],
                        'last_name': user_data['last_name'],
                        'is_active': True,
                        'is_verified': True,
                    }
                )
                
                # Always set/update the password
                user.set_password(user_data['password'])
                user.save()
                
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'✓ Created test user: {username} ({user_data["role"]})'
                        )
                    )
                    created_count += 1
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f'✓ Updated test user: {username} ({user_data["role"]})'
                        )
                    )
                    updated_count += 1
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'✗ Failed to create/update user {username}: {str(e)}'
                    )
                )

        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('TEST USERS CREATED/UPDATED'))
        self.stdout.write('='*60)
        self.stdout.write(f'Created: {created_count}')
        self.stdout.write(f'Updated: {updated_count}')
        self.stdout.write(f'Total: {created_count + updated_count}')
        self.stdout.write('\n' + self.style.WARNING('WARNING: These are TEST USERS ONLY.'))
        self.stdout.write(self.style.WARNING('DO NOT use these credentials in production.'))
        self.stdout.write('='*60)
