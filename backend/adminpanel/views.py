from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import CustomUser as User

class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)


class AdminTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_staff:
            raise AuthenticationFailed("Bạn không có quyền truy cập admin.")
        return data

class AdminTokenView(TokenObtainPairView):
    serializer_class = AdminTokenSerializer

class AdminUserView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, user_id=None):
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                data = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'playlists': user.playlists,
                    'isAdmin': user.isAdmin,
                }
                return Response(data)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        else:
            users = User.objects.filter(is_staff=False)
            data = [{
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'playlists': user.playlists,
            } for user in users]
            return Response(data)

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            data = request.data
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.playlists = data.get('playlists', user.playlists)
            # user.is_staff = data.get('isAdmin', user.isStaff)
            user.save()
            return Response({'message': 'User updated successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({'message': 'User deleted'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)