import { Link } from 'react-router-dom';

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2022/10/Spotify_Logo_CMYK_Green.png"
            alt="Spotify Logo"
            className="h-12"
          />
        </div>

        <h1 className="text-3xl font-bold text-white mb-6 text-center">Đặt mật khẩu mới</h1>

        <form className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-lg transition"
          >
            Đặt lại mật khẩu
          </button>
        </form>

        <p className="text-gray-400 mt-6 text-center">
          Nhớ mật khẩu?{' '}
          <Link to="/login" className="text-green-500 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
