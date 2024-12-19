import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu } from "lucide-react";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative w-full bg-[#FAF9F6] shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold text-orange-600">
            WebReich <span className="text-sm text-gray-800">Technologies</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `font-semibold px-4 py-2 text-gray-800 rounded hover:text-orange-600 transition duration-200
                ${isActive ? "text-orange-600" : ""}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Inquiries Button */}
        <Link to="/inquiries" className="hidden lg:block">
          <button className="px-4 py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-400 transition duration-200">
            Inquiries
          </button>
        </Link>

        {/* Hamburger Menu */}
        <div className="lg:hidden">
          <Menu
            onClick={toggleMenu}
            className="h-6 w-6 text-orange-600 cursor-pointer"
          />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 w-full bg-[#FAF9F6] shadow-lg lg:hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              {/* Mobile Navigation Links */}
              <nav className="space-y-3">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded text-gray-800 font-semibold hover:bg-orange-100 hover:text-orange-600 transition duration-200
                      ${isActive ? "bg-orange-100 text-orange-600" : ""}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>

              {/* Inquiries Button */}
              <div className="mt-6">
                <Link to="/inquiries">
                  <button className="w-full px-4 py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-400 transition duration-200">
                    Inquiries
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
