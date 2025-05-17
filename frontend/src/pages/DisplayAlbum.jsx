import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import RenderSlider from "../components/RenderSlider";

const DisplayAlbum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [songsPage, setSongsPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/albums/${id}/`);
      if (!response || !response.data) {
        console.error("Album not found or empty response");
        setSongs([]);
        setLoading(false);
        return;
      }

      const album = response.data;

      // if (!Array.isArray(album.songs) || album.songs.length === 0) {
      //   setSongs([]);
      //   setLoading(false);
      //   return;
      // }

      // const songPromises = album.songs.map((songId) =>
      //   axios.get(`/songs/${songId}/`)
      // );
      // const songsResponses = await Promise.all(songPromises);
      // const songsData = songsResponses.map((res) => res.data);

      setSongs(album.songs);
    } catch (err) {
      console.error("Lỗi khi lấy bài hát trong album:", err);
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
      <h2 className="text-2xl font-bold mb-4">Album: {id}</h2>
      {songs.length > 0 ? (
        <RenderSlider
          title="Songs"
          items={songs}
          currentPage={songsPage}
          setPage={setSongsPage}
          allItems={songs}
          type="song"
        />
      ) : (
        <p>Album hiện chưa có bài hát nào.</p>
      )}
    </div>
  );
};

export default DisplayAlbum;
