"""
Script to export OpenAPI schema for Postman import.
Run: python manage.py spectacular --color --file schema.yml
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.management import call_command
from pathlib import Path

# Export OpenAPI schema
output_path = Path(__file__).parent.parent / 'docs' / 'openapi_schema.yml'
output_path.parent.mkdir(exist_ok=True)

print(f"Exporting OpenAPI schema to {output_path}...")
call_command('spectacular', '--color', '--file', str(output_path))
print(f"OpenAPI schema exported successfully to {output_path}")

# Also export as JSON for Postman
json_output_path = Path(__file__).parent.parent / 'docs' / 'openapi_schema.json'
print(f"Exporting OpenAPI schema (JSON) to {json_output_path}...")
call_command('spectacular', '--format', 'json', '--file', str(json_output_path))
print(f"OpenAPI schema (JSON) exported successfully to {json_output_path}")

print("\nTo import into Postman:")
print("1. Open Postman")
print("2. Click Import in the top left")
print("3. Select the openapi_schema.yml or openapi_schema.json file")
print("4. Postman will automatically create a collection from the schema")
