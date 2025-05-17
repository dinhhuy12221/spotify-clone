
# music/views.py

import os
from django.http import FileResponse, Http404

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.models import CustomUser as User
from song.models import Song
from album.models import Album
from music_video.models import MusicVideo
from song.serializers import SongSerializer
from album.serializers import AlbumSerializer
from music_video.serializers import MusicVideoSerializer


# —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
# AUTHENTICATION (chỉ cấp token cho is_staff=True)
# —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
class AdminTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_staff:
            raise AuthenticationFailed("Bạn không có quyền truy cập admin.")
        return data

class AdminTokenView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = AdminTokenSerializer
    
class IsStaffUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)

class TestAuthView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        return Response({'message': 'Staff token is valid'}, status=status.HTTP_200_OK)

# —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
# USER MANAGEMENT (API cho React “admin”)
# —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
class AdminUserView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, user_id=None):
        if user_id:
            try:
                u = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
            data = {
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'playlists': [
                    {
                        'id': p.id,
                        'name': p.name,
                        'songs': p.songs,
                    } for p in u.playlists.all()
                ],
            }

            return Response(data)

        users = User.objects.filter(is_staff=False)
        data = [
            {
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'playlists': [
                    {
                        'id': p.id,
                        'name': p.name,
                        'songs': p.songs,
                    } for p in u.playlists.all()
                ],
            } for u in users
        ]

        return Response(data)

    def put(self, request, user_id):
        try:
            u = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        u.email = request.data.get('email', u.email)
        # nếu cần cho phép cập nhật playlists, uncomment dòng sau:
        # u.playlists = request.data.get('playlists', u.playlists)
        u.save()
        return Response({'message': 'User updated successfully'})

    def delete(self, request, user_id):
        try:
            u = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        u.delete()
        return Response({'message': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)


# —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
# MEDIA API (Album / Song / MusicVideo)
# —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
class AlbumViewSet(viewsets.ModelViewSet):
    # queryset = Album.objects.all().order_by('-created_at')
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=True, methods=['get'], url_path='songs')
    def get_songs(self, request, pk=None):
        album = self.get_object()
        songs = Song.objects.filter(album=album)
        serializer = SongSerializer(songs, many=True, context={'request': request})
        return Response(serializer.data)

class SongViewSet(viewsets.ModelViewSet):
    # queryset = Song.objects.all().order_by('-created_at')
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        song = self.get_object()
        try:
            path = song.audio_file.path
            return FileResponse(open(path, 'rb'),
                                as_attachment=True,
                                filename=os.path.basename(path))
        except Exception:
            raise Http404("File not found")

class MusicVideoViewSet(viewsets.ModelViewSet):
    # queryset = MusicVideo.objects.all().order_by('-uploaded_at')
    queryset = MusicVideo.objects.all()
    serializer_class = MusicVideoSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        video = self.get_object()
        try:
            path = video.video_file.path
            return FileResponse(open(path, 'rb'),
                                as_attachment=True,
                                filename=os.path.basename(path))
        except Exception:
            raise Http404("File not found")


# from rest_framework import viewsets
# from rest_framework.decorators import action
# from django.http import FileResponse, Http404
# import os

# from music.models import Album, Song, MusicVideo
# from .serializers import AlbumSerializer, SongSerializer, MusicVideoSerializer
# from .permissions import IsAdminOrReadOnly
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
# from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework.exceptions import AuthenticationFailed
# from rest_framework import status

# from accounts.models import CustomUser as User
# # Chỉ cấp token cho user is_staff=True
# class AdminTokenSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
#         if not self.user.is_staff:
#             raise AuthenticationFailed("Bạn không có quyền truy cập admin.")
#         return data

# # View để login admin
# class AdminTokenView(TokenObtainPairView):
#     permission_classes = (AllowAny,)
#     serializer_class = AdminTokenSerializer

# # View kiểm tra token (chỉ các admin đã login mới vào được)
# class TestAuthView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Nếu tới được đây thì token đã valid và user.is_staff được kiểm qua serializer login
#         return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)


# class AdminTokenView(TokenObtainPairView):
#     serializer_class = AdminTokenSerializer

# class AdminUserView(APIView):
#     permission_classes = [IsAdminUser]

#     def get(self, request, user_id=None):
#         if user_id:
#             try:
#                 user = User.objects.get(id=user_id)
#                 data = {
#                     'id': user.id,
#                     'username': user.username,
#                     'email': user.email,
#                     'playlists': user.playlists,
#                     'isAdmin': user.isAdmin,
#                 }
#                 return Response(data)
#             except User.DoesNotExist:
#                 return Response({'error': 'User not found'}, status=404)
#         else:
#             users = User.objects.filter(is_staff=False)
#             data = [{
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'playlists': user.playlists,
#             } for user in users]
#             return Response(data)

#     def put(self, request, user_id):
#         try:
#             user = User.objects.get(id=user_id)
#             data = request.data
#             # user.username = data.get('username', user.username)
#             user.email = data.get('email', user.email)
#             # user.playlists = data.get('playlists', user.playlists)
#             # user.is_staff = data.get('isAdmin', user.isStaff)
#             user.save()
#             return Response({'message': 'User updated successfully'})
#         except User.DoesNotExist:
#             return Response({'error': 'User not found'}, status=404)

#     def delete(self, request, user_id):
#         try:
#             user = User.objects.get(id=user_id)
#             user.delete()
#             return Response({'message': 'User deleted'})
#         except User.DoesNotExist:
#             return Response({'error': 'User not found'}, status=404)


# class AlbumViewSet(viewsets.ModelViewSet):
#     queryset = Album.objects.all().order_by('-created_at')
#     serializer_class = AlbumSerializer
#     permission_classes = [IsAdminOrReadOnly]

# class SongViewSet(viewsets.ModelViewSet):
#     queryset = Song.objects.all().order_by('-created_at')
#     serializer_class = SongSerializer
#     permission_classes = [IsAdminOrReadOnly]

#     @action(detail=True, methods=['get'])
#     def download(self, request, pk=None):
#         song = self.get_object()
#         try:
#             fp = song.audio_file.path
#             return FileResponse(open(fp, 'rb'),
#                                 as_attachment=True,
#                                 filename=os.path.basename(fp))
#         except Exception:
#             raise Http404("File not found")

# class MusicVideoViewSet(viewsets.ModelViewSet):
#     queryset = MusicVideo.objects.all().order_by('-uploaded_at')
#     serializer_class = MusicVideoSerializer
#     permission_classes = [IsAdminOrReadOnly]

#     @action(detail=True, methods=['get'])
#     def download(self, request, pk=None):
#         video = self.get_object()
#         try:
#             fp = video.video_file.path
#             return FileResponse(open(fp, 'rb'),
#                                 as_attachment=True,
#                                 filename=os.path.basename(fp))
#         except Exception:
#             raise Http404("File not found")
