import os
import shutil
from django.core.files.storage import default_storage
from django.db import models
import uuid
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django_jsonform.models.fields import ArrayField
from apps.account.models import User

# Create your models here.


def dynamic_upload_path(instance, filename):
    _, ext = os.path.splitext(filename)
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    return os.path.join(instance.type, unique_filename)


class FileType(models.TextChoices):
    TEMP = "temp"
    DOCUMENTS = "documents"


class File(models.Model):
    name = models.CharField(max_length=255, default="")
    type = models.CharField(
        max_length=20, choices=FileType.choices, default=FileType.TEMP, editable=False
    )
    tags = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        null=True,
    )
    file = models.FileField(upload_to=dynamic_upload_path, max_length=512)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    create_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.file.name

        super().save(*args, **kwargs)

    def move_to(self, destination, tags=None):
        try:
            new_file_name = self.file.name.replace("temp/", f"{destination}/")
            current_file_path = self.file.path
            new_file_path = current_file_path.replace(self.file.name, new_file_name)
            os.makedirs(os.path.dirname(new_file_path), exist_ok=True)

            shutil.move(current_file_path, new_file_path)
            self.file.name = new_file_name
            self.type = destination
            self.tags = tags
            self.save()
            return True
        except Exception as e:
            print(e)
            return False

    def __str__(self):
        return f"{self.file.name}"


@receiver(pre_delete, sender=File)
def delete_file_on_delete(sender, instance, **kwargs):
    if instance.file:
        file_path = instance.file.path
        default_storage.delete(file_path)
