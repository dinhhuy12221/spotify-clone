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
]



# from django.urls import path
# from . import views

# urlpatterns = [
#     path('register/', views.RegisterView.as_view(), name='register'),
#     path('login/', views.LoginView.as_view(), name='login'),
# ]
