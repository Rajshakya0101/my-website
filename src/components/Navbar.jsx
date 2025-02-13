import { useState, useEffect } from "react";
import { auth } from "../data/firebase"; // Make sure the path is correct
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email === "rajshakya.orai18@gmail.com") {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  // Define the common nav links (excluding Admin/Logout)
  const navLinks = ["Home", "Work", "About", "Contact"];

  return (
    <nav className="fixed w-full bg-[#08233b] z-50 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <span
          className="text-5xl font-semibold"
          style={{ fontFamily: '"Arizonia", serif' }}
        >
          RS
        </span>
        <div className="hidden md:flex space-x-8 font-medium">
          {navLinks.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="hover:text-blue-400 transition-colors"
            >
              {item}
            </Link>
          ))}
          {isAdminLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:text-blue-400 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/admin"
              className="hover:text-blue-400 transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#08233b] py-4 px-4 space-y-4">
          {navLinks.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="block text-white hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          {isAdminLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block text-white hover:text-blue-400"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/admin"
              className="block text-white hover:text-blue-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
