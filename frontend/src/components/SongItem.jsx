import { useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import defaultImage from "../assets/default.png";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../utils/axiosConfig";

const SongItem = ({ song, onPlay, onRemoved }) => {
  const { playWithId } = useContext(PlayerContext);
  const [imgSrc, setImgSrc] = useState(song?.cover_image || defaultImage);
  const [showPopup, setShowPopup] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [songInPlaylists, setSongInPlaylists] = useState([]);

  const location = useLocation();
  const popupRef = useRef(null);

  const isPlaylistPage = location.pathname.startsWith("/playlist/");

  // Lấy danh sách playlist của user và kiểm tra bài hát thuộc playlist nào
  const fetchPlaylists = async () => {
    try {
      const res = await axios("/accounts/playlists/");
      const data = res.data;
      setUserPlaylists(data || []);

      const playlistsWithSong = data.filter((p) =>
        p.songs.some((s) => s === song?.id)
      );

      setSongInPlaylists(playlistsWithSong);
    } catch (err) {
      console.error("Error fetching playlists", err);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [song]);

  // Click ngoài popup để đóng
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    playWithId(song);
    if (onPlay) onPlay();
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    setShowPopup(true);
  };


  const handleSelectPlaylist = async (playlist) => {
  if (!playlist || !song || !song.id) return;

  const playlistTemplate = userPlaylists.find((p) => p.id === playlist.id);
  if (!playlistTemplate) return;

  // Chuyển tất cả phần tử thành ID
  const currentSongIds = (playlistTemplate.songs || []).map((s) =>
    typeof s === "object" && s !== null ? s.id : s
  );

  // Nếu đã tồn tại thì không thêm
  if (currentSongIds.includes(song.id)) {
    setShowPopup(false);
    return;
  }

  const updatedSongs = [...currentSongIds, song.id];

  try {
    const res = await axios.patch(
      `/accounts/playlists/${playlistTemplate.id}/`,
      { songs: updatedSongs }
    );

    if (res.status >= 200 && res.status < 300) {
      await fetchPlaylists();
    }
  } catch (err) {
    console.error("Lỗi khi thêm bài hát vào playlist:", err);
  } finally {
    setShowPopup(false);
  }
};


  const handleRemoveFromPlaylist = async () => {
    if (!songInPlaylists?.length) return;
    const playlist = songInPlaylists[0];

    // Lọc id bài hát ra khỏi mảng songs
    const updatedSongs = playlist.songs.filter((s) =>
      // nếu playlist.songs là mảng id, dùng s !== song.id
      // nếu là mảng object, dùng s.id !== song.id
      typeof s === "object" ? s.id !== song.id : s !== song.id
    );

    try {
      // gửi payload đúng format: { songs: [...] }
      const res = await axios.patch(`/accounts/playlists/${playlist.id}/`, {
        songs: updatedSongs,
      });

      if (res.status >= 200 && res.status < 300) {
        // callback trước khi reload nếu cần
        onRemoved && onRemoved();
        // load lại playlists để UI cập nhật
        await fetchPlaylists();
      } else {
        console.error("Update failed:", res.status, res.data);
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài hát khỏi playlist:", error);
    } finally {
      setShowRemoveModal(false);
    }
  };

  return (
    <div
      className="relative bg-black rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-full h-64 overflow-hidden">
        <img
          src={imgSrc}
          alt={song?.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(defaultImage)}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <h3 className="text-sm font-semibold line-clamp-2 text-white">
          {song?.title}
        </h3>
        {song?.artist && <p className="text-xs text-gray-300">{song.artist}</p>}
      </div>

      {/* Nút thêm hoặc xóa */}
      {!isPlaylistPage ? (
        <button
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full z-10 w-8 h-8"
          onClick={handleAddToPlaylist}
        >
          <PlaylistAddIcon fontSize="small" />
        </button>
      ) : (
        songInPlaylists.length > 0 && (
          <button
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full z-10 w-8 h-8"
            onClick={(e) => {
              e.stopPropagation();
              setShowRemoveModal(true);
            }}
          >
            <CloseIcon fontSize="small" />
          </button>
        )
      )}

      {/* Modal xác nhận xóa */}
      {showRemoveModal && isPlaylistPage && (
        <div
          className="absolute top-10 left-2 z-20 bg-black/90 text-white rounded-lg shadow-lg w-48 p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Are you sure?</span>
            <button onClick={() => setShowRemoveModal(false)}>
              <CloseIcon
                fontSize="small"
                className="text-gray-300 hover:text-white"
              />
            </button>
          </div>
          <div className="flex justify-between text-sm">
            <button
              className="px-3 py-1 bg-green-500 rounded-lg text-white"
              onClick={handleRemoveFromPlaylist}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-red-500 rounded-lg text-white"
              onClick={() => setShowRemoveModal(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Popup thêm bài vào playlist */}
      {showPopup && !isPlaylistPage && (
        <div
          className="absolute top-10 left-2 z-20 bg-black/90 text-white rounded-lg shadow-lg w-48 p-3"
          onClick={(e) => e.stopPropagation()}
          ref={popupRef}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Add to Playlist</span>
            <button onClick={() => setShowPopup(false)}>
              <CloseIcon
                fontSize="small"
                className="text-gray-300 hover:text-white"
              />
            </button>
          </div>
          <ul className="space-y-1 text-sm">
            {userPlaylists
              .filter((playlist) => !playlist.songs.some((s) => s === song.id))
              .map((playlist) => (
                <li
                  key={playlist.id}
                  className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
                  onClick={() => handleSelectPlaylist(playlist)}
                >
                  {playlist.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SongItem;
