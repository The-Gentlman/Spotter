from django.db.models.signals import post_migrate
from django.dispatch import receiver
from apps.account.models import User


# @receiver(post_migrate)
def create_default_users(sender, **kwargs):
    foroozani, created = User.objects.get_or_create(
        first_name="MohammadAli",
        last_name="Foroozani",
        email="mforoozani80@gmail.com",
    )
    if created:
        foroozani.set_password("123123")
        foroozani.is_superuser = True
        foroozani.is_staff = True
        foroozani.save()

    spotter, created = User.objects.get_or_create(
        first_name="spotter",
        last_name="essential",
        email="spotter@gmail.com",
    )
    if created:
        spotter.set_password("123123")
        spotter.is_superuser = True
        foroozani.is_staff = True
        spotter.save()
