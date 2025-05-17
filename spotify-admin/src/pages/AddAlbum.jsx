import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "../utils/axiosConfig";
import { toast } from "react-toastify";

const AddAlbum = () => {
  const [coverImage, setCoverImage] = useState(null);
  //   const [colour, setcolour] = useState("#121212");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const requiredFields = { title, artist, coverImage, releaseDate };
      const emptyField = Object.entries(requiredFields).find(([key, value]) => !value);
      
      if (emptyField) {
        toast.error(`Field "${emptyField[0]}" is required.`);
      }
      else {
        const formData = new FormData();
        if (coverImage instanceof File) {
          formData.append("cover_image", coverImage);
        } else {
          console.error("Cover image is not a valid file.");
        }
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("cover_image", coverImage);
        formData.append("release_date", releaseDate);
  
        const response = await axios.post(`/admin/albums/`, formData);
        
        if (response) {
          toast.success("Album added");
          setArtist("");
          setCoverImage(null);
          setTitle("");
          setReleaseDate(null);
        } else {
          toast.error("Something went wrong");
        }

      }
    } catch (error) {
      toast.error("Error occur");
      console.error(error);
    }

    setLoading(false);
  };

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      <div className="flex flex-col gap-4">
        <p>Upload Cover Image</p>
        <input
          onChange={(e) => setCoverImage(e.target.files[0])}
          type="file"
          id="image"
          accept="image/*"
          hidden
        />
        <label htmlFor="image">
          <img
            className="w-24 cursor-pointer"
            src={
              coverImage ? URL.createObjectURL(coverImage) : assets.upload_area
            }
            alt=""
          />
        </label>
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album title</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          type="text"
          placeholder="Type here"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album artist</p>
        <input
          onChange={(e) => setArtist(e.target.value)}
          value={artist}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          type="text"
          placeholder="Type here"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album release date</p>
        <input
          type="date"
          onChange={(e) => setReleaseDate(e.target.value)}
          value={releaseDate ?? ""}
          max={
            new Date(Date.now() + 7 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          } // Ngày tối đa là hôm nay
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
        />
      </div>

      {/* <div className='flex flex-col gap-3'>
            <p>Backround Colour</p>
            <input onChange={(e)=>setcolour(e.target.value)} value={colour} type="color" />
        </div> */}

      <button
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
        type="submit"
      >
        ADD
      </button>
    </form>
  );
};

export default AddAlbum;
