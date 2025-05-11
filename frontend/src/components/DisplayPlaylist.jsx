import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MusicSliderSection from "./MusicSliderSection";
import { PlayerContext } from "../context/PlayerContext";
import Navbar from "./Navbar";

const DisplayPlaylist = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playWithId } = useContext(PlayerContext);

  const getUserInfo = () => {
    // Hàm lấy thông tin người dùng từ localStorage
    return JSON.parse(localStorage.getItem("user_info"));
  };

  const fetchSongs = async () => {
    try {
      const userInfo = getUserInfo();
      const playlist = userInfo?.playlists?.find((p) => p.name === name);
      if (!playlist) {
        console.error("Playlist not found");
        setLoading(false);
        return;
      }

      const songIds = playlist.song_ids || [];
      // console.log(songIds);

      const songDetails = await Promise.all(
        songIds.map(async (id) => {
          const res = await fetch(
            `http://127.0.0.1:8000/api/music/search/?type=id&id=${id}`
          );
          const data = await res.json();
          return data; // vì response là mảng chứa 1 phần tử
        })
      );

      setSongs(songDetails);
    } catch (err) {
      console.error("Lỗi khi lấy bài hát:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
    // console.log(songs);
  }, [name]);

  useEffect(() => {
    const handleStorageChange = () => {
      // Lắng nghe thay đổi trong localStorage và trigger lại fetchSongs
      fetchSongs();
    };

    // Lắng nghe sự thay đổi của localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="p-4 text-white">
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-blue-400 underline hover:text-blue-200"
        >
          Return
        </button>
        <h2 className="text-2xl font-bold mb-4">Playlist: {name}</h2>
        {songs.length > 0 ? (
          <MusicSliderSection
            title="Song list:"
            songs={songs}
            onClickSong={(song) => playWithId(song, songs)}
            fetchSongs={fetchSongs}
          />
        ) : (
          <p>Playlist hiện chưa có bài hát nào.</p>
        )}
      </div>
    </>
  );
};

export default DisplayPlaylist;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import MusicSliderSection from "./MusicSliderSection";

// const DisplayPlaylist = () => {
//   const { name } = useParams();
//   const navigate = useNavigate();
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSongs = async () => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem("user_info"));
//         const playlist = userInfo?.playlists?.find((p) => p.name === name);
//         if (!playlist) {
//           console.error("Playlist not found");
//           setLoading(false);
//           return;
//         }

//         const songIds = playlist.song_ids || [];

//         const songDetails = await Promise.all(
//           songIds.map(async (id) => {
//             const res = await fetch(`http://127.0.0.1:8000/api/music/search/?q=${id}`);
//             const data = await res.json();
//             return data[0]; // vì response là mảng chứa 1 phần tử
//           })
//         );

//         setSongs(songDetails);
//       } catch (err) {
//         console.error("Lỗi khi lấy bài hát:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSongs();
//   }, [name]);

//   if (loading) return <div className="text-white p-4">Loading...</div>;

//   return (
//     <div className="p-4 text-white">
//       <button
//         onClick={() => navigate("/")}
//         className="mb-4 text-blue-400 underline hover:text-blue-200"
//       >
//         Return
//       </button>
//       <h2 className="text-2xl font-bold mb-4">Playlist: {name}</h2>
//       {songs.length > 0 ? (
//         <MusicSliderSection title="Danh sách bài hát" songs={songs} onClickSong={() => {}} />
//       ) : (
//         <p>Playlist hiện chưa có bài hát nào.</p>
//       )}
//     </div>
//   );
// };

// export default DisplayPlaylist;
