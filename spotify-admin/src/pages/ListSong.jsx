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
      const response = await axios.get(`/admin/songs/`);
      console.log(response);

      if (response) {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  // const fetchAlbum = async () => {
  //   try {
  //     const response = await axios.get(`/admin/albums/${data.album}}`);
  //     console.log(response);

  //     if (response) {
  //       setData(response.data);
  //     }
  //   } catch (error) {
  //     toast.error("Error Occur");
  //   }
  // };

  // Hàm xóa bài hát
  const removeSong = async (id) => {
    try {
      const response = await axios.delete(`/admin/songs/`, { id });

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
        <div className="sm:grid hidden grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>ID</b>
          <b>Image</b>
          <b>Title</b>
          <b>Artist</b>
          <b>Album</b>
          <b>Audio</b>
          <b>Created At</b>
          <b>Actions</b>
        </div>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2.5 p-3 borber border-gray-300 text-sm mr-5"
            >
              <p>{item.id}</p>
              <img
                className="w-12 h-12 object-cover"
                src={item?.cover_image}
                alt="cover"
              />
              <p>{item.title}</p>
              <p>{item.artist}</p>
              <p>{item.album}</p>
              <a
                href={item.audio_file}
                download
                target="_blank"
                className="text-blue-500 underline"
              >
                Download
              </a>
              <p>
                {new Date(item.created_at).toLocaleString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </p>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListSong;
