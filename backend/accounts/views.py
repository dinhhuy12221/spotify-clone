from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse

from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserInfoSerializer, PlaylistSerializer

import datetime

User = get_user_model()

# Custom permission for admin
class IsCustomAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.isAdmin)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'message': 'Đăng ký thành công!', 'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(**serializer.validated_data)
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                response = Response({
                    'message': 'Đăng nhập thành công!',
                    'token': token.key,
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'playlists': user.playlists,
                        'isAdmin': user.isAdmin,
                    }
                })

                expires = datetime.datetime.utcnow() + datetime.timedelta(days=1)
                response.set_cookie('token', token.key, expires=expires, httponly=False, secure=False, samesite='Lax')
                return response

            return Response({'error': 'Tài khoản hoặc mật khẩu không chính xác'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_info = {
            'username': user.username,
            'email': user.email,
            'playlists': user.playlists,
            'isAdmin': user.isAdmin,
        }
        return Response(user_info)


class UserPlaylistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'playlists': request.user.playlists}, status=status.HTTP_200_OK)


class CreatePlaylistView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        name = request.data.get('name')
        if not name:
            return Response({'error': 'Vui lòng cung cấp tên playlist.'}, status=status.HTTP_400_BAD_REQUEST)

        user: CustomUser = request.user
        if any(p['name'] == name for p in user.playlists):
            return Response({'error': 'Tên playlist đã tồn tại.'}, status=status.HTTP_400_BAD_REQUEST)

        user.playlists.append({"name": name, "song_ids": []})
        user.save()
        return Response({'message': 'Playlist đã được tạo.'}, status=status.HTTP_201_CREATED)


class DeletePlaylistView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def delete(self, request, name):
        user: CustomUser = request.user
        playlists = [p for p in user.playlists if p['name'] != name]

        if len(playlists) == len(user.playlists):
            return Response({'error': 'Không tìm thấy playlist.'}, status=status.HTTP_404_NOT_FOUND)

        user.playlists = playlists
        user.save()
        return Response({'message': 'Playlist đã được xoá.'}, status=status.HTTP_200_OK)


class RenamePlaylistView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request):
        old_name = request.data.get('old_name')
        new_name = request.data.get('new_name')

        if not old_name or not new_name:
            return Response({'error': 'Vui lòng cung cấp cả tên cũ và tên mới.'}, status=status.HTTP_400_BAD_REQUEST)

        user: CustomUser = request.user

        if any(p['name'] == new_name for p in user.playlists):
            return Response({'error': 'Tên mới đã tồn tại.'}, status=status.HTTP_400_BAD_REQUEST)

        found = False
        for playlist in user.playlists:
            if playlist['name'] == old_name:
                playlist['name'] = new_name
                found = True
                break

        if not found:
            return Response({'error': 'Không tìm thấy playlist để đổi tên.'}, status=status.HTTP_404_NOT_FOUND)

        user.save()
        return Response({'message': 'Đã đổi tên playlist.'}, status=status.HTTP_200_OK)


class UpdatePlaylistSongsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request):
        playlist_name = request.data.get('playlist_name')
        song_id = request.data.get('song_id')
        action = request.data.get('action')  # "add" hoặc "remove"

        if not playlist_name or not song_id or action not in ['add', 'remove']:
            return Response({'error': 'Vui lòng cung cấp playlist_name, song_id và action (add/remove).'},
                            status=status.HTTP_400_BAD_REQUEST)

        user: CustomUser = request.user
        found = False

        for playlist in user.playlists:
            if playlist['name'] == playlist_name:
                found = True
                if action == 'add':
                    if song_id not in playlist['song_ids']:
                        playlist['song_ids'].append(song_id)
                    else:
                        return Response({'message': 'Bài hát đã tồn tại trong playlist.'}, status=status.HTTP_200_OK)
                elif action == 'remove':
                    if song_id in playlist['song_ids']:
                        playlist['song_ids'].remove(song_id)
                    else:
                        return Response({'error': 'Không tìm thấy bài hát để xoá trong playlist.'},
                                        status=status.HTTP_404_NOT_FOUND)
                break

        if not found:
            return Response({'error': 'Không tìm thấy playlist.'}, status=status.HTTP_404_NOT_FOUND)

        user.save()
        return Response({'message': f'Đã {action} bài hát {"vào" if action == "add" else "khỏi"} playlist.'},
                        status=status.HTTP_200_OK)


class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated, IsCustomAdminUser]

    def get(self, request):
        users = User.objects.all().values('id', 'username', 'email', 'playlists', 'isAdmin')
        return Response(list(users))


class AdminDeleteUserView(APIView):
    permission_classes = [IsAuthenticated, IsCustomAdminUser]

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({'message': 'Đã xóa người dùng.'})
        except User.DoesNotExist:
            return Response({'error': 'Không tìm thấy người dùng.'}, status=404)


class AdminEditUserView(APIView):
    permission_classes = [IsAuthenticated, IsCustomAdminUser]

    def put(self, request, user_id):
        data = request.data
        try:
            user = User.objects.get(id=user_id)
            user.username = data.get("username", user.username)
            user.email = data.get("email", user.email)
            user.isAdmin = data.get("isAdmin", user.isAdmin)
            user.save()
            return Response({'message': 'Đã cập nhật người dùng.'})
        except User.DoesNotExist:
            return Response({'error': 'Không tìm thấy người dùng.'}, status=404)


class AdminCreateUserView(APIView):
    permission_classes = [IsAuthenticated, IsCustomAdminUser]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        isAdmin = request.data.get('isAdmin', False)

        if not username or not password:
            return Response({'error': 'Username và password là bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username đã tồn tại.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password, isAdmin=isAdmin)
        return Response({'message': 'Tạo người dùng thành công.'}, status=status.HTTP_201_CREATED)


# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status, permissions
# from rest_framework.exceptions import ValidationError, AuthenticationFailed
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authtoken.models import Token
# from django.contrib.auth import authenticate
# from django.http import JsonResponse
# from rest_framework.authentication import TokenAuthentication

# from .models import CustomUser
# from .serializers import RegisterSerializer, LoginSerializer, UserInfoSerializer, PlaylistSerializer

# import datetime


# class RegisterView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             token, _ = Token.objects.get_or_create(user=user)
#             return Response({'message': 'Đăng ký thành công!', 'token': token.key}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class LoginView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user = authenticate(**serializer.validated_data)
#             if user:
#                 token, _ = Token.objects.get_or_create(user=user)
#                 response = Response({
#                     'message': 'Đăng nhập thành công!',
#                     'token': token.key,
#                     'user': {
#                         'username': user.username,
#                         'email': user.email,
#                         'playlists': user.playlists,
#                     }
#                 })

#                 expires = datetime.datetime.utcnow() + datetime.timedelta(days=1)
#                 response.set_cookie('token', token.key, expires=expires, httponly=False, secure=False, samesite='Lax')
#                 response.set_cookie('user_info', str({
#                     'username': user.username,
#                     'email': user.email,
#                     'playlists': user.playlists,
#                 }), expires=expires, httponly=False, secure=False, samesite='Lax')

#                 return response

#             return Response({'error': 'Tài khoản hoặc mật khẩu không chính xác'}, status=status.HTTP_400_BAD_REQUEST)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class UserInfoView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         user_info = {
#             'username': user.username,
#             'email': user.email,
#             'playlists': user.playlists,
#         }

#         response = JsonResponse(user_info)
#         response.set_cookie(
#             key='user_info',
#             value=str(user_info),
#             httponly=False,
#             secure=False,
#             samesite='Lax'
#         )
#         return response



# class UserPlaylistView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         return Response({'playlists': request.user.playlists}, status=status.HTTP_200_OK)
    
# class CreatePlaylistView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     authentication_classes = [TokenAuthentication]

#     def post(self, request):
#         name = request.data.get('name')
#         if not name:
#             return Response({'error': 'Vui lòng cung cấp tên playlist.'}, status=status.HTTP_400_BAD_REQUEST)

#         user: CustomUser = request.user
#         if any(p['name'] == name for p in user.playlists):
#             return Response({'error': 'Tên playlist đã tồn tại.'}, status=status.HTTP_400_BAD_REQUEST)

#         user.playlists.append({"name": name, "song_ids": []})
#         user.save()
#         return Response({'message': 'Playlist đã được tạo.'}, status=status.HTTP_201_CREATED)


# class DeletePlaylistView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     authentication_classes = [TokenAuthentication]

#     def delete(self, request, name):
#         user: CustomUser = request.user
#         playlists = [p for p in user.playlists if p['name'] != name]

#         if len(playlists) == len(user.playlists):
#             return Response({'error': 'Không tìm thấy playlist.'}, status=status.HTTP_404_NOT_FOUND)

#         user.playlists = playlists
#         user.save()
#         return Response({'message': 'Playlist đã được xoá.'}, status=status.HTTP_200_OK)


# class RenamePlaylistView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     authentication_classes = [TokenAuthentication]

#     def put(self, request):
#         old_name = request.data.get('old_name')
#         new_name = request.data.get('new_name')

#         if not old_name or not new_name:
#             return Response({'error': 'Vui lòng cung cấp cả tên cũ và tên mới.'}, status=status.HTTP_400_BAD_REQUEST)

#         user: CustomUser = request.user

#         if any(p['name'] == new_name for p in user.playlists):
#             return Response({'error': 'Tên mới đã tồn tại.'}, status=status.HTTP_400_BAD_REQUEST)

#         found = False
#         for playlist in user.playlists:
#             if playlist['name'] == old_name:
#                 playlist['name'] = new_name
#                 found = True
#                 break

#         if not found:
#             return Response({'error': 'Không tìm thấy playlist để đổi tên.'}, status=status.HTTP_404_NOT_FOUND)

#         user.save()
#         return Response({'message': 'Đã đổi tên playlist.'}, status=status.HTTP_200_OK)

# class UpdatePlaylistSongsView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     authentication_classes = [TokenAuthentication]

#     def put(self, request):
#         playlist_name = request.data.get('playlist_name')
#         song_id = request.data.get('song_id')
#         action = request.data.get('action')  # "add" hoặc "remove"

#         if not playlist_name or not song_id or action not in ['add', 'remove']:
#             return Response({'error': 'Vui lòng cung cấp playlist_name, song_id và action (add/remove).'},
#                             status=status.HTTP_400_BAD_REQUEST)

#         user: CustomUser = request.user
#         found = False

#         for playlist in user.playlists:
#             if playlist['name'] == playlist_name:
#                 found = True
#                 if action == 'add':
#                     # Kiểm tra nếu song_id đã có trong playlist
#                     if song_id not in playlist['song_ids']:
#                         playlist['song_ids'].append(song_id)
#                     else:
#                         return Response({'message': 'Bài hát đã tồn tại trong playlist.'},
#                                         status=status.HTTP_200_OK)
#                 elif action == 'remove':
#                     if song_id in playlist['song_ids']:
#                         playlist['song_ids'].remove(song_id)
#                     else:
#                         return Response({'error': 'Không tìm thấy bài hát để xoá trong playlist.'},
#                                         status=status.HTTP_404_NOT_FOUND)
#                 break

#         if not found:
#             return Response({'error': 'Không tìm thấy playlist.'}, status=status.HTTP_404_NOT_FOUND)

#         user.save()
#         return Response({'message': f'Đã {action} bài hát {"vào" if action == "add" else "khỏi"} playlist.'},
#                         status=status.HTTP_200_OK)


# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAdminUser
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class AdminUserListView(APIView):
#     permission_classes = [IsAdminUser]

#     def get(self, request):
#         users = User.objects.all().values('id', 'username', 'email', 'playlists')
#         return Response(list(users))


# class AdminDeleteUserView(APIView):
#     permission_classes = [IsAdminUser]

#     def delete(self, request, user_id):
#         try:
#             user = User.objects.get(id=user_id)
#             user.delete()
#             return Response({'message': 'Đã xóa người dùng.'})
#         except User.DoesNotExist:
#             return Response({'error': 'Không tìm thấy người dùng.'}, status=404)

# class AdminEditUserView(APIView):
#     permission_classes = [IsAdminUser]

#     def put(self, request, user_id):
#         data = request.data
#         try:
#             user = User.objects.get(id=user_id)
#             user.username = data.get("username", user.username)
#             user.email = data.get("email", user.email)
#             user.save()
#             return Response({'message': 'Đã cập nhật người dùng.'})
#         except User.DoesNotExist:
#             return Response({'error': 'Không tìm thấy người dùng.'}, status=404)


# from django.contrib.auth.models import User
# from rest_framework import status

# class AdminCreateUserView(APIView):
#     permission_classes = [IsAdminUser]

#     def post(self, request):
#         username = request.data.get('username')
#         email = request.data.get('email')
#         password = request.data.get('password')

#         if not username or not password:
#             return Response({'error': 'Username và password là bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

#         if User.objects.filter(username=username).exists():
#             return Response({'error': 'Username đã tồn tại.'}, status=status.HTTP_400_BAD_REQUEST)

#         user = User.objects.create_user(username=username, email=email, password=password)
#         return Response({'message': 'Tạo người dùng thành công.'}, status=status.HTTP_201_CREATED)


# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status, permissions
# from django.contrib.auth import authenticate
# from rest_framework.authtoken.models import Token
# from .serializers import RegisterSerializer, LoginSerializer, UserInfoSerializer
# from rest_framework.exceptions import AuthenticationFailed
# from django.http import JsonResponse
# from rest_framework.permissions import IsAuthenticated
# import datetime

# class RegisterView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             token, _ = Token.objects.get_or_create(user=user)
#             return Response({'message': 'Đăng ký thành công!', 'token': token.key}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class LoginView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user = authenticate(**serializer.validated_data)
#             if user:
#                 token, _ = Token.objects.get_or_create(user=user)
#                 response = Response({
#                     'message': 'Đăng nhập thành công!',
#                     'token': token.key,
#                     'user': {
#                         'username': user.username,
#                         'email': user.email,
#                         'playlists': user.playlists,  # nếu là JSONField
#                     }
#                 })

#                 # Lưu token và thông tin người dùng vào cookie bình thường (không secure, không httponly)
#                 expires = datetime.datetime.utcnow() + datetime.timedelta(days=1)

#                 response.set_cookie(
#                     key='token',
#                     value=token.key,
#                     expires=expires,
#                     httponly=False,
#                     secure=False,
#                     samesite='Lax'
#                 )

#                 response.set_cookie(
#                     key='user_info',
#                     value=str({
#                         'username': user.username,
#                         'email': user.email,
#                         'playlists': user.playlists,
#                     }),
#                     expires=expires,
#                     httponly=False,
#                     secure=False,
#                     samesite='Lax'
#                 )

#                 return response

#             return Response({'error': 'Tài khoản hoặc mật khẩu không chính xác'}, status=status.HTTP_400_BAD_REQUEST)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class UserInfoView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         user_info = {
#             'username': user.username,
#             'email': user.email,
#             'playlists': user.playlists,
#         }

#         # Trả về thông tin mà không dùng secure/httponly cookie
#         response = JsonResponse(user_info)
#         response.set_cookie(
#             key='user_info',
#             value=str(user_info),
#             httponly=False,
#             secure=False,
#             samesite='Lax'
#         )
#         return response


# class UserPlaylistView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         # Lấy token từ cookie
#         token_key = request.COOKIES.get('token')
#         if not token_key:
#             raise AuthenticationFailed('Token not found in cookies')

#         try:
#             token = Token.objects.get(key=token_key)
#         except Token.DoesNotExist:
#             raise AuthenticationFailed('Invalid token')

#         user = token.user
#         playlists = user.playlists

#         return Response({'playlists': playlists}, status=status.HTTP_200_OK)



# from django.contrib.auth import authenticate
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework.authtoken.models import Token
# from .serializers import RegisterSerializer, LoginSerializer

# class RegisterView(APIView):
#     """
#     View để đăng ký người dùng mới.
#     """
#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             token, created = Token.objects.get_or_create(user=user)
#             return Response({
#                 'message': 'Đăng ký thành công!',
#                 'token': token.key
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class LoginView(APIView):
#     """
#     View để đăng nhập người dùng và nhận token.
#     """
#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         if serializer.is_valid():
#             username = serializer.validated_data['username']
#             password = serializer.validated_data['password']

#             user = authenticate(username=username, password=password)
#             if user:
#                 token, created = Token.objects.get_or_create(user=user)
#                 return Response({
#                     'message': 'Đăng nhập thành công!',
#                     'token': token.key
#                 }, status=status.HTTP_200_OK)
#             return Response({'error': 'Tài khoản hoặc mật khẩu không chính xác'}, status=status.HTTP_400_BAD_REQUEST)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
