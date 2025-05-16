import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logoutHandle = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };
  return (
    <div className="navbar flex align-middle justify-between w-full border-b-2 border-gray-800 px-5 sm:px-12 py-4 text-lg">
      <p>Admin panel</p>
      <button
        onClick={logoutHandle}
        className="bg-red-500 text-white px-2 py-1 hover:bg-red-600 transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
