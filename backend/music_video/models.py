from django.db import models
from song.models import Song

# Create your models here.
class MusicVideo(models.Model):
    title = models.CharField(max_length=255)
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='videos')
    video_file = models.FileField(upload_to='music_videos/')
    thumbnail = models.ImageField(upload_to='video_thumbnails/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title