# music/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlbumReadOnlyViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'albums', AlbumReadOnlyViewSet, basename='album-readonly')

urlpatterns = [
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
