import React, { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/assets";
import ReactPlayer from "react-player";

const Player = () => {
  const {
    track,
    playStatus,
    play,
    pause,
    previous,
    next,
    seekSong,
    time,
    loop,
    toggleLoop,
  } = useContext(PlayerContext);

  const [showVideo, setShowVideo] = useState(false);
  const seekBgRef = useRef(null);
  const seekBarRef = useRef(null);

  useEffect(() => {
    if (seekBarRef.current) {
      const totalSec = time.totalTime.minute * 60 + time.totalTime.second;
      const currentSec = time.currentTime.minute * 60 + time.currentTime.second;
      const percent = totalSec ? (currentSec / totalSec) * 100 : 0;
      seekBarRef.current.style.width = `${percent}%`;
    }
  }, [time]);

  if (!track) return null;

  return (
    <div className="w-full fixed bottom-0 left-0">
      <div className="bg-black flex justify-between items-center text-white px-4">
        <div className="hidden lg:flex items-center gap-4">
          <img
            className="w-12"
            src={track?.thumbnail || track?.image}
            alt="Track cover"
          />
          <div>
            <p>{track?.title || track?.name}</p>
            {track?.artist && <p>{track?.artist}</p>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 m-auto w-full max-w-2xl">
          <div className="flex gap-4 items-center">
            <img
              onClick={previous}
              className="w-4 cursor-pointer"
              src={assets.prev_icon}
              alt="Previous"
            />
            {playStatus ? (
              <img
                onClick={pause}
                className="w-6 cursor-pointer"
                src={assets.pause_icon}
                alt="Pause"
              />
            ) : (
              <img
                onClick={play}
                className="w-6 cursor-pointer"
                src={assets.play_icon}
                alt="Play"
              />
            )}
            <img
              onClick={next}
              className="w-4 cursor-pointer"
              src={assets.next_icon}
              alt="Next"
            />
            <img
              onClick={toggleLoop}
              className={`w-4 cursor-pointer transition-transform ${
                loop ? "animate-spin text-green-500" : ""
              }`}
              src={assets.loop_icon}
              alt="Loop"
            />
          </div>

          <div className="flex items-center gap-4 w-full">
            <p>
              {`${time.currentTime.minute}:${time.currentTime.second
                .toString()
                .padStart(2, "0")}`}
            </p>
            <div
              ref={seekBgRef}
              onClick={(e) => {
                const clickX = e.nativeEvent.offsetX;
                const width = seekBgRef.current.offsetWidth;
                const totalSec =
                  time.totalTime.minute * 60 + time.totalTime.second;
                const toSec = (clickX / width) * totalSec;
                seekSong(toSec);
              }}
              className="w-full bg-gray-300 rounded-full cursor-pointer"
            >
              <div
                ref={seekBarRef}
                className="h-1 bg-green-800 rounded-full w-0"
              ></div>
            </div>
            <p>
              {`${time.totalTime.minute}:${time.totalTime.second
                .toString()
                .padStart(2, "0")}`}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-0">
        <ReactPlayer
          src={track?.spotify_url}
          playing={playStatus}
          loop={loop}
          width={0}
          height={0}
        />
      </div>
    </div>
  );
};

export default Player;


// src/components/Player.jsx
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { PlayerContext } from "../context/PlayerContext";
// import { assets } from "../assets/assets";
// import ReactPlayer from "react-player";

// const Player = () => {
//   const {
//     track,
//     playStatus,
//     play,
//     pause,
//     previous,
//     next,
//     seekSong,
//     time,
//     loop,
//     toggleLoop,
//   } = useContext(PlayerContext);

//   const [showVideo, setShowVideo] = useState(false);
//   const seekBgRef = useRef(null);
//   const seekBarRef = useRef(null);

//   // Cập nhật thanh seek bar
//   useEffect(() => {
//     if (seekBarRef.current) {
//       const totalSec = time.totalTime.minute * 60 + time.totalTime.second;
//       const currentSec =
//         time.currentTime.minute * 60 + time.currentTime.second;
//       const percent = totalSec ? (currentSec / totalSec) * 100 : 0;
//       seekBarRef.current.style.width = `${percent}%`;
//     }
//   }, [time]);

//   if (!track) return null;

//   // Có video YouTube?
//   // const hasVideo = track?.link && ReactPlayer.canPlay(track?.link) && track?.link.includes("youtube");

//   return (
//     <div className="w-full">

//       {/* Audio controls */}
//       <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
//         <div className="hidden lg:flex items-center gap-4">
//           <img
//             className="w-12"
//             src={track?.thumbnail || track?.image}
//             alt="Track cover"
//           />
//           <div>
//             <p>{track?.title || track?.name}</p>
//             {track?.channel && <p>{track?.channel}</p>}
//           </div>
//         </div>

//         <div className="flex flex-col items-center gap-1 m-auto w-full max-w-2xl">
//           <div className="flex gap-4 items-center">
//             <img
//               onClick={previous}
//               className="w-4 cursor-pointer"
//               src={assets.prev_icon}
//               alt="Previous"
//             />
//             {playStatus ? (
//               <img
//                 onClick={pause}
//                 className="w-6 cursor-pointer"
//                 src={assets.pause_icon}
//                 alt="Pause"
//               />
//             ) : (
//               <img
//                 onClick={play}
//                 className="w-6 cursor-pointer"
//                 src={assets.play_icon}
//                 alt="Play"
//               />
//             )}
//             <img
//               onClick={next}
//               className="w-4 cursor-pointer"
//               src={assets.next_icon}
//               alt="Next"
//             />
//             <img
//               onClick={toggleLoop}
//               className={`w-4 cursor-pointer transition-transform ${
//                 loop ? "animate-spin text-green-500" : ""
//               }`}
//               src={assets.loop_icon}
//               alt="Loop"
//             />
//           </div>

//           <div className="flex items-center gap-4 w-full">
//             <p>
//               {`${time.currentTime.minute}:${time.currentTime.second
//                 .toString()
//                 .padStart(2, "0")}`}
//             </p>
//             <div
//               ref={seekBgRef}
//               onClick={(e) => {
//                 const clickX = e.nativeEvent.offsetX;
//                 const width = seekBgRef.current.offsetWidth;
//                 const totalSec =
//                   time.totalTime.minute * 60 + time.totalTime.second;
//                 const toSec = (clickX / width) * totalSec;
//                 seekSong(toSec);
//               }}
//               className="w-full bg-gray-300 rounded-full cursor-pointer"
//             >
//               <div
//                 ref={seekBarRef}
//                 className="h-1 bg-green-800 rounded-full w-0"
//               ></div>
//             </div>
//             <p>
//               {`${time.totalTime.minute}:${time.totalTime.second
//                 .toString()
//                 .padStart(2, "0")}`}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Player;


// src/components/Player.jsx
/* ---------- src/components/Player.jsx ---------- */

// import React, { useContext, useEffect, useRef } from "react";
// import { PlayerContext } from "../context/PlayerContext";
// import { assets } from "../assets/assets";

// const Player = () => {
//   const {
//     track,
//     playStatus,
//     play,
//     pause,
//     previous,
//     next,
//     seekSong,
//     time,
//     loop,
//     toggleLoop
//   } = useContext(PlayerContext);

//   const seekBgRef = useRef(null);
//   const seekBarRef = useRef(null);

//   // Cập nhật thanh seek bar
//   useEffect(() => {
//     if (seekBarRef.current) {
//       const totalSec = time.totalTime.minute * 60 + time.totalTime.second;
//       const currentSec = time.currentTime.minute * 60 + time.currentTime.second;
//       const percent = totalSec ? (currentSec / totalSec) * 100 : 0;
//       seekBarRef.current.style.width = `${percent}%`;
//     }
//   }, [time]);

//   if (!track) return null;

//   return (
//     <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
//       <div className="hidden lg:flex items-center gap-4">
//         <img className="w-12" src={track?.thumbnail || track?.image} alt="Track cover" />
//         <div>
//           <p>{track?.title || track?.name}</p>
//           {track?.channel && <p>{track?.channel}</p>}
//         </div>
//       </div>

//       <div className="flex flex-col items-center gap-1 m-auto w-full max-w-2xl">
//         <div className="flex gap-4 items-center">
//           <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="Shuffle" />
//           <img onClick={previous} className="w-4 cursor-pointer" src={assets.prev_icon} alt="Previous" />
//           {playStatus ? (
//             <img onClick={pause} className="w-6 cursor-pointer" src={assets.pause_icon} alt="Pause" />
//           ) : (
//             <img onClick={play} className="w-6 cursor-pointer" src={assets.play_icon} alt="Play" />
//           )}
//           <img onClick={next} className="w-4 cursor-pointer" src={assets.next_icon} alt="Next" />

//           {/* Loop button with click animation */}
//           <img
//             onClick={toggleLoop}
//             className={`w-4 cursor-pointer transform transition duration-300 ease-in-out
//               ${loop ? 'text-green-500 scale-110 animate-spin' : 'text-white hover:scale-125'}`}
//             src={assets.loop_icon}
//             alt="Loop"
//           />
//         </div>

//         <div className="flex items-center gap-4 w-full">
//           <p>{`${time.currentTime.minute}:${time.currentTime.second.toString().padStart(2, '0')}`}</p>
//           <div
//             ref={seekBgRef}
//             onClick={e => {
//               const clickX = e.nativeEvent.offsetX;
//               const width = seekBgRef.current.offsetWidth;
//               const totalSec = time.totalTime.minute * 60 + time.totalTime.second;
//               const toSec = (clickX / width) * totalSec;
//               seekSong(toSec);
//             }}
//             className="w-full bg-gray-300 rounded-full cursor-pointer"
//           >
//             <div ref={seekBarRef} className="h-1 bg-green-800 rounded-full w-0"></div>
//           </div>
//           <p>{`${time.totalTime.minute}:${time.totalTime.second.toString().padStart(2, '0')}`}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Player;



// import React, { useContext, useEffect, useRef } from "react";
// import { PlayerContext } from "../context/PlayerContext";
// import { assets } from "../assets/assets";

// const Player = () => {
//   const { track, seekBg, seekBar, playStatus, play, pause, time, previous, next, seekSong } = useContext(PlayerContext);
//   const seekBarRef = useRef(null);

//   useEffect(() => {
//     if (seekBarRef.current) {
//       const percent = time.totalTime.second
//         ? (time.currentTime.second + time.currentTime.minute * 60) / (time.totalTime.second + time.totalTime.minute * 60) * 100
//         : 0;
//       seekBarRef.current.style.width = `${percent}%`;
//     }
//   }, [time]);

//   if (!track) return null;

//   return (
//     <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
//       <div className="hidden lg:flex items-center gap-4">
//         <img className="w-12" src={track?.thumbnail || track?.image} alt="Track cover" />
//         <div>
//           <p>{track?.title || track?.name}</p>
//           {track?.channel && <p>{track?.channel}</p>}
//         </div>
//       </div>
//       <div className="flex flex-col items-center gap-1 m-auto w-full max-w-2xl">
//         <div className="flex gap-4 items-center">
//           <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="Shuffle" />
//           <img onClick={previous} className="w-4 cursor-pointer" src={assets.prev_icon} alt="Previous" />
//           {playStatus ? (
//             <img onClick={pause} className="w-6 cursor-pointer" src={assets.pause_icon} alt="Pause" />
//           ) : (
//             <img onClick={play} className="w-6 cursor-pointer" src={assets.play_icon} alt="Play" />
//           )}
//           <img onClick={next} className="w-4 cursor-pointer" src={assets.next_icon} alt="Next" />
//           <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="Loop" />
//         </div>
//         <div className="flex items-center gap-4 w-full">
//           <p>{`${time.currentTime.minute}:${time.currentTime.second.toString().padStart(2, '0')}`}</p>
//           <div ref={seekBg} onClick={seekSong} className="w-full bg-gray-300 rounded-full cursor-pointer">
//             <div ref={seekBarRef} className="h-1 bg-green-800 rounded-full w-0"></div>
//           </div>
//           <p>{`${time.totalTime.minute}:${time.totalTime.second.toString().padStart(2, '0')}`}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Player;

