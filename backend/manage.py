#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv


def main():
    """Run administrative tasks."""
    # Base directory of the backend
    base_dir = Path(__file__).resolve().parent

    # Load environment variables from .env file if present
    env_path = base_dir / '.env'
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)

    # Add apps directory to sys.path for clean modular imports
    apps_dir = base_dir / 'apps'
    if str(apps_dir) not in sys.path:
        sys.path.insert(0, str(apps_dir))

    # Default to development settings if DJANGO_SETTINGS_MODULE is not set
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.development')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
