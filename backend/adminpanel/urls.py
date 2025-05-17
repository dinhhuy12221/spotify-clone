# music/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

from .views import (
    AdminTokenView,
    TestAuthView,
    AdminUserView,
    AlbumViewSet,
    SongViewSet,
    MusicVideoViewSet,
)

router = DefaultRouter()
router.register(r'albums', AlbumViewSet, basename='album')
router.register(r'songs',  SongViewSet,  basename='song')
router.register(r'videos', MusicVideoViewSet, basename='video')

urlpatterns = [
    path('login/', AdminTokenView.as_view(), name='admin_login'),
    path('test-auth/', TestAuthView.as_view(), name='test-auth'),
    path('users/', AdminUserView.as_view()),
    path('users/<int:user_id>/', AdminUserView.as_view()),
     # Media CRUD + download
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
