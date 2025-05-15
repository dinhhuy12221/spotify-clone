// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/accounts/login/", formData);
      const token = res.data.token;
      const { username, email, playlists } = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user_info",
        JSON.stringify({ username, email, playlists })
      );

      navigate("/");
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
      console.log(err);
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

        <h1 className="text-3xl font-bold text-white mb-6 text-center">Đăng nhập vào Spotify</h1>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button className="bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition">
            Đăng nhập bằng Google
          </button>
          <button className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition">
            Đăng nhập bằng Facebook
          </button>
          <button className="bg-black border border-white text-white font-semibold py-2 rounded-lg hover:bg-neutral-800 transition">
            Đăng nhập bằng Apple
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-2 mb-6">
          <hr className="flex-grow border-neutral-700" />
          <span className="text-neutral-500">HOẶC</span>
          <hr className="flex-grow border-neutral-700" />
        </div>

        {/* Email Login */}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-lg transition"
          >
            Đăng nhập
          </button>
        </form>

        {/* Signup link */}
        <p className="text-gray-400 mt-6 text-center">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-green-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
          <div className="flex justify-center mt-2">
            <Link to="/" className="text-green-500 hover:underline">
              Return Home
            </Link>
          </div>
      </div>
    // </div>
  );
}




// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
//   IconButton,
//   InputAdornment,
//   Paper,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       // Gửi yêu cầu đăng nhập
//       const res = await axios.post("http://127.0.0.1:8000/api/accounts/login/", formData);

//       // Nhận token và userInfo (nếu backend trả chung)
//       const token = res.data.token;
//       const { username, email, playlists } = res.data.user; // Chỉ lấy cần thiết

//       // Lưu token và user_info vào localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem(
//         "user_info",
//         JSON.stringify({ username, email, playlists })
//       );

//       // Điều hướng về trang chính
//       navigate("/");
//     } catch (err) {
//       setError("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
//       console.log(err);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
//         <Typography variant="h4" gutterBottom align="center">
//           Login
//         </Typography>
//         {error && (
//           <Typography color="error" variant="body2" gutterBottom align="center">
//             {error}
//           </Typography>
//         )}
//         <form onSubmit={handleLogin}>
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Password"
//             name="password"
//             type={showPassword ? "text" : "password"}
//             value={formData.password}
//             onChange={handleChange}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Box mt={2}>
//             <Button fullWidth type="submit" variant="contained" color="primary">
//               Login
//             </Button>
//           </Box>
//           <Box mt={2} textAlign="center">
//             <Typography
//               variant="body2"
//               sx={{ cursor: "pointer", color: "blue" }}
//               onClick={() => navigate("/register")}
//             >
//               Don't have an account? Register
//             </Typography>
//           </Box>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default Login;



// // src/pages/Login.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
//   IconButton,
//   InputAdornment,
//   Paper
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) =>   
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://127.0.0.1:8000/api/accounts/login/", formData);
//       Cookies.set("token", res.data.token, { path: "/" });
//       navigate("/");
//     } catch (err) {
//       setError("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
//         <Typography variant="h4" gutterBottom align="center">
//           Login
//         </Typography>
//         {error && (
//           <Typography color="error" variant="body2" gutterBottom align="center">
//             {error}
//           </Typography>
//         )}
//         <form onSubmit={handleLogin}>
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Password"
//             name="password"
//             type={showPassword ? "text" : "password"}
//             value={formData.password}
//             onChange={handleChange}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Box mt={2}>
//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               color="primary"
//             >
//               Login
//             </Button>
//           </Box>
//           <Box mt={2} textAlign="center">
//             <Typography
//               variant="body2"
//               sx={{ cursor: "pointer", color: "blue" }}
//               onClick={() => navigate("/register")}
//             >
//               Don't have an account? Register
//             </Typography>
//           </Box>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default Login;
