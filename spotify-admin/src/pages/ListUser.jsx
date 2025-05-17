import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import axios from "../utils/axiosConfig";
import InputModal from "../modals/InputModal";
import ConfirmModal from "../modals/ConfirmModal";

const ListUser = () => {
  const [data, setData] = useState([]);
  const [editUserData, setEditUserData] = useState(null); // user đang chỉnh sửa
  const [deleteUser, setDeleteUser] = useState(null); // user đang chỉnh sửa
  const [showDelete, setShowDelete] = useState(false); // user đang chỉnh sửa

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/admin/users/");

      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || error.message);
    }
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      const response = await axios.put(
        `/admin/users/${editUserData.id}/`,
        updatedData
      );
      toast.success("Cập nhật thành công");
      setEditUserData(null);
      await fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi cập nhật");
    }
  };

  const handleDeleteSubmit = async (id) => {
    try {
      const response = await axios.delete(`/admin/users/${id}/`);

      toast.success("Xóa thành công");
      setDeleteUser(null);
      await fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  // Tự động gọi `fetchSongs` khi component được mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div>
        <p>All Users List</p>
        <br />
        <div>
          <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
            <b>Username</b>
            <b>Email</b>
            <b>Playlist</b>
            <b>Actions</b>
          </div>
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 borber border-gray-300 text-sm mr-5"
              >
                {/* <img className='w-12' src={item.image} alt="" /> */}
                <p>{item.username}</p>
                <p>{item.email}</p>
                <div>
                  {item.playlists.map((playlist, index) => (
                    <p key={index}>
                      <b>{playlist.name}</b>: {playlist.songs}
                    </p>
                  ))}
                </div>
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
      {editUserData && (
        <InputModal
          title="Edit user"
          inputs={[
            // {
            //   name: "username",
            //   label: "Username",
            //   defaultValue: editUserData.username,
            // },
            { name: "email", label: "Email", defaultValue: editUserData.email },
          ]}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditUserData(null)}
        />
      )}
      {showDelete && (
        <ConfirmModal
          title="Delete user"
          message={`Are you sure you want to delete this user: ${deleteUser.username}`}
          onConfirm={() => {
            handleDeleteSubmit(deleteUser.id);
            setShowDelete(false);
          }}
          onCancel={() => {
            setDeleteUser(null);
            setShowDelete(false);
          }}
        />
      )}
    </>
  );
};

export default ListUser;
