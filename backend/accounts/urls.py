from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('user_info/', views.UserInfoView.as_view(), name='user_info'),
    path('user-playlist/', views.UserPlaylistView.as_view(), name='user_playlist'),
    path('playlist/create/', views.CreatePlaylistView.as_view(), name='create-playlist'),
    path('playlist/delete/<str:name>/', views.DeletePlaylistView.as_view(), name='delete-playlist'),
    path('playlist/rename/', views.RenamePlaylistView.as_view(), name='rename-playlist'),
    path('playlist/update-songs/', views.UpdatePlaylistSongsView.as_view(), name='update-playlist-songs'),
    path('admin/users/', views.AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:user_id>/', views.AdminEditUserView.as_view(), name='admin-user-edit'),
    path('admin/users/<int:user_id>/delete/', views.AdminDeleteUserView.as_view(), name='admin-user-delete'),
    path('admin/users/create/', views.AdminCreateUserView.as_view(), name='admin-user-create'),
]



# from django.urls import path
# from . import views

# urlpatterns = [
#     path('register/', views.RegisterView.as_view(), name='register'),
#     path('login/', views.LoginView.as_view(), name='login'),
# ]
