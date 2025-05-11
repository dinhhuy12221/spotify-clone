import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user_info"))  || null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    setDropdownOpen(false);
    navigate("/");
  };

  // Đóng dropdown nếu click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex justify-between items-center font-semibold relative">
      <div className="flex items-center gap-2">
      </div>

      <div className="relative" ref={dropdownRef}>
        {user ? (
          <>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-purple-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold"
            >
              {user?.username}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10 text-sm text-black">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-purple-500 text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;



// import React, { useEffect, useRef, useState } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = Cookies.get("token"); // Đổi tên nếu backend bạn lưu bằng tên khác
//     setIsLoggedIn(!!token); // Nếu có token => đã đăng nhập
//   }, []);

//   const handleLogout = () => {
//     Cookies.remove("token"); // Xóa cookie
//     setIsLoggedIn(false);
//     setDropdownOpen(false);
//     navigate("/login");
//   };

//   // Đóng dropdown nếu click ra ngoài
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="w-full flex justify-between items-center font-semibold relative">
//       <div className="flex items-center gap-2">
//         <img
//           onClick={() => navigate(-1)}
//           className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
//           src={assets.arrow_left}
//           alt="left"
//         />
//         <img
//           onClick={() => navigate(1)}
//           className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
//           src={assets.arrow_right}
//           alt="right"
//         />
//       </div>

//       <div className="relative" ref={dropdownRef}>
//         {isLoggedIn ? (
//           <>
//             <button
//               onClick={() => setDropdownOpen((prev) => !prev)}
//               className="bg-purple-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold"
//             >
//               G
//             </button>
//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10 text-sm text-black">
//                 <button
//                   onClick={() => {
//                     navigate("/profile");
//                     setDropdownOpen(false);
//                   }}
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                 >
//                   Profile
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           <button
//             onClick={() => navigate("/login")}
//             className="px-4 py-2 bg-purple-500 text-white rounded-full"
//           >
//             Login
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;


// import React from 'react'
// import { assets } from '../assets/assets'
// import { Navigate, useNavigate } from 'react-router-dom'

// const Navbar = () => {

//   const navigate = useNavigate()

//   return (
//     <>
//         <div className='w-full flex justify-between items-center font-semibold'>
//             <div className='flex items-center gap-2'>
//                 <img onClick={() => navigate(-1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_left} alt="" />
//                 <img onClick={() => navigate(1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_right} alt="" />
//             </div>
//             <div className='flex items-center gap-4'>
//                 <p className='bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center'>G</p>
//             </div>
//         </div>
//     </>
//   )
// }

// export default Navbar