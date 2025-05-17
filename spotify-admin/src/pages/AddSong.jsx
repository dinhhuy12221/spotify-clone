import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "../utils/axiosConfig";
import { toast } from "react-toastify";

// Component thêm bài hát mới
const AddSong = () => {
  // State quản lý dữ liệu bài hát
  const [coverImage, setCoverImage] = useState(null);
  const [song, setSong] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState(null);
  const [albumData, setAlbumData] = useState([]);
//   const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý khi form được gửi
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requiredFields = { title, artist, coverImage, album, song };
      const emptyField = Object.entries(requiredFields).find(([key, value]) => !value);

      if (emptyField) {
        toast.error(`Field "${emptyField[0]}" is required.`);
      }
      else {
        const formData = new FormData();
        
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("album", album);
        formData.append("audio_file", song);
        formData.append("cover_image", coverImage);
  
        // Gửi yêu cầu POST đến server
        const response = await axios.post(`/admin/songs/`, formData);
  
        // Kiểm tra phản hồi từ server
        if (response) {
          toast.success("Song added");
          setTitle("");
          setArtist("");
          setAlbumData("");
          setAlbum("")
          // setAudioFile(null);
          setCoverImage(null);
          setSong(false);
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (error) {
      toast.error("Error occured");
      console.error(error);
      
    }
    setLoading(false);
  };

  // Tải dữ liệu album từ server
  const loadAlbumData = async () => {
    try {
      const response = await axios.get(`/admin/albums/`);

      if (response) {
        setAlbumData(response.data);
      } else {
        toast.error("Unable to load albums data");
      }
    } catch (error) {
      toast.error("Error occur");
    }
  };

  // Tự động tải dữ liệu album khi component được mount
  useEffect(() => {
    loadAlbumData();
  }, [album]);

  // Hiển thị giao diện khi đang tải
  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <p>Upload song</p>
          <input
            onChange={(e) => setSong(e.target.files[0])}
            type="file"
            id="song"
            accept="audio/*"
            hidden
          />
          <label htmlFor="song">
            <img
              src={song ? assets.upload_added : assets.upload_song}
              className="w-24 cursor-pointer"
              alt=""
            />
          </label>
        </div>
        <div className="flex flex-col gap-4">
          <p>Upload Image</p>
          <input
            onChange={(e) => setCoverImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              src={
                coverImage
                  ? URL.createObjectURL(coverImage)
                  : assets.upload_area
              }
              className="w-24 cursor-pointer"
              alt="cover"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Song title</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          type="text"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Song artist</p>
        <input
          onChange={(e) => setArtist(e.target.value)}
          value={artist}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          type="text"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album</p>
        <select
          onChange={(e) => setAlbum(e.target.value)}
          defaultValue={album}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]"
        >
          <option value="">None</option>
          {albumData && albumData?.map((item, index) => (
            <option key={index} value={item?.id}>
              {item?.title}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
      >
        ADD
      </button>
    </form>
  );
};

export default AddSong;
