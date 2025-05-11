import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MusicSliderSection from "../components/MusicSliderSection";
import { PlayerContext } from "../context/PlayerContext";
import Navbar from "./Navbar";

const DisplayHome = () => {
  const [topView, setTopView] = useState([]);
  const [artist, setArtist] = useState([]);
  const [topViewPage, setTopViewPage] = useState(0);
  const [artistPage, setArtistPage] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("user_info"))); // Lưu user_info từ localStorage

  const itemsPerPage = 6;
  const { playWithId } = useContext(PlayerContext);
  const location = useLocation();

  const paginate = (arr, page) =>
    arr?.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // Auto scroll to top when switching pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [topViewPage, artistPage, searchPage]);

  useEffect(() => {
    const fetchMusicData = async () => {
      setIsLoading(true);
      try {
        const [res1, res2] = await Promise.allSettled([
          axios.get("http://127.0.0.1:8000/api/music/search/?q=pop&type=top_views"),
          axios.get("http://127.0.0.1:8000/api/music/search/?q=justin+bieber&type=artist"),
        ]);

        if (res1.status === "fulfilled") setTopView(res1.value.data);
        if (res2.status === "fulfilled") setArtist(res2.value.data);
      } catch (error) {
        console.error("Unexpected error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicData();
  }, []);

  useEffect(() => {
    if (location.state?.searchResults && Array.isArray(location.state.searchResults)) {
      setSearchResults(location.state.searchResults);
      setSearchPage(0);
    } else {
      setSearchResults([]);
    }
  }, [location.state]);

  // Lắng nghe sự thay đổi của localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      // Khi user_info thay đổi, lấy lại dữ liệu và cập nhật lại component
      const updatedUserInfo = JSON.parse(localStorage.getItem("user_info"));
      setUserInfo(updatedUserInfo);
    };

    // Lắng nghe sự thay đổi của localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const renderMusicSlider = (title, songs, currentPage, setPage, allSongs) => (
    <MusicSliderSection
      title={title}
      songs={paginate(songs, currentPage)}
      onClickSong={(song) => playWithId(song, allSongs)}
      onPrevPage={() => setPage(Math.max(0, currentPage - 1))}
      onNextPage={() =>
        setPage(Math.min(Math.ceil(songs.length / itemsPerPage) - 1, currentPage + 1))
      }
    />
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {searchResults.length > 0 ? (
        renderMusicSlider("Results", searchResults, searchPage, setSearchPage, searchResults)
      ) : (
        <>
          {topView.length > 0 &&
            renderMusicSlider("Pop", topView, topViewPage, setTopViewPage, topView)}
          {artist.length > 0 &&
            renderMusicSlider("Justin Bieber", artist, artistPage, setArtistPage, artist)}
          {topView.length === 0 && artist.length === 0 && (
            <p className="text-white text-lg px-6 pt-6">No music found.</p>
          )}
        </>
      )}
    </>
  );
};

export default DisplayHome;





// import React, { useEffect, useState, useContext } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import MusicSliderSection from "../components/MusicSliderSection";
// import { PlayerContext } from "../context/PlayerContext";
// import Navbar from "./Navbar";

// const DisplayHome = () => {
//   const [topView, setTopView] = useState([]);
//   const [artist, setArtist] = useState([]);
//   const [topViewPage, setTopViewPage] = useState(0);
//   const [artistPage, setArtistPage] = useState(0);
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchPage, setSearchPage] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   const itemsPerPage = 6;
//   const { playWithId } = useContext(PlayerContext);
//   const location = useLocation();

//   const paginate = (arr, page) =>
//     arr?.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

//   // Auto scroll to top when switching pages
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [topViewPage, artistPage, searchPage]);

//   useEffect(() => {
//     const fetchMusicData = async () => {
//       setIsLoading(true);
//       try {
//         const [res1, res2] = await Promise.allSettled([
//           axios.get("http://127.0.0.1:8000/api/music/search/?q=pop&type=top_views"),
//           axios.get("http://127.0.0.1:8000/api/music/search/?q=justin+bieber&type=artist"),
//         ]);

//         if (res1.status === "fulfilled") setTopView(res1.value.data);
//         if (res2.status === "fulfilled") setArtist(res2.value.data);
//       } catch (error) {
//         console.error("Unexpected error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMusicData();
//   }, []);

//   useEffect(() => {
//     if (location.state?.searchResults && Array.isArray(location.state.searchResults)) {
//       setSearchResults(location.state.searchResults);
//       setSearchPage(0);
//     } else {
//       setSearchResults([]);
//     }
//   }, [location.state]);

//   const renderMusicSlider = (title, songs, currentPage, setPage, allSongs) => (
//     <MusicSliderSection
//       title={title}
//       songs={paginate(songs, currentPage)}
//       onClickSong={(song) => playWithId(song, allSongs)}
//       onPrevPage={() => setPage(Math.max(0, currentPage - 1))}
//       onNextPage={() =>
//         setPage(Math.min(Math.ceil(songs.length / itemsPerPage) - 1, currentPage + 1))
//       }
//     />
//   );

//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="flex justify-center items-center h-96">
//           <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       {searchResults.length > 0 ? (
//         renderMusicSlider("Results", searchResults, searchPage, setSearchPage, searchResults)
//       ) : (
//         <>
//           {topView.length > 0 &&
//             renderMusicSlider("Pop", topView, topViewPage, setTopViewPage, topView)}
//           {artist.length > 0 &&
//             renderMusicSlider("Justin Bieber", artist, artistPage, setArtistPage, artist)}
//           {topView.length === 0 && artist.length === 0 && (
//             <p className="text-white text-lg px-6 pt-6">No music found.</p>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default DisplayHome;




// import React, { useEffect, useState, useContext } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import MusicSliderSection from "../components/MusicSliderSection";
// import { PlayerContext } from "../context/PlayerContext";
// import Navbar from "./Navbar";

// const DisplayHome = () => {
//   const [topView, setTopView] = useState([]);
//   const [artist, setArtist] = useState([]);
//   const [topViewPage, setTopViewPage] = useState(0);
//   const [artistPage, setArtistPage] = useState(0);
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchPage, setSearchPage] = useState(0);
//   const [isLoading, setIsLoading] = useState(true); // loading state

//   const itemsPerPage = 6;
//   const { playWithId } = useContext(PlayerContext);
//   const location = useLocation();

//   const paginate = (arr, page) =>
//     arr?.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

//   useEffect(() => {
//     const fetchMusicData = async () => {
//       try {
//         setIsLoading(true);
//         const [res1, res2] = await Promise.allSettled([
//           axios.get(
//             "http://127.0.0.1:8000/api/music/search/?q=pop&type=top_views"
//           ),
//           axios.get(
//             "http://127.0.0.1:8000/api/music/search/?q=justin+bieber&type=artist"
//           ),
//         ]);

//         if (res1.status === "fulfilled") {
//           setTopView(res1.value.data);
//         }

//         if (res2.status === "fulfilled") {
//           setArtist(res2.value.data);
//         }
//       } catch (error) {
//         console.error("Unexpected error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMusicData();
//   }, []);

//   useEffect(() => {
//     if (location.state && location.state.searchResults) {
//       const results = location.state.searchResults;
//       if (Array.isArray(results)) {
//         setSearchResults(results);
//         setSearchPage(0);
//       } else {
//         setSearchResults([]);
//       }
//     } else {
//       setSearchResults([]);
//     }
//   }, [location.state]);

//   const renderSearchResults = () => {
//     if (searchResults.length === 0) {
//       return (
//         <>
//           <Navbar />
//           <p className="text-white text-lg px-6 pt-6">Not Found.</p>
//         </>
//       );
//     }

//     return (
//       <>
//         <Navbar />
//         <MusicSliderSection
//           title="Results"
//           songs={paginate(searchResults, searchPage)}
//           onClickSong={(song) => playWithId(song, searchResults)}
//           onPrevPage={() => setSearchPage(Math.max(0, searchPage - 1))}
//           onNextPage={() =>
//             setSearchPage(
//               Math.min(
//                 Math.ceil(searchResults.length / itemsPerPage) - 1,
//                 searchPage + 1
//               )
//             )
//           }
//         />
//       </>
//     );
//   };

//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="flex justify-center items-center h-96">
//           <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       {searchResults.length > 0 ? (
//         renderSearchResults()
//       ) : (
//         <>
//           <Navbar />
//           <MusicSliderSection
//             title="Pop"
//             songs={paginate(topView, topViewPage)}
//             onClickSong={(song) => playWithId(song, topView)}
//             onPrevPage={() => setTopViewPage(Math.max(0, topViewPage - 1))}
//             onNextPage={() =>
//               setTopViewPage(
//                 Math.min(
//                   Math.ceil(topView.length / itemsPerPage) - 1,
//                   topViewPage + 1
//                 )
//               )
//             }
//           />
//           <MusicSliderSection
//             title="Justin Bieber"
//             songs={paginate(artist, artistPage)}
//             onClickSong={(song) => playWithId(song, artist)}
//             onPrevPage={() => setArtistPage(Math.max(0, artistPage - 1))}
//             onNextPage={() =>
//               setArtistPage(
//                 Math.min(
//                   Math.ceil(artist.length / itemsPerPage) - 1,
//                   artistPage + 1
//                 )
//               )
//             }
//           />
//         </>
//       )}
//     </>
//   );
// };

// export default DisplayHome;

// import React, { useEffect, useState, useContext } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import MusicSliderSection from "../components/MusicSliderSection";
// import { PlayerContext } from "../context/PlayerContext";

// const DisplayHome = () => {
//   const [topView, setTopView] = useState([]);
//   const [artist, setArtist] = useState([]);
//   const [topViewPage, setTopViewPage] = useState(0);
//   const [artistPage, setArtistPage] = useState(0);
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchPage, setSearchPage] = useState(0);

//   const itemsPerPage = 6;
//   const { playWithId } = useContext(PlayerContext);
//   const location = useLocation();

//   const paginate = (arr, page) =>
//     arr?.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

//   useEffect(() => {
//     const fetchMusicData = async () => {
//       try {
//         const [res1, res2] = await Promise.allSettled([
//           axios.get("http://127.0.0.1:8000/api/music/search/?q=pop&type=top_views"),
//           axios.get("http://127.0.0.1:8000/api/music/search/?q=justin+bieber&type=artist"),
//         ]);

//         if (res1.status === "fulfilled") {
//           setTopView(res1.value.data);
//         }

//         if (res2.status === "fulfilled") {
//           setArtist(res2.value.data);
//         }
//       } catch (error) {
//         console.error("Unexpected error fetching data:", error);
//       }
//     };

//     fetchMusicData();
//   }, []);

//   useEffect(() => {
//     if (location.state && location.state.searchResults) {
//       const results = location.state.searchResults;
//       if (Array.isArray(results)) {
//         setSearchResults(results);
//         setSearchPage(0);
//       } else {
//         setSearchResults([]);
//       }
//     } else {
//       setSearchResults([]);
//     }
//   }, [location.state]);

//   const renderSearchResults = () => {
//     if (searchResults.length === 0) {
//       return <p className="text-white text-lg px-6 pt-6">Không tìm thấy kết quả phù hợp.</p>;
//     }

//     return (
//       <MusicSliderSection
//         title="Kết quả tìm kiếm"
//         songs={paginate(searchResults, searchPage)}
//         onClickSong={(song) => playWithId(song, searchResults)}
//         onPrevPage={() => setSearchPage(Math.max(0, searchPage - 1))}
//         onNextPage={() =>
//           setSearchPage(Math.min(Math.ceil(searchResults.length / itemsPerPage) - 1, searchPage + 1))
//         }
//       />
//     );
//   };

//   return (
//     <>
//       {searchResults.length > 0 ? (
//         renderSearchResults()
//       ) : (
//         <>
//           <MusicSliderSection
//             title="Top View: Pop"
//             songs={paginate(topView, topViewPage)}
//             onClickSong={(song) => playWithId(song, topView)}
//             onPrevPage={() => setTopViewPage(Math.max(0, topViewPage - 1))}
//             onNextPage={() =>
//               setTopViewPage(Math.min(Math.ceil(topView.length / itemsPerPage) - 1, topViewPage + 1))
//             }
//           />
//           <MusicSliderSection
//             title="Top View: Justin Bieber"
//             songs={paginate(artist, artistPage)}
//             onClickSong={(song) => playWithId(song, artist)}
//             onPrevPage={() => setArtistPage(Math.max(0, artistPage - 1))}
//             onNextPage={() =>
//               setArtistPage(Math.min(Math.ceil(artist.length / itemsPerPage) - 1, artistPage + 1))
//             }
//           />
//         </>
//       )}
//     </>
//   );
// };

// export default DisplayHome;

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import MusicSliderSection from "../components/MusicSliderSection";
// import { PlayerContext } from "../context/PlayerContext";

// const DisplayHome = () => {
//   const [topView, setTopView] = useState([]); // Đổi tên từ topViews1 thành topView
//   const [artist, setArtist] = useState([]); // Đổi tên từ topViews2 thành artist
//   const [topViewPage, setTopViewPage] = useState(0);
//   const [artistPage, setArtistPage] = useState(0);
//   const itemsPerPage = 6;
//   const { playWithId } = useContext(PlayerContext);

//   const paginate = (arr, page) => arr?.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

//   useEffect(() => {
//     const fetchMusicData = async () => {
//       try {
//         const [res1, res2] = await Promise.allSettled([
//           axios.get("http://127.0.0.1:8000/api/music/search/?q=pop&type=top_views"), // Lấy bài hát theo lượt views cao
//           axios.get("http://127.0.0.1:8000/api/music/search/?q=justin+bieber&type=artist") // Lấy bài hát theo nghệ sĩ
//         ]);

//         if (res1.status === "fulfilled") {
//           setTopView(res1.value.data.map(song => ({
//             title: song.title,
//             artists: song.artists,
//             duration: song.duration,
//             album: song.album,
//             thumbnail: song.thumbnail,
//             videoId: song.videoId,
//             url: song.url,
//             views: song.views,
//             albumId: song.albumId
//           })));
//         } else {
//           console.warn("Fetch pop thất bại:", res1.reason);
//         }

//         if (res2.status === "fulfilled") {
//           setArtist(res2.value.data.map(song => ({
//             title: song.title,
//             artists: song.artists,
//             duration: song.duration,
//             album: song.album,
//             thumbnail: song.thumbnail,
//             videoId: song.videoId,
//             url: song.url,
//             views: song.views,
//             albumId: song.albumId
//           })));
//         } else {
//           console.warn("Fetch Justin Bieber thất bại:", res2.reason);
//         }
//       } catch (e) {
//         console.error("Lỗi bất ngờ:", e);
//       }
//     };

//     fetchMusicData();
//   }, []);

//   return (
//     <>
//       <MusicSliderSection
//         title="Top View: Pop"
//         songs={paginate(topView, topViewPage)}
//         onClickSong={(song) => playWithId(song, topView)}
//         onPrevPage={() => setTopViewPage(Math.max(0, topViewPage - 1))}
//         onNextPage={() =>
//           setTopViewPage(Math.min(Math.ceil(topView.length / itemsPerPage) - 1, topViewPage + 1))
//         }
//       />
//       <MusicSliderSection
//         title="Top View: Justin Bieber"
//         songs={paginate(artist, artistPage)}
//         onClickSong={(song) => playWithId(song, artist)}
//         onPrevPage={() => setArtistPage(Math.max(0, artistPage - 1))}
//         onNextPage={() =>
//           setArtistPage(Math.min(Math.ceil(artist.length / itemsPerPage) - 1, artistPage + 1))
//         }
//       />
//     </>
//   );
// };

// export default DisplayHome;

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import MusicSliderSection from "../components/MusicSliderSection";
// import { PlayerContext } from "../context/PlayerContext";

// const DisplayHome = () => {
//   const [topViews1, setTopViews1] = useState([]);
//   const [topViews2, setTopViews2] = useState([]);
//   const [topViewPage1, setTopViewPage1] = useState(0);
//   const [topViewPage2, setTopViewPage2] = useState(0);
//   const itemsPerPage = 6;
//   const { playWithId } = useContext(PlayerContext);

//   const paginate = (arr, page) => arr?.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

//   useEffect(() => {
//     const fetchMusicData = async () => {
//       try {
//         const [res1, res2] = await Promise.allSettled([
//           axios.get("http://localhost:8000/api/music/search/?q=sơn+tùng&type=top_by_views"),
//           axios.get("http://localhost:8000/api/music/search/?q=justin+bieber&type=top_by_views")
//         ]);

//         if (res1.status === "fulfilled") {
//           setTopViews1(res1.value.data.map(song => ({
//             title: song.title,
//             artists: song.artists,
//             duration: song.duration,
//             album: song.album,
//             thumbnail: song.thumbnail,
//             videoId: song.videoId,
//             url: song.url,
//             views: song.views,
//             albumId: song.albumId
//           })));
//         } else {
//           console.warn("Fetch Sơn Tùng thất bại:", res1.reason);
//         }

//         if (res2.status === "fulfilled") {
//           setTopViews2(res2.value.data.map(song => ({
//             title: song.title,
//             artists: song.artists,
//             duration: song.duration,
//             album: song.album,
//             thumbnail: song.thumbnail,
//             videoId: song.videoId,
//             url: song.url,
//             views: song.views,
//             albumId: song.albumId
//           })));
//         } else {
//           console.warn("Fetch Justin Bieber thất bại:", res2.reason);
//         }
//       } catch (e) {
//         console.error("Lỗi bất ngờ:", e);
//       }
//     };

//     fetchMusicData();
//   }, []);

//   return (
//     <>
//       <MusicSliderSection
//         title="Top View: Sơn Tùng"
//         songs={paginate(topViews1, topViewPage1)}
//         onClickSong={(song) => playWithId(song, topViews1)}
//         onPrevPage={() => setTopViewPage1(Math.max(0, topViewPage1 - 1))}
//         onNextPage={() =>
//           setTopViewPage1(Math.min(Math.ceil(topViews1.length / itemsPerPage) - 1, topViewPage1 + 1))
//         }
//       />
//       <MusicSliderSection
//         title="Top View: Justin Bieber"
//         songs={paginate(topViews2, topViewPage2)}
//         onClickSong={(song) => playWithId(song, topViews2)}
//         onPrevPage={() => setTopViewPage2(Math.max(0, topViewPage2 - 1))}
//         onNextPage={() =>
//           setTopViewPage2(Math.min(Math.ceil(topViews2.length / itemsPerPage) - 1, topViewPage2 + 1))
//         }
//       />
//     </>
//   );
// };

// export default DisplayHome;

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import MusicSliderSection from "../components/MusicSliderSection";
// import { PlayerContext } from "../context/PlayerContext";

// const DisplayHome = () => {
//   const [topArtists1, setTopArtists1] = useState([]);
//   const [topArtists2, setTopArtists2] = useState([]);
//   const [topArtistPage1, setTopArtistPage1] = useState(0);
//   const [topArtistPage2, setTopArtistPage2] = useState(0);
//   const itemsPerPage = 6;
//   const { playWithId } = useContext(PlayerContext);

//   const paginate = (arr, page) => arr?.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

//   useEffect(() => {
//     const fetchMusicData = async () => {
//       try {
//         const [artist1Result, artist2Result] = await Promise.allSettled([
//           axios.get("http://localhost:8000/api/music/search/?q=sơn+tùng&type=top_by_artist"),
//           axios.get("http://localhost:8000/api/music/search/?q=justin+bieber&type=top_by_artist")
//         ]);

//         if (artist1Result.status === "fulfilled") {
//           setTopArtists1(
//             artist1Result.value.data.map(song => ({
//               title: song.title,
//               artists: song.artists,
//               duration: song.duration,
//               album: song.album,
//               thumbnail: song.thumbnail,
//               popularity: song.popularity,
//               spotify_url: song.spotify_url,
//               preview_url: song.preview_url,
//               release_date: song.release_date,
//             }))
//           );
//         } else {
//           console.warn("Artist1 fetch failed:", artist1Result.reason);
//         }

//         if (artist2Result.status === "fulfilled") {
//           setTopArtists2(
//             artist2Result.value.data.map(song => ({
//               title: song.title,
//               artists: song.artists,
//               duration: song.duration,
//               album: song.album,
//               thumbnail: song.thumbnail,
//               popularity: song.popularity,
//               spotify_url: song.spotify_url,
//               preview_url: song.preview_url,
//               release_date: song.release_date,
//             }))
//           );
//         } else {
//           console.warn("Artist2 fetch failed:", artist2Result.reason);
//         }
//       } catch (e) {
//         console.error("Unexpected error:", e);
//       }
//     };

//     fetchMusicData();
//   }, []);

//   return (
//     <>
//       <MusicSliderSection
//         title="Top Artist"
//         songs={paginate(topArtists1, topArtistPage1)}
//         onClickSong={(song) => playWithId(song, topArtists1)}
//         onPrevPage={() => setTopArtistPage1(Math.max(0, topArtistPage1 - 1))}
//         onNextPage={() => setTopArtistPage1(Math.min(Math.ceil(topArtists1.length / itemsPerPage) - 1, topArtistPage1 + 1))}
//       />
//       <MusicSliderSection
//         title="Top Artist"
//         songs={paginate(topArtists2, topArtistPage2)}
//         onClickSong={(song) => playWithId(song, topArtists2)}
//         onPrevPage={() => setTopArtistPage2(Math.max(0, topArtistPage2 - 1))}
//         onNextPage={() => setTopArtistPage2(Math.min(Math.ceil(topArtists2.length / itemsPerPage) - 1, topArtistPage2 + 1))}
//       />
//     </>
//   );
// };

// export default DisplayHome;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import MusicSliderSection from "./MusicSliderSection";
// import { useContext } from "react";
// import { PlayerContext } from "../context/PlayerContext"; // Đảm bảo bạn đã import context

// const DisplayHome = () => {
//   const [topSongs, setTopSongs] = useState([]);
//   const [musicOnly, setMusicOnly] = useState([]);
//   const [topPage, setTopPage] = useState(0);
//   const [musicOnlyPage, setMusicOnlyPage] = useState(0);

//   const { playWithId } = useContext(PlayerContext); // Dùng context để chơi nhạc khi click vào bài hát

//   const itemsPerPage = 6;

//   const paginate = (array, page) =>
//     array.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

//   useEffect(() => {
//     const fetchMusicData = async () => {
//       try {
//         const [topResult, musicOnlyResult] = await Promise.allSettled([
//           axios.get("http://localhost:8000/api/music/search?type=music_video", {
//             withCredentials: true,
//             headers: { Accept: "application/json" },
//           }),
//           axios.get("http://localhost:8000/api/music/search?type=music_only", {
//             withCredentials: true,
//             headers: { Accept: "application/json" },
//           }),
//         ]);

//         if (topResult.status === "fulfilled") {
//           setTopSongs(topResult.value.data || []);
//         } else {
//           console.error("Lỗi lấy top music video:", topResult.reason);
//         }

//         if (musicOnlyResult.status === "fulfilled") {
//           setMusicOnly(musicOnlyResult.value.data || []);
//         } else {
//           console.error("Lỗi lấy music only:", musicOnlyResult.reason);
//         }
//       } catch (error) {
//         console.error("Lỗi không xác định:", error);
//       }
//     };

//     fetchMusicData();
//   }, []);

//   return (
//     <>
//       {/* Nếu bạn có Navbar, có thể mở lại */}
//       {/* <Navbar /> */}

//       <MusicSliderSection
//         title="Top Music Videos"
//         songs={paginate(topSongs, topPage)}
//         onClickSong={playWithId} // Khi click vào bài hát sẽ gọi playWithId từ context
//         onPrevPage={() => setTopPage(Math.max(0, topPage - 1))}
//         onNextPage={() => setTopPage(Math.min(Math.ceil(topSongs.length / itemsPerPage) - 1, topPage + 1))}
//       />

//       <MusicSliderSection
//         title="Only Music (No Video)"
//         songs={paginate(musicOnly, musicOnlyPage)}
//         onClickSong={playWithId} // Khi click vào bài hát sẽ gọi playWithId từ context
//         onPrevPage={() => setMusicOnlyPage(Math.max(0, musicOnlyPage - 1))}
//         onNextPage={() => setMusicOnlyPage(Math.min(Math.ceil(musicOnly.length / itemsPerPage) - 1, musicOnlyPage + 1))}
//       />
//     </>
//   );
// };

// export default DisplayHome;

// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import SongItem from "./SongItem";
// import axios from "axios";
// import MusicSliderSection from "./MusicSliderSection";

// const DisplayHome = () => {
//   const [topSongs, setTopSongs] = useState([]);
//   const [musicOnly, setMusicOnly] = useState([]);
//   const [topPage, setTopPage] = useState(0);
//   const [musicOnlyPage, setMusicOnlyPage] = useState(0);

//   const itemsPerPage = 6;

//   const paginate = (array, page) =>
//     array.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

//   useEffect(() => {
//     const fetchMusicData = async () => {
//       try {
//         const [topResult, musicOnlyResult] = await Promise.allSettled([
//           axios.get("http://localhost:8000/api/music/search?type=music_video", {
//             withCredentials: true,
//             headers: { Accept: "application/json" },
//           }),
//           axios.get("http://localhost:8000/api/music/search?type=music_only", {
//             withCredentials: true,
//             headers: { Accept: "application/json" },
//           }),
//         ]);

//         if (topResult.status === "fulfilled") {
//           setTopSongs(topResult.value.data || []);
//         } else {
//           console.error("Lỗi lấy top music video:", topResult.reason);
//         }

//         if (musicOnlyResult.status === "fulfilled") {
//           setMusicOnly(musicOnlyResult.value.data || []);
//         } else {
//           console.error("Lỗi lấy music only:", musicOnlyResult.reason);
//         }
//       } catch (error) {
//         console.error("Lỗi không xác định:", error);
//       }
//     };

//     fetchMusicData();
//   }, []);

//   return (
//     <>
//       {/* <Navbar /> */}

//       <MusicSliderSection title="Top Music Videos" songs={topSongs} />
//       <MusicSliderSection title="Only Music (No Video)" songs={musicOnly} />
//     </>
//   );
// };

// export default DisplayHome;
