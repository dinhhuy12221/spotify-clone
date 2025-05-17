// Playlist.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import axios from "../utils/axiosConfig";
const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const access = localStorage.getItem("access_token"); // get access token

  // Check authentication then fetch playlists
  useEffect(() => {
    const init = async () => {
      if (!access) {
        navigate("/login");
        return;
      }
      // verify token
      const authRes = await axios.get("/accounts/test-auth/");
      if (!authRes) {
        navigate("/login");
        return;
      }
    };
    init();
  }, [access, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const refreshPlaylists = async () => {
    const res = await axios.get("/accounts/playlists/");
    if (res) {
      const data = await res.data;
      setPlaylists(data || []);
    }
  };

  const createPlaylist = async () => {
    const name = newName.trim();
    if (!name) return;
    if (playlists.some((p) => p.name === name)) {
      setErrorMsg("Playlist đã tồn tại");
      return;
    }
    const res = await axios.post("/accounts/playlists/", { name });
    if (res) {
      setNewName("");
      await refreshPlaylists();
    } else {
      setErrorMsg("Tạo playlist thất bại");
    }
  };

  const deletePlaylist = async (playlistId) => {
    const res = await axios.delete(`/accounts/playlists/${playlistId}/`);
    if (res) {
      setShowMenu(null);
      setSelectedPlaylist(null);
      await refreshPlaylists();
      navigate("/");
    } else {
      setErrorMsg("Xóa playlist thất bại");
    }
  };

  const renamePlaylist = async (playlistId, new_name_raw) => {
    try {
      const name = new_name_raw.trim();
      console.log(playlistId);

      if (!name) return;
      if (playlists.some((p) => p.name === name)) {
        setErrorMsg("Playlist đã tồn tại");
        return;
      }
      const res = await axios.patch(`/accounts/playlists/${playlistId}/`, {
        name,
      });
      if (res) {
        setSelectedPlaylist(null);
        setRenameValue("");
        setShowMenu(null);
        await refreshPlaylists();
      } else {
        setErrorMsg("Đổi tên thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshPlaylists();
  }, []);

  if (!access)
    return <p className="text-white">Please login to use playlist</p>;

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
              key={playlist.id}
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            >
              {selectedPlaylist === playlist ? (
                <>
                  <input
                    className="bg-transparent border border-gray-600 p-1 rounded text-white mr-2"
                    type="text"
                    placeholder="New name"
                    value={renameValue}
                    onChange={(e) => {
                      e.stopPropagation();
                      setRenameValue(e.target.value);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      renamePlaylist(playlist.id, renameValue);
                    }}
                    className="px-2 py-1 rounded text-white bg-[rgb(18,18,18)] hover:opacity-80 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlaylist(null);
                    }}
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
                        setShowMenu((prev) =>
                          prev === playlist.name ? null : playlist.name
                        );
                      }}
                      className="px-2 py-1 text-white bg-[rgb(18,18,18)] rounded hover:opacity-80"
                    >
                      ⋮
                    </button>
                    {showMenu === playlist.name && (
                      <div className="absolute right-0 top-full mt-1 bg-[#242424] border border-gray-700 rounded shadow-md z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlaylist(playlist);
                            setRenameValue(playlist.name);
                            setShowMenu(null);
                          }}
                          className="block px-4 py-2 w-full text-left text-white hover:bg-gray-700"
                        >
                          Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePlaylist(playlist.id);
                          }}
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
