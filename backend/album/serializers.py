from rest_framework import serializers
from .models import Album
from song.serializers import SongSerializer

class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    
    class Meta:
        model = Album
        fields = '__all__'