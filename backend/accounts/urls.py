from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import PlaylistViewSet
from .views import (
    RegisterView, LoginView, LogoutView,
    TestAuthView, MyTokenRefreshView
)
# urls.py

router = DefaultRouter()
router.register(r'playlists', PlaylistViewSet, basename='playlist')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('test-auth/', TestAuthView.as_view(), name='test_auth'),
    path('user_info/', views.UserInfoView.as_view(), name='user_info'),
    path('', include(router.urls)),

]

