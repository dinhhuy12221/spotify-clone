from django.db import models
from album.models import Album

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.ForeignKey(Album, on_delete=models.SET_NULL, null=True, blank=True, related_name='songs')
    audio_file = models.FileField(upload_to='songs/')
    cover_image = models.ImageField(upload_to='song_covers/', blank=True, null=True)  # 🆕 Thêm dòng này
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.artist}"
