from rest_framework import serializers
from .models import CustomUser, Song

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'isAdmin']

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class PlaylistSerializer(serializers.Serializer):
    name = serializers.CharField()
    song_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=True
    )
class UserInfoSerializer(serializers.ModelSerializer):
    playlists = PlaylistSerializer(many=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'playlists']

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'title', 'artist']




# from rest_framework import serializers
# from .models import CustomUser, Song


# class SongSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Song
#         fields = ['id', 'title', 'artist']


# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = CustomUser
#         fields = ['username', 'password', 'email', 'isAdmin']

#     def create(self, validated_data):
#         return CustomUser.objects.create_user(**validated_data)


# class LoginSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField(write_only=True)


# class UserInfoSerializer(serializers.ModelSerializer):
#     playlists = serializers.ListField(
#         child=serializers.ListField(
#             child=serializers.IntegerField(min_value=1),
#             allow_empty=True
#         ),
#         allow_empty=True
#     )

#     class Meta:
#         model = CustomUser
#         fields = ['username', 'email', 'playlists']



# # from django.contrib.auth.models import User
# from .models import CustomUser
# from rest_framework import serializers

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = CustomUser
#         fields = ['username', 'password', 'email', 'isAdmin']

#     def create(self, validated_data):
#         user = CustomUser.objects.create_user(
#             username=validated_data['username'],
#             password=validated_data['password'],
#             email=validated_data['email'],
#             isAdmin=validated_data.get('isAdmin', False)
#         )
#         return user

# class LoginSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField(write_only=True)
