import React, { useState } from "react";
import axios from "../utils/axiosConfig";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/admin/login/", {
        username,
        password,
      });

      // axios không có response.ok, nên không check như fetch
      // nếu lỗi sẽ bị ném ở catch

      const data = response.data;
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Chuyển đến dashboard hoặc trang admin
      window.location.href = "/list-user";
    } catch (err) {
      // err.response.data.detail có thể có message lỗi
      setError("Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#1DB954] rounded-2xl p-8 w-full max-w-sm shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded bg-white text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-white text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="text-sm text-red-100 bg-red-500 px-3 py-1 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-black text-[#1DB954] font-semibold py-2 rounded hover:bg-gray-900"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
