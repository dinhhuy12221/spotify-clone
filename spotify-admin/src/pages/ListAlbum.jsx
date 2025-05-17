import axios from "../utils/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InputModal from "../modals/InputModal";
import ConfirmModal from "../modals/ConfirmModal";
import SongListPopup from "../components/SongListPopup";

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [songFromAlbum, setSongFromAlbum] = useState([]);
  const [album, setAlbum] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const songsForCurrentAlbum = songFromAlbum.find(item => item?.albumId === album?.id)?.songs || [];


  const fetchAlbums = async () => {
    try {
      const response = await axios.get("/admin/albums/");

      if (response) {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Error occur");
    }
  };

  const fetchSongsFromAlbum = async () => {
    try {
      const allSongs = [];

      for (const album of data) {
        const response = await axios.get(`/admin/albums/${album.id}/songs`);
        const songsWithAlbum = {albumId: album.id, songs: response.data}
        allSongs.push(songsWithAlbum);
      }

      

      setSongFromAlbum(allSongs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmit = async (updatedData, id) => {
    try {
      console.log(updatedData);
      const formData = new FormData();

      // append text fields
      formData.append("title", updatedData.title);
      formData.append("artist", updatedData.artist);
      if (updatedData.cover_image instanceof File) {
        formData.append("cover_image", updatedData.cover_image);
      }

      const response = await axios.patch(`/admin/albums/${id}/`, formData);
      toast.success("Cập nhật thành công");
      setAlbum(null);
      await fetchAlbums();
    } catch (error) {
      toast.error("Lỗi khi cập nhật");
      console.error(error);
    }
  };

  const handleDeleteSubmit = async (id) => {
    try {
      const response = await axios.delete(`/admin/albums/${id}/`);

      toast.success("Xóa thành công");
      setAlbum(null);
      await fetchAlbums();
    } catch (error) {
      toast.error("Lỗi khi xóa");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
  if (data.length > 0) {
    fetchSongsFromAlbum(); // Chỉ gọi khi data đã có album
  }
}, [data]);

  return (
    <>
      <div>
        <p>All Albums List</p>
        <br />
        <div>
          <div className="sm:grid hidden grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
            <b>Cover Image</b>
            <b>Title</b>
            <b>Artist</b>
            <b>Songs</b>
            <b>Release date</b>
            <b>Actions</b>
          </div>
          {data?.map((item, index) => {
            return (
              <div
                key={index}
                className="grid grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] sm:grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
              >
                <img
                  className="w-12 h-12 object-cover"
                  src={item.cover_image}
                  alt="cover"
                />
                <p>{item.title}</p>
                <p>{item.artist}</p>
                <div>
                  <button
                    className="p-1 outline hover:bg-green-300"
                    onClick={() => {
                      setShowManage(true);
                      setAlbum(item);
                    }}
                  >
                    List Songs
                  </button>
                </div>
                {new Date(item.release_date).toLocaleString("vi-VN", {
                  timeZone: "Asia/Ho_Chi_Minh",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  // hour: "2-digit",
                  // minute: "2-digit",
                  // second: "2-digit",
                  // hour12: false,
                })}
                <div className="flex gap-2">
                  <EditIcon
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setAlbum(item);
                      setShowEdit(true);
                    }}
                  />
                  <DeleteIcon
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => {
                      setShowDelete(true);
                      setAlbum(item);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showEdit && (
        <InputModal
          title="Edit album"
          inputs={[
            {
              name: "cover_image",
              label: "Cover Image",
              type: "file",
              accept: "image/*",
              defaultValue: album?.cover_image,
            },
            { name: "title", label: "Title", defaultValue: album?.title },
            { name: "artist", label: "Artist", defaultValue: album?.artist },
          ]}
          onSubmit={(updatedData) => {
            handleEditSubmit(updatedData, album.id);
            setShowEdit(false);
          }}
          onCancel={() => {
            setAlbum(null);
            setShowEdit(false);
          }}
        />
      )}
      {showDelete && (
        <ConfirmModal
          title="Delete user"
          message={`Are you sure you want to delete this album: ${album.title}`}
          onConfirm={() => {
            handleDeleteSubmit(album.id);
            setShowDelete(false);
          }}
          onCancel={() => {
            setDeleteUser(null);
            setShowDelete(false);
          }}
        />
      )}
      {showManage && album && (
        <SongListPopup
          songs={songsForCurrentAlbum}
          onClose={() => setShowManage(false)}
        />
      )}
    </>
  );
};

export default ListAlbum;
