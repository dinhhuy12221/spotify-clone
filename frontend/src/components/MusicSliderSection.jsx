import React from "react";
import Slider from "react-slick";
import SongItem from "./SongItem";
import { assets } from "../assets/assets";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="slick-arrow slick-prev z-10 absolute left-0 top-1/2 transform -translate-y-1/2"
    >
      <img src={assets.arrow_left} alt="Previous" className="w-6 h-6" />
    </button>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="slick-arrow slick-next z-10 absolute right-0 top-1/2 transform -translate-y-1/2"
    >
      <img src={assets.arrow_right} alt="Next" className="w-6 h-6" />
    </button>
  );
};

const MusicSliderSection = ({
  title,
  songs,
  onClickSong,
  onPrevPage,
  onNextPage,
  fetchSongs
}) => {
  const sliderSettings = {
    infinite: false,
    speed: 500,
    cssEase: "ease-in-out",
    useCSS: true,
    useTransform: true,
    draggable: true,
    swipeToSlide: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
  // console.log(songs);

  return (
    <div className="my-6 relative">
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      <Slider {...sliderSettings}>
        {songs.map((song, index) => (
          <div key={index} className="px-2">
            <SongItem key={song?.id} song={song} onPlay={() => onClickSong(song)} onRemoved={fetchSongs} />
          </div>
        ))}
      </Slider>

      {onPrevPage && onNextPage && (
        <div className="flex justify-between mt-4 items-center">
          <button onClick={onPrevPage} className="focus:outline-none">
            <img src={assets.arrow_left} alt="Previous" className="w-4 h-4" />
          </button>
          <button onClick={onNextPage} className="focus:outline-none">
            <img src={assets.arrow_right} alt="Next" className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicSliderSection;

// import React, { useState } from "react";
// import Slider from "react-slick";  // Import Slick Slider
// import { assets } from "../assets/assets";  // Import icon mũi tên từ assets

// const MusicSliderSection = ({ title, songs, onClickSong, onPrevPage, onNextPage }) => {
//   // Cấu hình cho Slick Slider
//   const sliderSettings = {
//     infinite: false,
//     speed: 500,
//     slidesToShow: 6,  // Hiển thị 6 bài hát mỗi lần
//     slidesToScroll: 1,
//     nextArrow: <img src={assets.arrow_right} alt="Next" className="slick-arrow slick-next w-4 h-4" />,  // Giảm kích thước mũi tên
//     prevArrow: <img src={assets.arrow_left} alt="Previous" className="slick-arrow slick-prev w-4 h-4" />,  // Giảm kích thước mũi tên
//   };

//   return (
//     <div className="my-4">
//       <h2 className="text-xl font-bold">{title}</h2>

//       {/* Slick Slider */}
//       <Slider {...sliderSettings}>
//         {songs.map((song, index) => (
//           <div
//             key={index}
//             className="w-32 h-40 bg-gray-300 rounded-lg p-2 flex flex-col items-center cursor-pointer"
//             onClick={() => onClickSong(song)}
//           >
//             <img src={song.image} alt={song.name} className="w-full h-24 object-cover rounded" />
//             <p className="text-center mt-2">{song.name}</p>
//           </div>
//         ))}
//       </Slider>

//       {/* Điều hướng phân trang - Cập nhật số trang với icon mũi tên */}
//       <div className="flex justify-between mt-4 items-center">
//         <img
//           className="w-4 h-4 cursor-pointer"
//           src={assets.arrow_left}
//           alt="Previous"
//           onClick={onPrevPage}
//         />

//         <img
//           className="w-4 h-4 cursor-pointer"
//           src={assets.arrow_right}
//           alt="Next"
//           onClick={onNextPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default MusicSliderSection;
