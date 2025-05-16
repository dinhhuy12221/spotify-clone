from rest_framework import serializers
from .models import MusicVideo


class MusicVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MusicVideo
        fields = '__all__'