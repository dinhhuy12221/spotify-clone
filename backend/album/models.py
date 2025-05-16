from django.db import models

# Create your models here.
class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    cover_image = models.ImageField(upload_to='album_covers/', blank=True, null=True)
    release_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def cover_image_url(self):
        if self.cover_image:
            return self.cover_image.url
        return None

    def __str__(self):
        return f"{self.title} - {self.artist}"