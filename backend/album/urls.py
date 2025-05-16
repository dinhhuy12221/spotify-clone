# music/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlbumReadOnlyViewSet

router = DefaultRouter()
router.register(r'albums', AlbumReadOnlyViewSet, basename='album-readonly')

urlpatterns = [
    path('', include(router.urls)),
]
