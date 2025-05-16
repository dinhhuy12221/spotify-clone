from django.core.management.base import BaseCommand
from accounts.models import CustomUser as User

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='admin123').exists():
            user = User.objects.create_user(
                username='admin123',
                email='admin@example.com',
                password='admin123'
            )
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write("Admin user created.")
        else:
            self.stdout.write("Admin user already exists.")
