# music/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SongReadOnlyViewSet

router = DefaultRouter()
router.register(r'songs', SongReadOnlyViewSet, basename='song-readonly')

urlpatterns = [
    path('', include(router.urls)),
]
