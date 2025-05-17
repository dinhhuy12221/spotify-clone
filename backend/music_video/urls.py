# music/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoReadOnlyViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'videos', VideoReadOnlyViewSet, basename='video-readonly')

urlpatterns = [
    path('', include(router.urls)),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
