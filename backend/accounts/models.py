# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import JSONField

class CustomUser(AbstractUser):

    def __str__(self):
        return self.username


class Playlist(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='playlists')
    name = models.CharField(max_length=255)
    songs = JSONField(default=list, blank=True)

    def __str__(self):
        return self.name
