import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MusicSliderSection from "../components/MusicSliderSection";
import { PlayerContext } from "../context/PlayerContext";
import axios from "../utils/axiosConfig";

const DisplayPlaylist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playWithId } = useContext(PlayerContext);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`/playlists/${id}`);
      if (!response) {
        console.error("Playlist not found");
        setLoading(false);
        return;
      }
      const playlist = response.data;

      const songsData = playlist.songs || [];
      // console.log(songIds);

      // const songDetails = await Promise.all(
      //   songIds.map(async (id) => {
      //     const res = await fetch(
      //       `http://127.0.0.1:8000/api/music/search/?type=id&id=${id}`
      //     );
      //     const data = await res.json();
      //     return data; // vì response là mảng chứa 1 phần tử
      //   })
      // );

      setSongs(songsData);
    } catch (err) {
      console.error("Lỗi khi lấy bài hát:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [id]);

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     // Lắng nghe thay đổi trong localStorage và trigger lại fetchSongs
  //     fetchSongs();
  //   };

  //   // Lắng nghe sự thay đổi của localStorage
  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <>
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
