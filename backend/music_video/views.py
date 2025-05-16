from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework import filters
from .models import MusicVideo
from .serializers import MusicVideoSerializer


class VideoReadOnlyViewSet(ReadOnlyModelViewSet):
    queryset = MusicVideo.objects.all().order_by('-uploaded_at')
    serializer_class = MusicVideoSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']  # truy vấn /?search={title} hoặc 'song__title'