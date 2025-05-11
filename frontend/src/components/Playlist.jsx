// Playlist.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("token");
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/accounts/user_info/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPlaylists(data.playlists || []);
          localStorage.setItem("user_info", JSON.stringify(data)); // Lưu user_info
        }
      } catch (err) {
        console.error("Lỗi lấy user info:", err);
      }
    };
    fetchUserInfo();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createPlaylist = async () => {
    const name = newName.trim();
    if (!name) return;
    if (playlists.some((p) => p.name === name)) {
      setErrorMsg("Playlist đã tồn tại");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/accounts/playlist/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setNewName("");
        const updated = await fetch("http://localhost:8000/api/accounts/user_info/", {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await updated.json();
        setPlaylists(data.playlists || []);
        localStorage.setItem("user_info", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Lỗi tạo playlist:", err);
    }
  };

  const deletePlaylist = async (name) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/accounts/playlist/delete/${encodeURIComponent(name)}/`,
        { method: "DELETE", headers: { Authorization: `Token ${token}` } }
      );
      if (res.ok) {
        setShowMenu(null);
        setSelectedPlaylist(null);
        const updated = await fetch("http://localhost:8000/api/accounts/user_info/", {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await updated.json();
        setPlaylists(data.playlists || []);
        localStorage.setItem("user_info", JSON.stringify(data));
        navigate('/')
      }
    } catch (err) {
      console.error("Lỗi xóa playlist:", err);
    }
  };

  const renamePlaylist = async (old_name, new_name_raw) => {
    const name = new_name_raw.trim();
    if (!name) return;
    if (playlists.some((p) => p.name === name)) {
      setErrorMsg("Playlist đã tồn tại");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/accounts/playlist/rename/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}` },
        body: JSON.stringify({ old_name, new_name: name }),
      });
      if (res.ok) {
        setSelectedPlaylist(null);
        setRenameValue("");
        setShowMenu(null);
        const updated = await fetch("http://localhost:8000/api/accounts/user_info/", {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await updated.json();
        setPlaylists(data.playlists || []);
        localStorage.setItem("user_info", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Lỗi đổi tên playlist:", err);
    }
  };

  if (!token) return <p className="text-white">Please login to use playlist</p>;

  return (
    <div ref={containerRef} className="p-4">
      <h2 className="text-lg font-bold text-white mb-4">Playlists</h2>
      {errorMsg && <Modal message={errorMsg} onClose={() => setErrorMsg("")} />}

      {/* Create Playlist */}
      <div className="flex mb-4">
        <div className="flex items-center bg-[#242424] p-2 rounded flex-1">
          <input
            className="bg-transparent outline-none text-white flex-1"
            type="text"
            placeholder="Enter new playlist"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createPlaylist()}
          />
          <button
            onClick={createPlaylist}
            className="px-2 py-1 rounded text-white bg-[rgb(44,44,44)] hover:opacity-80 ml-2"
          >
            Create
          </button>
        </div>
      </div>

      {/* List playlists */}
      {playlists.length > 0 && (
        <ul>
          {playlists.map((playlist) => (
            <li
              key={playlist.name}
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => navigate(`/playlist/${encodeURIComponent(playlist.name)}`)}
            >
              {selectedPlaylist === playlist.name ? (
                <>
                  <input
                    className="bg-transparent border border-gray-600 p-1 rounded text-white mr-2"
                    type="text"
                    placeholder="New name"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                  />
                  <button
                    onClick={() => renamePlaylist(playlist.name, renameValue)}
                    className="px-2 py-1 rounded text-white bg-[rgb(18,18,18)] hover:opacity-80 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setSelectedPlaylist(null)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="text-white">{playlist.name}</span>
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(prev => (prev === playlist.name ? null : playlist.name));
                      }}
                      className="px-2 py-1 text-white bg-[rgb(18,18,18)] rounded hover:opacity-80"
                    >
                      ⋮
                    </button>
                    {showMenu === playlist.name && (
                      <div className="absolute right-0 top-full mt-1 bg-[#242424] border border-gray-700 rounded shadow-md z-10">
                        <button
                          onClick={() => {
                            setSelectedPlaylist(playlist.name);
                            setRenameValue(playlist.name);
                            setShowMenu(null);
                          }}
                          className="block px-4 py-2 w-full text-left text-white hover:bg-gray-700"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => deletePlaylist(playlist.name)}
                          className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Playlist;




// import { useEffect, useRef, useState } from "react";

// const Modal = ({ message, onClose }) => (
//   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//     <div className="bg-[#242424] p-4 rounded shadow-lg max-w-xs w-full">
//       <p className="text-white mb-4">{message}</p>
//       <button
//         onClick={onClose}
//         className="mt-2 px-4 py-2 bg-[rgb(18,18,18)] text-white rounded hover:opacity-80"
//       >
//         OK
//       </button>
//     </div>
//   </div>
// );

// const Playlist = () => {
//   const [playlists, setPlaylists] = useState([]);
//   const [newName, setNewName] = useState("");
//   const [selectedPlaylist, setSelectedPlaylist] = useState(null);
//   const [showMenu, setShowMenu] = useState(null);
//   const [renameValue, setRenameValue] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const token = localStorage.getItem("token");
//   const containerRef = useRef(null);

//   // Fetch playlists
//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const res = await fetch("http://localhost:8000/api/accounts/user_info/", {
//           headers: { Authorization: `Token ${token}` },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setPlaylists(data.playlists || []);
//         }
//       } catch (err) {
//         console.error("Lỗi lấy user info:", err);
//       }
//     };
//     fetchUserInfo();
//   }, [token]);

//   // Close menu on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setShowMenu(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const createPlaylist = async () => {
//     const name = newName.trim();
//     if (!name) return;
//     if (playlists.some((p) => p.name === name)) {
//       setErrorMsg("Playlist đã tồn tại");
//       return;
//     }
//     try {
//       const res = await fetch("http://localhost:8000/api/accounts/playlist/create/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ name }),
//       });
//       if (res.ok) {
//         setNewName("");
//         const updated = await fetch("http://localhost:8000/api/accounts/user_info/", {
//           headers: { Authorization: `Token ${token}` },
//         });
//         const data = await updated.json();
//         setPlaylists(data.playlists || []);
//       }
//     } catch (err) {
//       console.error("Lỗi tạo playlist:", err);
//     }
//   };

//   const deletePlaylist = async (name) => {
//     try {
//       const res = await fetch(
//         `http://localhost:8000/api/accounts/playlist/delete/${encodeURIComponent(name)}/`,
//         { method: "DELETE", headers: { Authorization: `Token ${token}` } }
//       );
//       if (res.ok) {
//         setShowMenu(null);
//         setSelectedPlaylist(null);
//         const updated = await fetch("http://localhost:8000/api/accounts/user_info/", {
//           headers: { Authorization: `Token ${token}` },
//         });
//         const data = await updated.json();
//         setPlaylists(data.playlists || []);
//       }
//     } catch (err) {
//       console.error("Lỗi xóa playlist:", err);
//     }
//   };

//   const renamePlaylist = async (old_name, new_name_raw) => {
//     const name = new_name_raw.trim();
//     if (!name) return;
//     if (playlists.some((p) => p.name === name)) {
//       setErrorMsg("Playlist đã tồn tại");
//       return;
//     }
//     try {
//       const res = await fetch("http://localhost:8000/api/accounts/playlist/rename/", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ old_name, new_name: name }),
//       });
//       if (res.ok) {
//         setSelectedPlaylist(null);
//         setRenameValue("");
//         setShowMenu(null);
//         const updated = await fetch("http://localhost:8000/api/accounts/user_info/", {
//           headers: { Authorization: `Token ${token}` },
//         });
//         const data = await updated.json();
//         setPlaylists(data.playlists || []);
//       }
//     } catch (err) {
//       console.error("Lỗi đổi tên playlist:", err);
//     }
//   };

//   if (!token) return <p className="text-white">Please login to use playlist</p>;

//   return (
//     <div ref={containerRef} className="p-4">
//       <h2 className="text-lg font-bold text-white mb-4">Playlists</h2>

//       {errorMsg && <Modal message={errorMsg} onClose={() => setErrorMsg("")} />}

//       {/* Create playlist */}
//       <div className="flex mb-4">
//         <div className="flex items-center bg-[#242424] p-2 rounded flex-1">
//           <input
//             className="bg-transparent outline-none text-white flex-1"
//             type="text"
//             placeholder="Enter new playlist"
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && createPlaylist()}
//           />
//           <button
//             onClick={createPlaylist}
//             className="px-2 py-1 rounded text-white bg-[rgb(44,44,44)] hover:opacity-80 ml-2"
//           >
//             Create
//           </button>
//         </div>
//       </div>

//       {/* List playlists */}
//       {playlists.length > 0 && (
//         <ul>
//           {playlists.map((playlist) => (
//             <li
//               key={playlist.name}
//               className="flex justify-between items-center mb-2"
//             >
//               {selectedPlaylist === playlist.name ? (
//                 <>
//                   <input
//                     className="bg-transparent border border-gray-600 p-1 rounded text-white mr-2"
//                     type="text"
//                     placeholder="New name"
//                     value={renameValue}
//                     onChange={(e) => setRenameValue(e.target.value)}
//                   />
//                   <button
//                     onClick={() => renamePlaylist(playlist.name, renameValue)}
//                     className="px-2 py-1 rounded text-white bg-[rgb(18,18,18)] hover:opacity-80 mr-2"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setSelectedPlaylist(null)}
//                     className="text-gray-400 hover:text-gray-200"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <span className="text-white">{playlist.name}</span>
//                   <div className="relative inline-block">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setShowMenu(prev => (prev === playlist.name ? null : playlist.name));
//                       }}
//                       className="px-2 py-1 text-white bg-[rgb(18,18,18)] rounded hover:opacity-80"
//                     >
//                       ⋮
//                     </button>
//                     {showMenu === playlist.name && (
//                       <div className="absolute right-0 top-full mt-1 bg-[#242424] border border-gray-700 rounded shadow-md z-10">
//                         <button
//                           onClick={() => {
//                             setSelectedPlaylist(playlist.name);
//                             setRenameValue(playlist.name);
//                             setShowMenu(null);
//                           }}
//                           className="block px-4 py-2 w-full text-left text-white hover:bg-gray-700"
//                         >
//                           Rename
//                         </button>
//                         <button
//                           onClick={() => deletePlaylist(playlist.name)}
//                           className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-700"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Playlist;
