from rest_framework.routers import DefaultRouter
from .views import SongViewSet

router = DefaultRouter()
router.register('', SongViewSet, basename='songViewset')
urlpatterns = router.urls