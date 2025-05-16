import axios from "../utils/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Component hiển thị danh sách bài hát
const ListSong = () => {
  //danh sách bài hát
  const [data, setData] = useState([]);
  const [song, setSong] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Hàm tải danh sách bài hát từ server
  const fetchSongs = async () => {
    try {
      const response = await axios.get(`/songs/`);

      if (response.data.success) {
        setData(response.data.songs);
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  // Hàm xóa bài hát
  const removeSong = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/songs/`, { id });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSongs();
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  // Tự động gọi `fetchSongs` khi component được mount
  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <p>All Songs List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Title</b>
          <b>Artist</b>
          <b>Duration</b>
          <b>Created At</b>
          <b>Album</b>
          <b>Actions</b>
        </div>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 borber border-gray-300 text-sm mr-5"
            >
              <img className="w-12" src={item.image} alt="" />
              <p>{item.image}</p>
              <p>{item.title}</p>
              <p>{item.artist}</p>
              <p>{item.duration}</p>
              <p>{item.created_at}</p>
              <p>{item.album}</p>
              <p>{item.created_at}</p>
              <div className="flex gap-2">
                <EditIcon
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                  onClick={() => setEditUserData(item)}
                />
                <DeleteIcon
                  className="cursor-pointer text-red-600 hover:text-red-800"
                  onClick={() => {
                    setShowDelete(true);
                    setDeleteUser(item);
                  }}
                />
              </div>
              <p
                className="cursor-pointer"
                onClick={() => removeSong(item._id)}
              >
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListSong;
