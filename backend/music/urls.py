from django.urls import path
from .views import MusicSearchAPIView

urlpatterns = [
    path("search/", MusicSearchAPIView.as_view(), name="music-search"),
]
