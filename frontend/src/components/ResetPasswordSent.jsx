import { Link } from 'react-router-dom';

export default function ResetPasswordSent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2022/10/Spotify_Logo_CMYK_Green.png"
            alt="Spotify Logo"
            className="h-12"
          />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Hướng dẫn đã được gửi</h1>

        <p className="text-neutral-400 mb-6">
          Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.
        </p>

        <Link
          to="/login"
          className="inline-block bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Quay về Đăng nhập
        </Link>
      </div>
    </div>
  );
}
