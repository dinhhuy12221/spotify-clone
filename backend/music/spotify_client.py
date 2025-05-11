# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.conf import settings
# import requests
# import base64

# class SpotifyTokenView(APIView):
#     def post(self, request):
#         code = request.data.get("code")
#         redirect_uri = request.data.get("redirect_uri")

#         auth_str = f"{settings.SPOTIPY_CLIENT_ID}:{settings.SPOTIPY_CLIENT_SECRET}"
#         b64_auth = base64.b64encode(auth_str.encode()).decode()

#         response = requests.post("https://accounts.spotify.com/api/token", data={
#             "grant_type": "authorization_code",
#             "code": code,
#             "redirect_uri": redirect_uri
#         }, headers={
#             "Authorization": f"Basic {b64_auth}",
#             "Content-Type": "application/x-www-form-urlencoded"
#         })

#         return Response(response.json(), status=response.status_code)

# # import time
# # from spotipy import Spotify
# # from spotipy.oauth2 import SpotifyClientCredentials
# # from django.conf import settings


# # class SpotifyService:
# #     _client = None
# #     _token_info = None

# #     @classmethod
# #     def get_client(cls) -> Spotify:
# #         if cls._client is None or cls._token_expired():
# #             auth_manager = SpotifyClientCredentials(
# #                 client_id=settings.SPOTIPY_CLIENT_ID,
# #                 client_secret=settings.SPOTIPY_CLIENT_SECRET
# #             )
# #             cls._client = Spotify(auth_manager=auth_manager)
# #             cls._token_info = auth_manager.get_access_token(as_dict=True)
# #             cls._token_info['retrieved_at'] = time.time()
# #         return cls._client

# #     @classmethod
# #     def _token_expired(cls) -> bool:
# #         if not cls._token_info:
# #             return True
# #         expires_in = cls._token_info.get("expires_in", 0)
# #         retrieved = cls._token_info.get("retrieved_at", 0)
# #         return time.time() > retrieved + expires_in - 60

# #     @classmethod
# #     def search_tracks(cls, query: str, limit: int = 20):
# #         client = cls.get_client()
# #         results = client.search(q=query, type="track", limit=limit)
# #         return results.get("tracks", {}).get("items", [])

# #     @classmethod
# #     def search_artists(cls, query: str, limit: int = 20):
# #         client = cls.get_client()
# #         results = client.search(q=query, type="artist", limit=limit)
# #         return results.get("artists", {}).get("items", [])

# #     @classmethod
# #     def search_albums(cls, query: str, limit: int = 20):
# #         client = cls.get_client()
# #         results = client.search(q=query, type="album", limit=limit)
# #         return results.get("albums", {}).get("items", [])

# #     @classmethod
# #     def get_top_tracks_by_artist(cls, artist_name: str, country: str = "VN"):
# #         client = cls.get_client()
# #         search_result = client.search(q=artist_name, type="artist", limit=1)
# #         artists = search_result.get("artists", {}).get("items", [])
# #         if not artists:
# #             return []
# #         artist_id = artists[0].get("id")
# #         top_tracks = client.artist_top_tracks(artist_id, country=country)
# #         return top_tracks.get("tracks", [])

#     # @classmethod
#     # def get_hot_tracks_global(cls, limit: int = 20):
#     #     """
#     #     Trả về bài hát hot từ global chart
#     #     """
#     #     client = cls.get_client()
#     #     # Spotify ID cho playlist "Top 50 - Global"
#     #     playlist_id = "37i9dQZEVXbMDoHDwVN2tF"
#     #     playlist = client.playlist_items(playlist_id, limit=limit)
#     #     tracks = []
#     #     for item in playlist.get("items", []):
#     #         track = item.get("track")
#     #         if track:
#     #             tracks.append(track)
#     #     return tracks
    
#     # @classmethod
#     # def get_hot_tracks_global(cls, limit: int = 20):
#     #     """
#     #     Trả về bài hát hot từ playlist 'Top 50 - Global' từ danh mục 'charts'.
#     #     """
#     #     client = cls.get_client()

#     #     # Lấy các danh mục (categories) từ Spotify
#     #     categories = client.categories(country='US', limit=10)

#     #     # Kiểm tra xem danh mục 'charts' có tồn tại không
#     #     charts_category = None
#     #     for category in categories.get('categories', {}).get('items', []):
#     #         if category.get('name').lower() == 'charts':
#     #             charts_category = category
#     #             break

#     #     if not charts_category:
#     #         raise Exception("Danh mục 'charts' không tồn tại")

#     #     # Lấy các playlist từ danh mục 'charts'
#     #     playlists = client.playlists_category(charts_category['id'], country='US', limit=10)

#     #     playlist_id = None
#     #     for item in playlists.get('playlists', {}).get('items', []):
#     #         if "top 50 - global" in item["name"].lower():
#     #             playlist_id = item["id"]
#     #             break

#     #     if not playlist_id:
#     #         raise Exception("Không tìm thấy playlist 'Top 50 - Global'")

#     #     # Lấy các bài hát từ playlist
#     #     playlist = client.playlist_items(playlist_id, limit=limit)
#     #     tracks = []
#     #     for item in playlist.get("items", []):
#     #         track = item.get("track")
#     #         if track:
#     #             tracks.append(track)

#     #     return tracks
    
#     # @classmethod
#     # def get_hot_tracks_by_country(cls, country_code="GLOBAL", limit=30):
#     #     playlist_map = {
#     #         "VN": "37i9dQZEVXbLdGSmz6xilI",  # KHÔNG DÙNG - giới hạn quyền
#     #         "US": "37i9dQZEVXbLRQDuF5jeBp",
#     #         "GLOBAL": "37i9dQZEVXbMDoHDwVN2tF"
#     #     }

#     #     playlist_id = playlist_map.get(country_code.upper(), playlist_map["GLOBAL"])
#     #     client = cls.get_client()

#     #     try:
#     #         playlist = client.playlist_items(playlist_id, limit=limit)
#     #         return [item["track"] for item in playlist["items"] if item.get("track")]
#     #     except Exception as e:
#     #         raise Exception(f"Không thể lấy bài hát từ playlist `{playlist_id}`: {str(e)}")





