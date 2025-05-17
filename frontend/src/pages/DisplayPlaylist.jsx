import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import axios from "../utils/axiosConfig";
import SliderSection from "../components/SliderSection";
import RenderSlider from "../components/RenderSlider";

const DisplayPlaylist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [songsPage, setSongsPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/accounts/playlists/${id}/`);
      if (!response || !response.data) {
        console.error("Playlist not found or empty response");
        setSongs([]);
        setLoading(false);
        return;
      }

      const playlist = response.data;

      if (!Array.isArray(playlist.songs) || playlist.songs.length === 0) {
        setSongs([]);
        setLoading(false);
        return;
      }

      // Lấy tất cả bài hát trong playlist
      const songPromises = playlist.songs.map((songId) =>
        axios.get(`/songs/${songId}/`)
      );

      const songsResponses = await Promise.all(songPromises);
      const songsData = songsResponses.map((res) => res.data);

      setSongs(songsData);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [id]);

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="top-0 left-0 w-full h-full p-4 text-white">
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-400 underline hover:text-blue-200"
      >
        Return
      </button>
      <h2 className="text-2xl font-bold mb-4">Playlist: {id}</h2>
      {songs.length > 0 ? (
        <RenderSlider
          title="Songs"
          items={songs}
          currentPage={songsPage}
          setPage={setSongsPage}
          allItems={songs}
          type="song"
          fetchSongs={fetchSongs}
        />
      ) : (
        <p>Playlist hiện chưa có bài hát nào.</p>
      )}
    </div>
  );
};

export default DisplayPlaylist;



// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { PlayerContext } from "../context/PlayerContext";
// import axios from "../utils/axiosConfig";
// import SliderSection from "../components/SliderSection";

// const DisplayPlaylist = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { playWithId } = useContext(PlayerContext);

//   const fetchSongs = async () => {
//     try {
//       const response = await axios.get(`/accounts/playlists/${id}/`);
//       if (!response) {
//         console.error("Playlist not found");
//         setLoading(false);
//         return;
//       }
//       const playlist = response.data;

//       // Tạo một mảng promise cho từng request lấy bài hát
//       const songPromises = playlist.songs.map((s) =>
//          axios.get(`/songs/${s}/`)
//       );

//       // Đợi tất cả promise hoàn thành, kết quả là mảng response
//       const songsResponses = await Promise.all(songPromises);

//       // Lấy data bài hát từ response
//       console.log(songsResponses);
      
//       const songsData = songsResponses.map((res) => res.data);

//       setSongs(songsData);
//     } catch (err) {
//       console.error("Lỗi khi lấy bài hát:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {fetchSongs()}, [])

//   if (loading) return <div className="text-white p-4">Loading...</div>;

//   return (
//     <>
//       <div className="top-0 left-0 w-full h-full p-4 text-white">
//         <button
//           onClick={() => navigate("/")}
//           className="mb-4 text-blue-400 underline hover:text-blue-200"
//         >
//           Return
//         </button>
//         <h2 className="text-2xl font-bold mb-4">Playlist: {id}</h2>
//         {songs.length > 0 ? (
//           <SliderSection
//             title=""
//             items={songs}

//             onClickSong={(song) => playWithId(song, songs)}
//             fetchSongs={fetchSongs}
//           />
//         ) : (
//           <p>Playlist hiện chưa có bài hát nào.</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default DisplayPlaylist;
