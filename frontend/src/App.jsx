// src/App.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Display from "./components/Display";
import Player from "./components/Player";
import PlayerContextProvider from "./context/PlayerContext";

const App = () => (
  <PlayerContextProvider>
    <div className="h-screen bg-black">
      <div className="h-[100%] flex">
        <Display />
      </div>
    </div>
  </PlayerContextProvider>
);

export default App;


// src/App.jsx
// import React from "react";
// import Sidebar from "./components/Sidebar";
// import Player from "./components/Player";
// import Display from "./components/Display";
// import PlayerContextProvider from "./context/PlayerContext";

// const App = () => {
//   return (
//     <PlayerContextProvider>
//       <div className="h-screen bg-black">
//         <div className="h-[90%] flex">
//           <Sidebar />
//           <Display />
//         </div>
//         <Player />
//       </div>
//     </PlayerContextProvider>
//   );
// };

// export default App;



// import React, { useContext, useEffect } from "react";
// import Sidebar from "./components/Sidebar";
// import Player from "./components/Player";
// import Display from "./components/Display";
// import { PlayerContext } from "./context/PlayerContext";

// const App = () => {
//   const { audioRef, track } = useContext(PlayerContext);

//   // Effect để cập nhật audio source mỗi khi track thay đổi
//   useEffect(() => {
//     if (track && audioRef?.current) {
//       audioRef.current.src = track.file;  // Cập nhật file âm thanh cho audioRef
//       audioRef.current.load();  // Tải lại âm thanh
//       audioRef.current.play();  // Phát bài hát khi đã cập nhật
//     }
//   }, [track, audioRef]);

//   return (
//     <div className="h-screen bg-black">
//       <div className="h-[90%] flex">
//         <Sidebar />
//         <Display />
//       </div>
//       <Player />
//       <audio ref={audioRef} preload="auto"></audio>
//     </div>
//   );
// };

// export default App;
