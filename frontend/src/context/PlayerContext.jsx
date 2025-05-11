
// import React, { createContext, useEffect, useRef, useState } from "react";
// import ReactPlayer from "react-player";

// export const PlayerContext = createContext();

// const PlayerContextProvider = ({ children }) => {
//   const playerRef = useRef(null);

//   const [trackList, setTrackList] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [track, setTrack] = useState(null);
//   const [playStatus, setPlayStatus] = useState(false);
//   const [loop, setLoop] = useState(false);
//   const [time, setTime] = useState({
//     currentTime: { second: 0, minute: 0 },
//     totalTime:   { second: 0, minute: 0 },
//   });

//   const playWithId = (song, list = null) => {
//     const listToUse = list || trackList;
//     const idx = listToUse.findIndex(s => s.spotify_url === song.spotify_url);
//     if (idx !== -1) {
//       setTrackList(listToUse);
//       setCurrentIndex(idx);
//       setTrack(song);
//       setPlayStatus(true);
//     }
//   };

//   const play = () => setPlayStatus(true);
//   const pause = () => setPlayStatus(false);
//   const previous = () => {
//     if (currentIndex > 0) playWithId(trackList[currentIndex - 1], trackList);
//   };
//   const next = () => {
//     if (currentIndex < trackList.length - 1) playWithId(trackList[currentIndex + 1], trackList);
//   };

//   const toggleLoop = () => setLoop(v => !v);

//   const seekSong = seconds => {
//     if (playerRef.current) playerRef.current.seekTo(seconds, "seconds");
//   };

//   useEffect(() => {
//     let interval;
//     if (track && playStatus) {
//       interval = setInterval(() => {
//         const played = playerRef.current.getCurrentTime() || 0;
//         const duration = playerRef.current.getDuration() || 0;
//         setTime({
//           currentTime: { second: Math.floor(played % 60), minute: Math.floor(played / 60) },
//           totalTime: { second: Math.floor(duration % 60), minute: Math.floor(duration / 60) }
//         });
//       }, 500);
//     }
//     console.log(2);
//     return () => clearInterval(interval);
//   }, [track, playStatus]);

//   console.log(1);
  

//   return (
//     <PlayerContext.Provider value={{
//       track, playStatus, loop, time,
//       play, pause, previous, next, seekSong, toggleLoop, playWithId
//     }}>
//       {children}
//       <ReactPlayer
//         ref={playerRef}
//         url={track?.spotify_url}
//         playing={playStatus}
//         loop={loop}
//         // width={0}
//         // height={0}
//         onEnded={() => loop ? undefined : next()}
//       />
//     </PlayerContext.Provider>
//   );
// };

// export default PlayerContextProvider;




// src/context/PlayerContext.jsx
// import React, { createContext, useEffect, useRef, useState } from "react";
// import ReactPlayer from "react-player";

// export const PlayerContext = createContext();

// const PlayerContextProvider = ({ children }) => {
//   const playerRef = useRef(null);

//   const [trackList, setTrackList] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [track, setTrack] = useState(null);
//   const [playStatus, setPlayStatus] = useState(false);
//   const [loop, setLoop] = useState(false);
//   const [time, setTime] = useState({
//     currentTime: { second: 0, minute: 0 },
//     totalTime:   { second: 0, minute: 0 },
//   });

//   const playWithId = (song, list = null) => {
//     const listToUse = list || trackList;
//     const idx = listToUse.findIndex(s => s.link === song.link);
//     if (idx !== -1) {
//       setTrackList(listToUse);
//       setCurrentIndex(idx);
//       setTrack(song);
//       setPlayStatus(true);
//     }
//   };

//   const play     = () => setPlayStatus(true);
//   const pause    = () => setPlayStatus(false);
//   const previous = () => {
//     if (currentIndex > 0) playWithId(trackList[currentIndex - 1], trackList);
//   };
//   const next     = () => {
//     if (currentIndex < trackList.length - 1) playWithId(trackList[currentIndex + 1], trackList);
//   };

//   const toggleLoop = () => setLoop(v => !v);

//   const seekSong = seconds => {
//     if (playerRef.current) playerRef.current.seekTo(seconds, "seconds");
//   };

//   // Cập nhật currentTime và totalTime mỗi 0.5s khi đang phát
//   useEffect(() => {
//     let interval;
//     if (track && playStatus) {
//       interval = setInterval(() => {
//         const played   = playerRef.current.getCurrentTime() || 0;
//         const duration = playerRef.current.getDuration()   || 0;
//         setTime({
//           currentTime: { second: Math.floor(played % 60), minute: Math.floor(played / 60) },
//           totalTime:   { second: Math.floor(duration % 60), minute: Math.floor(duration / 60) }
//         });
//       }, 500);
//     }
//     return () => clearInterval(interval);
//   }, [track, playStatus]);

//   return (
//     <PlayerContext.Provider value={{
//       track, playStatus, loop, time,
//       play, pause, previous, next, seekSong, toggleLoop, playWithId
//     }}>
//       {children}

//       {/* ReactPlayer ẩn: đảm nhiệm phát cả audio & video */}
//       <ReactPlayer
//         ref={playerRef}
//         url={track?.link}
//         playing={playStatus}
//         loop={loop}
//         width={0}
//         height={0}
//         onEnded={() => loop ? undefined : next()}
//       />
//     </PlayerContext.Provider>
//   );
// };

// export default PlayerContextProvider;



import React, { createContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const playerRef = useRef(null);

  const [trackList, setTrackList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [loop, setLoop] = useState(false); // loop state
  const [time, setTime] = useState({ currentTime: { second: 0, minute: 0 }, totalTime: { second: 0, minute: 0 } });

  const playWithId = (song, list = null) => {
    const listToUse = list || trackList;
    const idx = listToUse.findIndex(s => s.link === song.link);
    if (idx !== -1) {
      setTrackList(listToUse);
      setCurrentIndex(idx);
      setTrack(song);
      setPlayStatus(true);
    }
  };

  const play     = () => setPlayStatus(true);
  const pause    = () => setPlayStatus(false);
  const previous = () => {
    if (currentIndex > 0) playWithId(trackList[currentIndex - 1], trackList);
  };
  const next     = () => {
    if (currentIndex < trackList.length - 1) playWithId(trackList[currentIndex + 1], trackList);
  };

  const toggleLoop = () => setLoop(prev => !prev);

  const seekSong = (seconds) => {
    if (playerRef.current) playerRef.current.seekTo(seconds, "seconds");
  };

  useEffect(() => {
    let interval;
    if (track && playStatus) {
      interval = setInterval(() => {
        const played   = playerRef.current.getCurrentTime() || 0;
        const duration = playerRef.current.getDuration()   || 0;
        setTime({
          currentTime: { second: Math.floor(played % 60), minute: Math.floor(played / 60) },
          totalTime:   { second: Math.floor(duration % 60), minute: Math.floor(duration / 60) }
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [track, playStatus]);

  return (
    <PlayerContext.Provider value={{
      track, playStatus, loop, time,
      play, pause, previous, next, seekSong, toggleLoop, playWithId
    }}>
      {children}
      <ReactPlayer
        ref={playerRef}
        url={track?.url}
        playing={playStatus}
        loop={loop}
        width={0}
        height={0}
        onEnded={() => loop ? undefined : next()}
      />
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;


// src/context/PlayerContext.jsx
// import React, { createContext, useEffect, useRef, useState } from "react";
// import ReactPlayer from "react-player";

// export const PlayerContext = createContext();

// const PlayerContextProvider = ({ children }) => {
//   const playerRef = useRef(null);

//   const [trackList, setTrackList] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [track, setTrack] = useState(null);
//   const [playStatus, setPlayStatus] = useState(false);
//   const [time, setTime] = useState({
//     currentTime: { second: 0, minute: 0 },
//     totalTime:  { second: 0, minute: 0 }
//   });

//   const playWithId = (song, list = null) => {
//     const listToUse = list || trackList;
//     const idx = listToUse.findIndex(s => s.link === song.link);
//     if (idx !== -1) {
//       setTrackList(listToUse);
//       setCurrentIndex(idx);
//       setTrack(song);
//       setPlayStatus(true);
//     }
//   };

//   const play     = () => setPlayStatus(true);
//   const pause    = () => setPlayStatus(false);
//   const previous = () => {
//     if (currentIndex > 0) playWithId(trackList[currentIndex - 1], trackList);
//   };
//   const next     = () => {
//     if (currentIndex < trackList.length - 1)
//       playWithId(trackList[currentIndex + 1], trackList);
//   };

//   const seekSong = (seconds) => {
//     if (playerRef.current) {
//       playerRef.current.seekTo(seconds, "seconds");
//     }
//   };

//   // Cập nhật time every 0.5s
//   useEffect(() => {
//     let interval;
//     if (track && playStatus) {
//       interval = setInterval(() => {
//         const played   = playerRef.current.getCurrentTime() || 0;
//         const duration = playerRef.current.getDuration()   || 0;
//         setTime({
//           currentTime: { second: Math.floor(played % 60), minute: Math.floor(played / 60) },
//           totalTime:   { second: Math.floor(duration % 60), minute: Math.floor(duration / 60) }
//         });
//       }, 500);
//     }
//     return () => clearInterval(interval);
//   }, [track, playStatus]);

//   return (
//     <PlayerContext.Provider value={{
//       track, playStatus, time,
//       play, pause, previous, next, seekSong, playWithId
//     }}>
//       {children}
//       {/* ReactPlayer chỉ chạy ngầm, không hiển thị */}
//       <ReactPlayer
//         ref={playerRef}
//         url={track?.link}
//         playing={playStatus}
//         width={0}
//         height={0}
//         onEnded={next}
//       />
//     </PlayerContext.Provider>
//   );
// };

// export default PlayerContextProvider;



// import React, { createContext, useEffect, useRef, useState } from "react";

// export const PlayerContext = createContext();

// const PlayerContextProvider = ({ children }) => {
//   const audioRef = useRef(null);
//   const seekBg = useRef(null);
//   const seekBar = useRef(null);

//   const [trackList, setTrackList] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [playStatus, setPlayStatus] = useState(false);
//   const [time, setTime] = useState({ currentTime: { second: 0, minute: 0 }, totalTime: { second: 0, minute: 0 } });

//   const playWithId = (song, list = null) => {
//     const listToUse = list || trackList;
//     const idx = listToUse.findIndex((s) => s.link === song.link);
//     if (idx !== -1) {
//       setCurrentIndex(idx);
//       setTrackList(listToUse);
//       setTrack(song);
//       audioRef.current.src = song.link;
//       audioRef.current.play();
//       setPlayStatus(true);
//     }
//   };

//   const [track, setTrack] = useState(null);

//   const play = () => { audioRef.current.play(); setPlayStatus(true); };
//   const pause = () => { audioRef.current.pause(); setPlayStatus(false); };

//   const previous = () => {
//     if (trackList.length && currentIndex > 0) {
//       const prev = trackList[currentIndex - 1];
//       playWithId(prev, trackList);
//     }
//   };

//   const next = () => {
//     if (trackList.length && currentIndex < trackList.length - 1) {
//       const nxt = trackList[currentIndex + 1];
//       playWithId(nxt, trackList);
//     }
//   };

//   const seekSong = (e) => {
//     const pos = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
//     audioRef.current.currentTime = pos;
//   };

//   useEffect(() => {
//     if (!audioRef.current) return;
//     const onTimeUpdate = () => {
//       const current = audioRef.current.currentTime;
//       const duration = audioRef.current.duration || 0;
//       seekBar.current.style.width = `${(current / duration) * 100}%`;
//       setTime({
//         currentTime: { second: Math.floor(current % 60), minute: Math.floor(current / 60) },
//         totalTime: { second: Math.floor(duration % 60), minute: Math.floor(duration / 60) }
//       });
//     };
//     audioRef.current.addEventListener("timeupdate", onTimeUpdate);
//     return () => audioRef?.current?.removeEventListener("timeupdate", onTimeUpdate);
//   }, []);

//   const contextValue = { audioRef, seekBg, seekBar, track, playStatus, time, play, pause, playWithId, previous, next, seekSong };
//   return <PlayerContext.Provider value={contextValue}>{children}<audio ref={audioRef} /></PlayerContext.Provider>;
// };

// export default PlayerContextProvider;

