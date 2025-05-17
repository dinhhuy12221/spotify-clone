import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SongItem from "./SongItem";
import defaultImage from "../assets/default.png";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

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

// /**
//  * SliderSection
//  * @param {String} title - section title
//  * @param {Array} items - list of items (song objects or album songIds)
//  * @param {String} type - "song" or "album"
//  * @param {Function} onPlay - callback when play button clicked
//  * @param {Function} fetchSongs - for song type, callback to reload after remove
//  */
const SliderSection = ({
  title,
  items,
  type,
  onPrevPage,
  onNextPage,
  onPlay,
  fetchSongs,
}) => {
  const settings = {
    infinite: false,
    speed: 500,
    cssEase: "ease-in-out",
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
  const navigate = useNavigate();

  return (
    <div className="my-6 mt-16 relative">
      {title && <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>}
      <Slider {...settings}>
        {items.map((item, idx) => (
          <div key={idx} className="px-2">
            {type === "song" ? (
              <SongItem
                song={item}
                onPlay={() => onPlay(item)}
                onRemoved={fetchSongs}
              />
            ) : (
              // album type: custom card UI without buttons
              <div
                className="relative bg-black rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/album/${item.id}`)}
              >
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={item.cover_image || defaultImage}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <h3 className="text-sm font-semibold line-clamp-2 text-white">
                    {item.title}
                  </h3>
                  {item.artist && (
                    <p className="text-xs text-gray-300">{item.artist}</p>
                  )}
                </div>
              </div>
            )}
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

export default SliderSection;

// import Slider from "react-slick";
// import SongItem from "./SongItem";
// import { assets } from "../assets/assets";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Custom arrow components
// const PrevArrow = (props) => {
//   const { onClick } = props;
//   return (
//     <button
//       onClick={onClick}
//       className="slick-arrow slick-prev z-10 absolute left-0 top-1/2 transform -translate-y-1/2"
//     >
//       <img src={assets.arrow_left} alt="Previous" className="w-6 h-6" />
//     </button>
//   );
// };

// const NextArrow = (props) => {
//   const { onClick } = props;
//   return (
//     <button
//       onClick={onClick}
//       className="slick-arrow slick-next z-10 absolute right-0 top-1/2 transform -translate-y-1/2"
//     >
//       <img src={assets.arrow_right} alt="Next" className="w-6 h-6" />
//     </button>
//   );
// };

// const MusicSliderSection = ({
//   title,
//   songs,
//   onClickSong,
//   onPrevPage,
//   onNextPage,
//   fetchSongs
// }) => {
//   const sliderSettings = {
//     infinite: false,
//     speed: 500,
//     cssEase: "ease-in-out",
//     useCSS: true,
//     useTransform: true,
//     draggable: true,
//     swipeToSlide: true,
//     slidesToShow: 6,
//     slidesToScroll: 1,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       { breakpoint: 1280, settings: { slidesToShow: 5 } },
//       { breakpoint: 1024, settings: { slidesToShow: 4 } },
//       { breakpoint: 768, settings: { slidesToShow: 2 } },
//       { breakpoint: 480, settings: { slidesToShow: 1 } },
//     ],
//   };
//   // console.log(songs);

//   return (
//     <div className="my-6 mt-16 relative">
//       <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
//       <Slider {...sliderSettings}>
//         {songs.map((song, index) => (
//           <div key={index} className="px-2">
//             <SongItem key={song?.id} song={song} onPlay={() => onClickSong(song)} onRemoved={fetchSongs} />
//           </div>
//         ))}
//       </Slider>

//       {onPrevPage && onNextPage && (
//         <div className="flex justify-between mt-4 items-center">
//           <button onClick={onPrevPage} className="focus:outline-none">
//             <img src={assets.arrow_left} alt="Previous" className="w-4 h-4" />
//           </button>
//           <button onClick={onNextPage} className="focus:outline-none">
//             <img src={assets.arrow_right} alt="Next" className="w-4 h-4" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MusicSliderSection;
