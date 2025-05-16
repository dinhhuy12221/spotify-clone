import axios from "../utils/axiosConfig";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [album, setAlbum] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get("/admin/albums/");
      console.log(response);

      if (response) {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Error occur");
    }
  };

  const removeAlbum = async (id) => {
    try {
      const response = await axios.post(`/admin/albums/${id}`);

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums();
      }
    } catch (error) {
      toast.error("Error occur");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
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
              <p>{item?.songs ?? ""}</p>
              <p>{item.release_date}</p>
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

export default ListAlbum;
