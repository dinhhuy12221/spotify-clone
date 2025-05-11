import { useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from React Router
import { PlayerContext } from "../context/PlayerContext";
import defaultImage from "../assets/default.png";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd"; // MUI icon
import CloseIcon from "@mui/icons-material/Close"; // For closing popup

const SongItem = ({ song, onPlay, onRemoved }) => {
  const { playWithId } = useContext(PlayerContext);
  const [imgSrc, setImgSrc] = useState(song?.thumbnail || defaultImage);
  const [showPopup, setShowPopup] = useState(false); // Popup for adding to playlist
  const [showRemoveModal, setShowRemoveModal] = useState(false); // Modal for confirming removal
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [songInPlaylists, setSongInPlaylists] = useState([]);

  const location = useLocation(); // Get the current location from React Router
  const popupRef = useRef(null); // Reference to the popup div

  useEffect(() => {
    // Lấy danh sách playlist từ localStorage
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    setUserPlaylists(userInfo?.playlists || []);

    // Kiểm tra song_id có tồn tại trong các playlist không
    const playlistsWithSong = userInfo?.playlists.filter((playlist) =>
      playlist.song_ids.includes(song?.id)
    );
    setSongInPlaylists(playlistsWithSong || []);
  }, [song]);

  useEffect(() => {
    // Thêm sự kiện khi click ngoài popup để đóng popup
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
    e.stopPropagation(); // Tránh trigger play khi click icon
    setShowPopup(true);
  };

  const handleSelectPlaylist = async (playlistName) => {
    // Thêm song vào playlist
    const token = localStorage.getItem("token");
    const playlist = userPlaylists.find((p) => p.name === playlistName);

    const res = await fetch(
      "http://localhost:8000/api/accounts/playlist/update-songs/",
      {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlist_name: playlist?.name,
          action: "add",
          song_id: song?.id,
        }),
      }
    );

    if (res.ok) {
      const updated = await fetch(
        "http://localhost:8000/api/accounts/user_info/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      const data = await updated.json();
      setUserPlaylists(data.playlists || []);
      localStorage.setItem("user_info", JSON.stringify(data));
    }

    setShowPopup(false); // Đóng popup khi thêm xong
  };

  const handleRemoveFromPlaylist = async () => {
    // Xóa song khỏi playlist
    const token = localStorage.getItem("token");
    const playlist = songInPlaylists[0]; // Sử dụng playlist đang chọn (chỉ có 1 playlist trong songInPlaylists)

    const res = await fetch(
      "http://localhost:8000/api/accounts/playlist/update-songs/",
      {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlist_name: playlist?.name,
          action: "remove",
          song_id: song?.id,
        }),
      }
    );

    if (res.ok) {
      const updated = await fetch(
        "http://localhost:8000/api/accounts/user_info/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      const data = await updated.json();
      setUserPlaylists(data.playlists || []);
      localStorage.setItem("user_info", JSON.stringify(data));
    }
    onRemoved();

    setShowRemoveModal(false); // Đóng modal sau khi xóa
  };

  // Kiểm tra xem URL hiện tại có phải là /playlist/:name không
  const isPlaylistPage = location.pathname.startsWith("/playlist/");

  return (
    <div
      className="relative w-full bg-black rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
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
        {song?.artists && (
          <p className="text-xs text-gray-300">{song.artists.join(", ")}</p>
        )}
        {song?.duration && (
          <p className="text-xs text-gray-400 mt-1">{song.duration}</p>
        )}
      </div>

      {/* Nút thêm vào playlist */}
      {!isPlaylistPage ? (
        <button
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full z-10 w-8 h-8"
          onClick={handleAddToPlaylist}
        >
          <PlaylistAddIcon fontSize="small" />
        </button>
      ) : (
        // Nút xóa bài hát khỏi playlist khi ở trang playlist và bài hát có trong playlist
        songInPlaylists.length > 0 &&
        isPlaylistPage && (
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

      {/* Modal xác nhận xóa bài hát khỏi playlist */}
      {(showRemoveModal && isPlaylistPage) && (
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
          ref={popupRef} // Thêm ref vào popup
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
            {userPlaylists.map((playlist) => (
              <li
                key={playlist.name}
                className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
                onClick={() => handleSelectPlaylist(playlist.name)}
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



// import { useContext, useEffect, useState, useRef } from "react";
// import { useLocation } from "react-router-dom"; // Import useLocation from React Router
// import { PlayerContext } from "../context/PlayerContext";
// import defaultImage from "../assets/default.png";
// import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd"; // MUI icon
// import CloseIcon from "@mui/icons-material/Close"; // For closing popup

// const SongItem = ({ song, onPlay }) => {
//   const { playWithId } = useContext(PlayerContext);
//   const [imgSrc, setImgSrc] = useState(song?.thumbnail || defaultImage);
//   const [showPopup, setShowPopup] = useState(false); // Popup for adding to playlist
//   const [removePopup, setRemovePopup] = useState(false); // Popup for removing from playlist
//   const [userPlaylists, setUserPlaylists] = useState([]);
//   const [songInPlaylists, setSongInPlaylists] = useState([]);

//   const location = useLocation(); // Get the current location from React Router
//   const popupRef = useRef(null); // Reference to the popup div

//   useEffect(() => {
//     // Lấy danh sách playlist từ localStorage
//     const userInfo = JSON.parse(localStorage.getItem("user_info"));
//     setUserPlaylists(userInfo?.playlists || []);

//     // Kiểm tra song_id có tồn tại trong các playlist không
//     const playlistsWithSong = userInfo?.playlists.filter((playlist) =>
//       playlist.song_ids.includes(song.id)
//     );
//     setSongInPlaylists(playlistsWithSong || []);
//   }, [song]);

//   useEffect(() => {
//     // Thêm sự kiện khi click ngoài popup để đóng popup
//     const handleClickOutside = (e) => {
//       if (popupRef.current && !popupRef.current.contains(e.target)) {
//         setShowPopup(false);
//         setRemovePopup(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleClick = (e) => {
//     e.preventDefault();
//     playWithId(song);
//     if (onPlay) onPlay();
//   };

//   const handleAddToPlaylist = (e) => {
//     e.stopPropagation(); // Tránh trigger play khi click icon
//     setShowPopup(true);
//   };

//   const handleSelectPlaylist = async (playlistName) => {
//     // Thêm song vào playlist
//     const token = localStorage.getItem("token");
//     const playlist = userPlaylists.find((p) => p.name === playlistName);

//     const res = await fetch(
//       "http://localhost:8000/api/accounts/playlist/update-songs/",
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Token ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           playlist_name: playlistName,
//           action: "add",
//           song_id: song.id,
//         }),
//       }
//     );

//     if (res.ok) {
//       const updated = await fetch(
//         "http://localhost:8000/api/accounts/user_info/",
//         {
//           headers: { Authorization: `Token ${token}` },
//         }
//       );
//       const data = await updated.json();
//       setUserPlaylists(data.playlists || []);
//       localStorage.setItem("user_info", JSON.stringify(data));
//     }

//     setShowPopup(false); // Đóng popup khi thêm xong
//   };

//   const handleRemoveFromPlaylist = async (playlistName) => {
//     // Xóa song khỏi playlist hiện tại
//     const token = localStorage.getItem("token");
//     const playlist = userPlaylists.find((p) => p.name === playlistName);

//     const res = await fetch(
//       "http://localhost:8000/api/accounts/playlist/update-songs/",
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Token ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           playlist_name: playlistName,
//           action: "remove",
//           song_id: song.id,
//         }),
//       }
//     );

//     if (res.ok) {
//       const updated = await fetch(
//         "http://localhost:8000/api/accounts/user_info/",
//         {
//           headers: { Authorization: `Token ${token}` },
//         }
//       );
//       const data = await updated.json();
//       setUserPlaylists(data.playlists || []);
//       localStorage.setItem("user_info", JSON.stringify(data));
//     }

//     setRemovePopup(false); // Đóng popup khi xóa xong
//   };

//   // Kiểm tra xem URL hiện tại có phải là /playlist/:name không
//   const isPlaylistPage = location.pathname.startsWith("/playlist/");

//   return (
//     <div
//       className="relative w-full bg-black rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
//       onClick={handleClick}
//     >
//       <div className="w-full h-64 overflow-hidden">
//         <img
//           src={imgSrc}
//           alt={song?.title}
//           className="w-full h-full object-cover object-center"
//           loading="lazy"
//           referrerPolicy="no-referrer"
//           onError={() => setImgSrc(defaultImage)}
//         />
//       </div>
//       <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
//         <h3 className="text-sm font-semibold line-clamp-2 text-white">
//           {song?.title}
//         </h3>
//         {song?.artists && (
//           <p className="text-xs text-gray-300">{song.artists.join(", ")}</p>
//         )}
//         {song?.duration && (
//           <p className="text-xs text-gray-400 mt-1">{song.duration}</p>
//         )}
//       </div>

//       {/* Nút thêm vào playlist */}
//       {!isPlaylistPage ? (
//         <button
//           className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full z-10 w-8 h-8"
//           onClick={handleAddToPlaylist}
//         >
//           <PlaylistAddIcon fontSize="small" />
//         </button>
//       ) : (
//         // Nút xóa bài hát khỏi playlist khi ở trang playlist và bài hát có trong playlist
//         songInPlaylists.length > 0 &&
//         isPlaylistPage && (
//           <button
//             className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full z-10 w-8 h-8"
//             onClick={(e) => {
//               e.stopPropagation();
//               setRemovePopup(true);
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </button>
//         )
//       )}

//       {/* Popup thêm bài vào playlist */}
//       {showPopup && !isPlaylistPage && (
//         <div
//           className="absolute top-10 left-2 z-20 bg-black/90 text-white rounded-lg shadow-lg w-48 p-3"
//           onClick={(e) => e.stopPropagation()}
//           ref={popupRef} // Thêm ref vào popup
//         >
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-semibold">Add to Playlist</span>
//             <button onClick={() => setShowPopup(false)}>
//               <CloseIcon
//                 fontSize="small"
//                 className="text-gray-300 hover:text-white"
//               />
//             </button>
//           </div>
//           <ul className="space-y-1 text-sm">
//             {userPlaylists.map((playlist) => (
//               <li
//                 key={playlist.name}
//                 className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
//                 onClick={() => handleSelectPlaylist(playlist.name)}
//               >
//                 {playlist.name}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Popup xóa bài khỏi playlist */}
//       {removePopup && isPlaylistPage && (
//         <div
//           className="absolute top-10 left-2 z-20 bg-black/90 text-white rounded-lg shadow-lg w-48 p-3"
//           onClick={(e) => e.stopPropagation()}
//           ref={popupRef} // Thêm ref vào popup
//         >
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-semibold">Remove from playlist</span>
//             <button onClick={() => setRemovePopup(false)}>
//               <CloseIcon
//                 fontSize="small"
//                 className="text-gray-300 hover:text-white"
//               />
//             </button>
//           </div>
//           <ul className="space-y-1 text-sm">
//             {songInPlaylists.map((playlist) => (
//               <li
//                 key={playlist.name}
//                 className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
//                 onClick={() => handleRemoveFromPlaylist(playlist.name)}
//               >
//                 {playlist.name}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SongItem;

// import { useContext, useEffect, useState } from "react";
// import { PlayerContext } from "../context/PlayerContext";
// import defaultImage from "../assets/default.png";
// import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd"; // MUI icon
// import CloseIcon from "@mui/icons-material/Close"; // For closing popup

// const SongItem = ({ song, onPlay }) => {
//   const { playWithId } = useContext(PlayerContext);
//   const [imgSrc, setImgSrc] = useState(song?.thumbnail || defaultImage);
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     setImgSrc(song?.thumbnail || defaultImage);
//   }, [song?.thumbnail]);

//   const handleClick = (e) => {
//     e.preventDefault();
//     playWithId(song);
//     if (onPlay) onPlay();
//   };

//   const handleAddToPlaylist = (e) => {
//     e.stopPropagation(); // Tránh trigger play khi click icon
//     setShowPopup(true);
//   };

//   const handleSelectPlaylist = (playlistName) => {
//     // TODO: Replace with real add-to-playlist logic
//     console.log(`Thêm "${song.title}" vào playlist: ${playlistName}`);
//     setShowPopup(false);
//   };

//   return (
//     <div
//       className="relative w-full bg-black rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
//       onClick={handleClick}
//     >
//       <div className="w-full h-64 overflow-hidden">
//         <img
//           src={imgSrc}
//           alt={song?.title}
//           className="w-full h-full object-cover object-center"
//           loading="lazy"
//           referrerPolicy="no-referrer"
//           onError={() => setImgSrc(defaultImage)}
//         />
//       </div>

//       {/* Nút thêm vào playlist */}
//       <button
//         className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full z-10 w-8 h-8"
//         onClick={handleAddToPlaylist}
//       >
//         <PlaylistAddIcon fontSize="small" />
//       </button>

//       {/* Thông tin bài hát */}
//       <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
//         <h3 className="text-sm font-semibold line-clamp-2 text-white">{song?.title}</h3>
//         {song?.artists && <p className="text-xs text-gray-300">{song.artists.join(", ")}</p>}
//         {song?.duration && <p className="text-xs text-gray-400 mt-1">{song.duration}</p>}
//       </div>

//       {/* Popup chọn playlist */}
//       {showPopup && (
//         <div
//           className="absolute top-10 right-2 z-20 bg-black/90 text-white rounded-lg shadow-lg w-48 p-3"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-semibold">Select playlist</span>
//             <button onClick={() => setShowPopup(false)}>
//               <CloseIcon fontSize="small" className="text-gray-300 hover:text-white" />
//             </button>
//           </div>
//           <ul className="space-y-1 text-sm">
//             {["Yêu thích", "Nghe sau", "Làm việc"].map((name) => (
//               <li
//                 key={name}
//                 className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer"
//                 onClick={() => handleSelectPlaylist(name)}
//               >
//                 {name}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SongItem;

// import React, { useContext, useEffect, useState } from "react";
// import { PlayerContext } from "../context/PlayerContext";
// import defaultImage from "../assets/default.png"; // Thêm ảnh mặc định trong assets

// const SongItem = ({ song, onPlay }) => {
//   const { playWithId } = useContext(PlayerContext);
//   const [imgSrc, setImgSrc] = useState(song?.thumbnail || defaultImage);

//   // Cập nhật ảnh mỗi khi thumbnail thay đổi
//   useEffect(() => {
//     setImgSrc(song?.thumbnail || defaultImage);
//   }, [song?.thumbnail]);

//   const handleClick = (e) => {
//     e.preventDefault();
//     playWithId(song);
//     if (onPlay) onPlay();
//   };

//   return (
//     <div
//       className="relative w-full bg-black rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
//       onClick={handleClick}
//     >
//       <div className="w-full h-64 overflow-hidden">
//         <img
//           src={imgSrc}
//           alt={song?.title}
//           className="w-full h-full object-cover object-center"
//           loading="lazy"
//           referrerPolicy="no-referrer"
//           onError={() => setImgSrc(defaultImage)}
//         />
//       </div>

//       <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
//         <h3 className="text-sm font-semibold line-clamp-2 text-white">{song?.title}</h3>
//         {song?.artists && <p className="text-xs text-gray-300">{song.artists.join(", ")}</p>}
//         {song?.duration && <p className="text-xs text-gray-400 mt-1">{song.duration}</p>}
//       </div>
//     </div>
//   );
// };

// export default SongItem;

// import React, { useContext } from "react";
// import { PlayerContext } from "../context/PlayerContext";

// const SongItem = ({ song, onPlay }) => {
//   const { playWithId } = useContext(PlayerContext);

//   const handleClick = (e) => {
//     e.preventDefault();
//     playWithId(song);
//     if (onPlay) onPlay();
//   };

//   return (
//     <div
//       className="relative w-full bg-black rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
//       onClick={handleClick}
//     >
//       <div className="w-full h-64 overflow-hidden">
//         <img
//           src={song?.thumbnail}
//           alt={song?.title}
//           className="w-full h-full object-cover object-center"
//           loading="lazy"
//         />
//       </div>

//       {/* Overlay gradient và nội dung */}
//       <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
//         <h3 className="text-sm font-semibold line-clamp-2 text-white">{song?.title}</h3>
//         {song?.artists && <p className="text-xs text-gray-300">{song?.artists.join(", ")}</p>} {/* Sửa để hiển thị danh sách nghệ sĩ */}
//         {song?.duration && <p className="text-xs text-gray-400 mt-1">{song?.duration}</p>}
//       </div>
//     </div>
//   );
// };

// export default SongItem;

// import React, { useContext } from "react";
// import { PlayerContext } from "../context/PlayerContext";

// const SongItem = ({ song, onPlay }) => {
//   const { playWithId } = useContext(PlayerContext);

//   const handleClick = (e) => {
//     e.preventDefault();
//     playWithId(song);
//     if (onPlay) onPlay();
//   };

//   return (
//     <div className="relative w-full bg-black rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer" onClick={handleClick}>
//   <div className="w-full h-64 overflow-hidden">
//     <img
//       src={song?.thumbnail}
//       alt={song?.title}
//       className="w-full h-full object-cover object-center"
//       loading="lazy"
//     />
//   </div>

//   {/* Overlay gradient và nội dung */}
//   <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
//     <h3 className="text-sm font-semibold line-clamp-2 text-white">{song?.title}</h3>
//     {song?.artists && <p className="text-xs text-gray-300">{song?.artists}</p>}
//     {song?.duration && <p className="text-xs text-gray-400 mt-1">{song?.duration}</p>}
//   </div>
// </div>

//   );
// };

// export default SongItem;
