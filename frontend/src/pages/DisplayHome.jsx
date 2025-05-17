// DisplayHome.jsx
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "../utils/axiosConfig";
import MusicSliderSection from "../components/MusicSliderSection";
import { PlayerContext } from "../context/PlayerContext";

const DisplayHome = () => {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songsPage, setSongsPage] = useState(0);
  const [albumsPage, setAlbumsPage] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 6;
  const { playWithId } = useContext(PlayerContext);
  const location = useLocation();

  const paginate = (arr, page) =>
    arr?.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [songsPage, albumsPage, searchPage]);

  useEffect(() => {
    const fetchMusicData = async () => {
      setIsLoading(true);
      try {
        const [res1, res2] = await Promise.allSettled([
          axios.get("/songs/"),
          axios.get("/albums/"),
        ]);

        if (res1.status === "fulfilled") setSongs(res1.value.data);
        if (res2.status === "fulfilled") setAlbums(res2.value.data);
      } catch (error) {
        console.error("Unexpected error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicData();
  }, []);

  useEffect(() => {
    if (
      location.state?.searchResults &&
      Array.isArray(location.state.searchResults)
    ) {
      setSearchResults(location.state.searchResults);
      setSearchPage(0);
    } else {
      setSearchResults([]);
    }
  }, [location.state]);

  // console.log(songs);
  // console.log(songsPage);
  

  const renderMusicSlider = (title, songs, currentPage, setPage, allSongs) => (
    <MusicSliderSection
      title={title}
      songs={paginate(songs, currentPage)}
      onClickSong={(song) => playWithId(song, allSongs)}
      onPrevPage={() => {setPage(Math.max(0, currentPage - 1)); console.log(111);
      }}
      onNextPage={() =>
        setPage(
          Math.min(Math.ceil(songs.length / itemsPerPage) - 1, currentPage + 1)
        )
      }
    />
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden px-4 box-border">
      {/* Thêm overflow-hidden và padding để gọn trong cha */}
      {searchResults.length > 0 ? (
        renderMusicSlider(
          "Results",
          searchResults,
          searchPage,
          setSearchPage,
          searchResults
        )
      ) : (
        <>
          {songs.length > 0 &&
            renderMusicSlider("Songs", songs, songsPage, setSongsPage, songs)}
          {albums.length > 0 &&
            renderMusicSlider(
              "Albums",
              albums,
              albumsPage,
              setAlbumsPage,
              albums
            )}
          {songs.length === 0 && albums.length === 0 && (
            <p className="text-white text-lg px-6 pt-6">
              No songs or ablums found.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default DisplayHome;
