#!/bin/bash

# Exit on any error
set -e

echo "Starting Django application..."

# Wait for database to be ready (if using PostgreSQL in future)
# python manage.py wait_for_db

# Run database migrations
echo "Running database migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Create superuser if it doesn't exist
echo "Creating superuser..."
python manage.py shell << EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
EOF

# Start the Django development server
echo "Starting Django server on 0.0.0.0:8000..."
python manage.py runserver 0.0.0.0:8000