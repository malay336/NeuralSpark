import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "e_learning_project.settings")
django.setup()

from core.models import User

def ensure_superuser():
    username = "admin"
    email = "admin@neuralspark.org"
    password = "admin123"

    user, created = User.objects.get_or_create(username=username, defaults={"email": email, "is_staff": True, "is_superuser": True})
    user.is_staff = True
    user.is_superuser = True
    user.set_password(password)
    user.save()

    if created:
        print(f"Created new superuser: username='{username}', password='{password}'")
    else:
        print(f"Updated superuser credentials: username='{username}', password='{password}'")

if __name__ == "__main__":
    ensure_superuser()
