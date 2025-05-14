import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-200 plus-jakarta-sans-connect p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold plus-jakarta-sans-connect">MaghiConnect</h1>
        <div className="flex space-x-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/signup" className="hover:underline">Signup</Link>
          <Link to="/upload" className="hover:underline">Upload</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;




