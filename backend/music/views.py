# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.renderers import JSONRenderer
# from .soundcloud_client import SoundCloudService


# class MusicSearchAPIView(APIView):
#     renderer_classes = [JSONRenderer]

#     def options(self, request, *args, **kwargs):
#         return Response(status=status.HTTP_200_OK)

#     def get(self, request):
#         query = request.GET.get("q", "").strip()
#         search_type = request.GET.get("type", "track")

#         try:
#             if search_type == "track":
#                 if not query:
#                     return self._missing_query()
#                 items = SoundCloudService.search_tracks(query, limit=30)
#                 return Response(self._format_tracks(items), status=200)

#             elif search_type == "artist":
#                 if not query:
#                     return self._missing_query()
#                 items = SoundCloudService.search_artists(query, limit=30)
#                 return Response(self._format_artists(items), status=200)

#             elif search_type == "album":
#                 if not query:
#                     return self._missing_query()
#                 items = SoundCloudService.search_albums(query, limit=30)
#                 return Response(self._format_albums(items), status=200)

#             elif search_type == "top_by_artist":
#                 if not query:
#                     return self._missing_query()
#                 items = SoundCloudService.get_top_tracks_by_artist(query)
#                 return Response(self._format_tracks(items), status=200)

#             elif search_type == "hot":
#                 items = SoundCloudService.get_hot_tracks_global()
#                 return Response(self._format_tracks(items), status=200)

#             elif search_type == "hot_by_country":
#                 country = request.GET.get("country", "VN")
#                 items = SoundCloudService.get_hot_tracks_by_country(country)
#                 return Response(self._format_tracks(items), status=200)

#             else:
#                 return Response(
#                     {"error": f"Loại tìm kiếm không hợp lệ: `{search_type}`"},
#                     status=400
#                 )

#         except Exception as e:
#             return Response(
#                 {"error": f"Lỗi server: {str(e)}"},
#                 status=500
#             )

#     def _missing_query(self):
#         return Response(
#             {"error": "Thiếu tham số `q`"},
#             status=400
#         )

#     def _format_tracks(self, items):
#         data = []
#         for item in items:
#             duration_ms = item.get("duration", 0)
#             minute = duration_ms // 60000
#             second = (duration_ms % 60000) // 1000
#             duration = f"{minute}:{second:02d}"

#             user = item.get("user", {})
#             artist_name = user.get("username")

#             stream_url = None
#             transcodings = item.get("media", {}).get("transcodings", [])
#             for transcoding in transcodings:
#                 if transcoding.get("format", {}).get("protocol") == "progressive":
#                     stream_url = transcoding.get("url")
#                     break

#             data.append({
#                 "title": item.get("title"),
#                 "artists": [artist_name] if artist_name else [],
#                 "duration": duration,
#                 "album": None,
#                 "thumbnail": item.get("artwork_url") or user.get("avatar_url"),
#                 "stream_url": stream_url,
#                 "permalink_url": item.get("permalink_url"),
#                 "popularity": None,
#                 "release_date": None
#             })
#         return data

#     def _format_artists(self, items):
#         data = []
#         for user in items:
#             data.append({
#                 "name": user.get("username"),
#                 "genres": [],
#                 "followers": user.get("followers_count"),
#                 "popularity": None,
#                 "profile_url": user.get("permalink_url"),
#                 "thumbnail": user.get("avatar_url"),
#             })
#         return data

#     def _format_albums(self, items):
#         data = []
#         for item in items:
#             user = item.get("user", {})
#             artist_name = user.get("username")

#             data.append({
#                 "name": item.get("title"),
#                 "artists": [artist_name] if artist_name else [],
#                 "release_date": None,
#                 "total_tracks": len(item.get("tracks", [])),
#                 "thumbnail": item.get("artwork_url"),
#                 "permalink_url": item.get("permalink_url"),
#             })
#         return data




# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.renderers import JSONRenderer
# from .spotify_client import SpotifyService


# class MusicSearchAPIView(APIView):
#     renderer_classes = [JSONRenderer]

#     def options(self, request, *args, **kwargs):
#         return Response(status=status.HTTP_200_OK)

#     def get(self, request):
#         query = request.GET.get("q", "").strip()
#         search_type = request.GET.get("type", "track")

#         try:
#             if search_type == "track":
#                 if not query:
#                     return self._missing_query()
#                 items = SpotifyService.search_tracks(query, limit=30)
#                 return Response(self._format_tracks(items), status=200)

#             elif search_type == "artist":
#                 if not query:
#                     return self._missing_query()
#                 items = SpotifyService.search_artists(query, limit=30)
#                 return Response(self._format_artists(items), status=200)

#             elif search_type == "album":
#                 if not query:
#                     return self._missing_query()
#                 items = SpotifyService.search_albums(query, limit=30)
#                 return Response(self._format_albums(items), status=200)

#             elif search_type == "top_by_artist":
#                 if not query:
#                     return self._missing_query()
#                 items = SpotifyService.get_top_tracks_by_artist(query)
#                 return Response(self._format_tracks(items), status=200)

#             elif search_type == "hot":
#                 items = SpotifyService.get_hot_tracks_global()
#                 return Response(self._format_tracks(items), status=200)

#             elif search_type == "hot_by_country":
#                 country = request.GET.get("country", "VN")
#                 items = SpotifyService.get_hot_tracks_by_country()
#                 return Response(self._format_tracks(items), status=200)
#             else:
#                 return Response(
#                     {"error": f"Loại tìm kiếm không hợp lệ: `{search_type}`"},
#                     status=400
#                 )

#         except Exception as e:
#             return Response(
#                 {"error": f"Lỗi server: {str(e)}"},
#                 status=500
#             )

#     def _missing_query(self):
#         return Response(
#             {"error": "Thiếu tham số `q`"},
#             status=400
#         )

#     def _format_tracks(self, items):
#         data = []
#         for item in items:
#             dur_ms = item.get("duration_ms", 0)
#             minute = dur_ms // 60000
#             second = (dur_ms % 60000) // 1000
#             duration = f"{minute}:{second:02d}"

#             artists = [a.get("name") for a in item.get("artists", [])]
#             album = item.get("album", {})
#             images = album.get("images", [])
#             thumbnail = images[-1]["url"] if images else None

#             data.append({
#                 "title": item.get("name"),
#                 "artists": artists,
#                 "duration": duration,
#                 "album": album.get("name") if album else None,
#                 "thumbnail": thumbnail,
#                 "preview_url": item.get("preview_url"),
#                 "spotify_url": item.get("external_urls", {}).get("spotify"),
#                 "popularity": item.get("popularity"),
#                 "release_date": album.get("release_date") if album else None,
#             })
#         return data

#     def _format_artists(self, items):
#         data = []
#         for item in items:
#             images = item.get("images", [])
#             data.append({
#                 "name": item.get("name"),
#                 "genres": item.get("genres", []),
#                 "followers": item.get("followers", {}).get("total"),
#                 "popularity": item.get("popularity"),
#                 "spotify_url": item.get("external_urls", {}).get("spotify"),
#                 "thumbnail": images[0]["url"] if images else None,
#             })
#         return data

#     def _format_albums(self, items):
#         data = []
#         for item in items:
#             images = item.get("images", [])
#             artists = [a.get("name") for a in item.get("artists", [])]
#             data.append({
#                 "name": item.get("name"),
#                 "artists": artists,
#                 "release_date": item.get("release_date"),
#                 "total_tracks": item.get("total_tracks"),
#                 "thumbnail": images[0]["url"] if images else None,
#                 "spotify_url": item.get("external_urls", {}).get("spotify"),
#             })
#         return data


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.renderers import JSONRenderer
from ytmusicapi import YTMusic

class MusicSearchAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.ytmusic = YTMusic()

    def options(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK)
    
    def get(self, request):
        try:
            search_type = request.GET.get('type', 'song').strip()  # Loại tìm kiếm (song, artist, top_views, id)

            # Tìm theo ID cụ thể của bài nhạc
            if search_type == 'id':
                video_id = request.GET.get('id', '').strip()
                if not video_id:
                    return Response({'error': 'Thiếu tham số `id`'}, status=status.HTTP_400_BAD_REQUEST)

                song_info = self.ytmusic.get_song(video_id)
                video_details = song_info.get("videoDetails", {})
                microformat = song_info.get("microformat", {}).get("microformatDataRenderer", {})

                # Kiểm tra thông tin cần thiết
                if not all([video_details.get("videoId"), video_details.get("title")]):
                    return Response({'error': 'Không tìm thấy thông tin bài nhạc'}, status=status.HTTP_404_NOT_FOUND)

                response_data = {
                    "id": video_details.get("videoId"),
                    "title": video_details.get("title"),
                    "videoId": video_details.get("videoId"),
                    "url": f"https://music.youtube.com/watch?v={video_details.get('videoId')}",
                    "duration": video_details.get("lengthSeconds"),
                    "views": int(video_details.get("viewCount", 0)),
                    "author": video_details.get("author"),
                    "thumbnail": video_details.get("thumbnail", {}).get("thumbnails", [{}])[-1].get("url"),
                    "description": microformat.get("description"),
                    "publishDate": microformat.get("publishDate"),
                }
                return Response(response_data, status=status.HTTP_200_OK)

            # Truy vấn theo từ khóa (song, artist, top_views)
            query = request.GET.get('q', '').strip()
            if not query:
                return Response({'error': 'Thiếu tham số `q`'}, status=status.HTTP_400_BAD_REQUEST)

            if search_type in ['song', 'artist', 'top_views']:
                results = self.ytmusic.search(query, filter='songs', limit=30)
            else:
                return Response({'error': 'Loại tìm kiếm không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)

            # Nếu là top_views thì sắp xếp
            if search_type == 'top_views':
                results.sort(key=lambda x: self._parse_views(x.get("views", "0")), reverse=True)

            filtered = []
            for item in results:
                if not all([
                    item.get("videoId"),
                    item.get("title"),
                    item.get("artists"),
                    item.get("views"),
                    item.get("album")
                ]):
                    continue

                artist_names = [a.get("name", "").lower() for a in item["artists"]]
                if any(name in ["various artists", "topic"] for name in artist_names):
                    continue

                if not any(a.get("id") for a in item["artists"]):
                    continue

                filtered.append({
                    "id": item["videoId"],
                    "title": item["title"],
                    "videoId": item["videoId"],
                    "url": f"https://music.youtube.com/watch?v={item['videoId']}",
                    "duration": item.get("duration"),
                    "artists": [a.get("name") for a in item["artists"]],
                    "album": item["album"].get("name") if item.get("album") else None,
                    "albumId": item["album"].get("id") if item.get("album") else None,
                    "views": self._parse_views(item.get("views")),
                    "thumbnail": item["thumbnails"][-1]["url"] if item.get("thumbnails") else None,
                })

            return Response(filtered, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Lỗi xử lý server: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    # def get(self, request):
    #     try:
    #         query = request.GET.get('q', '').strip()  # Truy vấn bài hát hoặc nghệ sĩ
    #         search_type = request.GET.get('type', 'song')  # Loại tìm kiếm (song, artist, top_views)

    #         if not query:
    #             return Response(
    #                 {'error': 'Thiếu tham số `q`'}, 
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         # Tìm kiếm bài hát theo tên bài hát hoặc nghệ sĩ
    #         if search_type == 'artist':
    #             results = self.ytmusic.search(query, filter='songs', limit=30)
    #         elif search_type == 'song':
    #             results = self.ytmusic.search(query, filter='songs', limit=30)
    #         elif search_type == 'top_views':
    #             results = self.ytmusic.search(query, filter='songs', limit=30)
    #             results.sort(key=lambda x: self._parse_views(x.get("views", "0")), reverse=True)
    #         else:
    #             return Response(
    #                 {'error': 'Loại tìm kiếm không hợp lệ'},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         filtered = []
    #         for item in results:
    #             # Loại bỏ các mục không có thông tin views hoặc nghệ sĩ hoặc album
    #             if not all([item.get("videoId"), item.get("title"), item.get("artists"), item.get("views"), item.get("album")]):
    #                 continue

    #             # Bỏ qua các kênh tổng hợp như "Various Artists" hoặc "Topic"
    #             artist_names = [a.get("name", "").lower() for a in item["artists"]]
    #             if any(name in ["various artists", "topic"] for name in artist_names):
    #                 continue

    #             # Đảm bảo có ít nhất 1 nghệ sĩ có link
    #             if not any(a.get("id") for a in item["artists"]):
    #                 continue

    #             filtered.append({
    #                 "title": item["title"],
    #                 "videoId": item["videoId"],
    #                 "url": f"https://music.youtube.com/watch?v={item['videoId']}",
    #                 "duration": item.get("duration"),
    #                 "artists": [a.get("name") for a in item["artists"]],
    #                 "album": item["album"].get("name") if item.get("album") else None,
    #                 "albumId": item["album"].get("id") if item.get("album") else None,
    #                 "views": self._parse_views(item.get("views")),
    #                 "thumbnail": item["thumbnails"][-1]["url"] if item.get("thumbnails") else None,
    #             })

    #         return Response(filtered, status=status.HTTP_200_OK)

    #     except Exception as e:
    #         return Response(
    #             {'error': f'Lỗi xử lý server: {str(e)}'},
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #         )

    def _parse_views(self, view_str):
        # Ví dụ view_str: "3.5M views"
        try:
            s = view_str.lower().replace('views', '').strip()
            if 'k' in s:
                return float(s.replace('k','')) * 1_000
            if 'm' in s:
                return float(s.replace('m','')) * 1_000_000
            if 'b' in s:
                return float(s.replace('b','')) * 1_000_000_000
            return float(s.replace(',',''))
        except:
            return 0



# music/views.py

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.renderers import JSONRenderer       # ← Import renderer
# from youtubesearchpython import VideosSearch
# from ytmusicapi import YTMusic

# class MusicSearchAPIView(APIView):
#     renderer_classes = [JSONRenderer]                    # ← Chỉ trả JSON

#     def __init__(self, **kwargs):
#         super().__init__(**kwargs)
#         self.yt_music = YTMusic()

#     def options(self, request, *args, **kwargs):
#         # Hỗ trợ preflight CORS
#         return Response(status=status.HTTP_200_OK)

#     def get(self, request):
#         try:
#             query = request.GET.get('q', '').strip()
#             search_type = request.GET.get('type', '')

#             if not query:
#                 if search_type == 'music_only':
#                     query = 'top trending music lyrics audio'
#                 elif search_type == 'music_video':
#                     query = 'top trending music official video'
#                 else:
#                     return Response(
#                         {'error': 'Thiếu tham số `q` hoặc `type` không hợp lệ'}, 
#                         status=status.HTTP_400_BAD_REQUEST
#                     )

#             # Tìm kiếm theo loại
#             if search_type == 'music_video':
#                 search_query = f"{query} official video"
#             elif search_type == 'music_only':
#                 search_query = f"{query} lyrics audio"
#             else:
#                 search_query = query

#             videos_search = VideosSearch(search_query, limit=30)
#             results = videos_search.result().get('result', [])

#             data = []
#             for item in results:
#                 title = item.get('title', '')
#                 duration = item.get('duration', '')
#                 if not duration or ':' not in duration:
#                     continue

#                 try:
#                     minutes = int(duration.split(':')[0])
#                 except ValueError:
#                     continue

#                 title_lower = title.lower()

#                 if search_type == 'music_only':
#                     if not any(bad in title_lower for bad in ['official video','mv','live','concert']) \
#                     and any(kw in title_lower for kw in ['lyrics','audio']) \
#                     and 1 <= minutes <= 10:
#                         lyrics = self._get_lyrics(item.get('link'), item.get('descriptionSnippet'))
#                         data.append(self._format(item, music_only=True, lyrics=lyrics))

#                 elif search_type == 'music_video':
#                     if any(kw in title_lower for kw in ['official video', 'mv']) \
#                     and 1 <= minutes <= 10:
#                         data.append(self._format(item))

#             # Nếu không có query cụ thể → là dạng lấy top → sắp xếp theo view
#             if not request.GET.get('q'):
#                 data.sort(key=lambda x: self._parse_views(x.get('viewCount', '0')), reverse=True)

#             return Response(data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response(
#                 {'error': f'Lỗi xử lý server: {str(e)}'},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )


#     def _format(self, item, music_only=False, lyrics=None):
#         link = item.get('link', '')
#         vid = link.split("watch?v=")[-1] if "watch?v=" in link else None
#         if music_only and vid:
#             link = f"https://music.youtube.com/watch?v={vid}"

#         res = {
#             'title': item.get('title'),
#             'duration': item.get('duration'),
#             'channel': item.get('channel', {}).get('name'),
#             'link': link,
#             'thumbnail': item.get('thumbnails', [{}])[0].get('url'),
#             'viewCount': item.get('viewCount', {}).get('short'),
#             'publishedTime': item.get('publishedTime'),
#         }
#         if music_only and lyrics:
#             res['lyrics'] = lyrics
#         return res

#     def _get_lyrics(self, link, snippet=None):
#         vid = link.split("watch?v=")[-1] if "watch?v=" in link else None
#         if not vid:
#             return None
#         try:
#             song = self.yt_music.get_song(vid)
#             return song.get('lyrics')
#         except Exception:
#             # fallback về snippet nếu có
#             return '\n'.join(d.get('text','') for d in (snippet or []))

#     def _parse_views(self, vstr):
#         try:
#             s = vstr.lower().replace('views','').strip()
#             if 'k' in s: return float(s.replace('k','')) * 1_000
#             if 'm' in s: return float(s.replace('m','')) * 1_000_000
#             if 'b' in s: return float(s.replace('b','')) * 1_000_000_000
#             return float(s.replace(',',''))
#         except:
#             return 0
