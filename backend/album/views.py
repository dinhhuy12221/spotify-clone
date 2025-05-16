from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework import filters
from .models import Album
from .serializers import AlbumSerializer

# --- USER THƯỜNG: chỉ GET với tìm kiếm theo title ---
class AlbumReadOnlyViewSet(ReadOnlyModelViewSet):
    queryset = Album.objects.all().order_by('-created_at')
    serializer_class = AlbumSerializer
    permission_classes = [AllowAny]      # Public access
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']  # truy vấn /?search={title}