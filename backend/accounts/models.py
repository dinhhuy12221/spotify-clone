# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import JSONField

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)

    def __str__(self):
        return self.title
    
    

class CustomUser(AbstractUser):
    isAdmin = models.BooleanField(default=False)

    # Playlist: [{"name": "Tên A", "song_ids": [1, 2]}, {"name": "Tên B", "song_ids": [3]}]
    playlists = JSONField(default=list, blank=True)

    def __str__(self):
        return self.username

    def add_playlist(self, name):
        if any(p['name'] == name for p in self.playlists):
            raise ValueError("Tên playlist đã tồn tại.")
        self.playlists.append({"name": name, "song_ids": []})
        self.save()

    def remove_playlist(self, name):
        original_length = len(self.playlists)
        self.playlists = [p for p in self.playlists if p['name'] != name]
        if len(self.playlists) == original_length:
            raise ValueError("Không tìm thấy playlist để xoá.")
        self.save()

    def update_playlist_name(self, old_name, new_name):
        if any(p['name'] == new_name for p in self.playlists):
            raise ValueError("Tên playlist mới đã tồn tại.")
        for playlist in self.playlists:
            if playlist['name'] == old_name:
                playlist['name'] = new_name
                self.save()
                return
        raise ValueError("Không tìm thấy playlist để cập nhật.")

    def add_song_to_playlist(self, playlist_name, song_id):
        for playlist in self.playlists:
            if playlist['name'] == playlist_name:
                if song_id not in playlist['song_ids']:
                    playlist['song_ids'].append(song_id)
                    self.save()
                    return
        raise ValueError("Không tìm thấy playlist.")

    def remove_song_from_playlist(self, playlist_name, song_id):
        for playlist in self.playlists:
            if playlist['name'] == playlist_name:
                if song_id in playlist['song_ids']:
                    playlist['song_ids'].remove(song_id)
                    self.save()
                    return
        raise ValueError("Không tìm thấy bài hát hoặc playlist.")


# models.py
# from django.contrib.auth.models import AbstractUser
# from django.db import models
# from django.db.models import JSONField  # Django >= 3.1

# class Song(models.Model):
#     title = models.CharField(max_length=255)
#     artist = models.CharField(max_length=255)

#     def __str__(self):
#         return self.title

# class CustomUser(AbstractUser):
#     isAdmin = models.BooleanField(default=False)
    
#     # Mỗi playlist là object {"name": "Tên", "song_ids": [1,2,3]}
#     playlists = JSONField(default=list, blank=True)

#     def __str__(self):
#         return self.username



# from django.contrib.auth.models import AbstractUser
# from django.db import models

# class CustomUser(AbstractUser):
#     isAdmin = models.BooleanField(default=False)

#     def __str__(self):
#         return self.username
