"""
ASGI config for Manoj KC Portfolio backend.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from django.core.asgi import get_asgi_application

# Load environment
base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.development')

application = get_asgi_application()
