from rest_framework.viewsets import ModelViewSet
from .serializers import SongSerializer
from ..models import Song

class SongViewSet(ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer