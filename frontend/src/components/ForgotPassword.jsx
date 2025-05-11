import { Link } from 'react-router-dom';

export default function ForgotPassword() {
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

        <h1 className="text-3xl font-bold text-white mb-6 text-center">Đặt lại mật khẩu</h1>

        <p className="text-neutral-400 text-center mb-6">
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu.
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-lg transition"
          >
            Gửi yêu cầu
          </button>
        </form>

        <p className="text-gray-400 mt-6 text-center">
          Nhớ mật khẩu rồi?{' '}
          <Link to="/login" className="text-green-500 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
