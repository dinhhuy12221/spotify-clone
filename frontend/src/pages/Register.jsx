// src/pages/Register.jsx
// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/accounts/register/", formData);
      navigate("/login");
    } catch (err) {
      setError("Đăng ký thất bại. Vui lòng kiểm tra lại.");
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://static.vecteezy.com/system/resources/previews/023/986/935/non_2x/spotify-logo-spotify-logo-transparent-spotify-icon-transparent-free-free-png.png"
            alt="Spotify Logo"
            className="h-12"
          />
        </div>

        <h1 className="text-3xl font-bold text-white mb-6 text-center">Tạo tài khoản Spotify</h1>

        {/* Error message */}
        {error && (
          <p className="bg-red-500 text-white text-center py-2 px-3 rounded mb-4">
            {error}
          </p>
        )}

        {/* Social Signup Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button className="bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition">
            Đăng ký bằng Google
          </button>
          <button className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition">
            Đăng ký bằng Facebook
          </button>
          <button className="bg-black border border-white text-white font-semibold py-2 rounded-lg hover:bg-neutral-800 transition">
            Đăng ký bằng Apple
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-2 mb-6">
          <hr className="flex-grow border-neutral-700" />
          <span className="text-neutral-500">HOẶC</span>
          <hr className="flex-grow border-neutral-700" />
        </div>

        {/* Email Signup */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Tên người dùng"
            value={formData.username}
            onChange={handleChange}
            className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-lg transition"
          >
            Đăng ký
          </button>
        </form>

        {/* Login link */}
        <p className="text-gray-400 mt-6 text-center">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Đăng nhập
          </Link>
          <div className="flex justify-center mt-2">
            <Link to="/" className="text-green-500 hover:underline">
              Return Home
            </Link>
          </div>
        </p>
      </div>
    // </div>
  );
}




// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ username: "", email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://127.0.0.1:8000/api/accounts/register/", formData);
//       navigate("/login");
//     } catch (err) {
//       setError("Đăng ký thất bại. Vui lòng kiểm tra lại.");
//     }
//   };

//   return (
//     <div className="w-full h-screen flex justify-center items-center bg-gray-100">
//       <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-80">
//         <h2 className="text-2xl mb-4 font-bold text-center">Register</h2>
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 border rounded text-black"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 border rounded text-black"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 border rounded text-black"
//         />
//         <button
//           type="submit"
//           className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
//         >
//           Register
//         </button>
//         <p
//           className="mt-3 text-sm text-center text-blue-500 cursor-pointer"
//           onClick={() => navigate("/login")}
//         >
//           Has an account? Login
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;
