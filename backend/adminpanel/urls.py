from django.urls import path
from .views import AdminUserView, MyTokenObtainPairView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='admin_login'),
    path('users/', AdminUserView.as_view()),
    path('users/<int:user_id>/', AdminUserView.as_view()),
]
