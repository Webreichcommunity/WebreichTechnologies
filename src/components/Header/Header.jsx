import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, ChevronDown, Search } from "lucide-react";

const menuItems = [
  {
    name: "Solutions",
    href: "/solutions",
    submenu: [
      { name: "Enterprise Software", href: "/solutions/enterprise" },
      { name: "Workflow Automation", href: "/solutions/automation" },
      { name: "AI & Machine Learning", href: "/solutions/ai-ml" },
      { name: "Cloud Integration", href: "/solutions/cloud" },
    ]
  },
  {
    name: "Products",
    href: "/products",
    submenu: [
      { name: "CRM Suite", href: "/products/crm" },
      { name: "Project Management", href: "/products/project" },
      { name: "Analytics Platform", href: "/products/analytics" },
      { name: "HR Management", href: "/products/hr" },
    ]
  },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Resources", href: "/resources" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSubmenu(null);
  };

  return (
    <div className="w-full bg-white">
      {/* Announcement Bar */}
      <div className="bg-orange-600 text-white text-sm py-2">
        <div className="container mx-auto px-4 text-center">
          <span>Introducing WebReich Technologies AI Suite - Transform your business with software solutions</span>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">WebReich</span>
              <span className="text-sm text-gray-600">Enterprise Solutions</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 px-1 py-2 text-base font-medium transition-colors
                    ${isActive ? "text-orange-600" : "text-gray-700 hover:text-orange-600"}`
                  }
                >
                  <span>{item.name}</span>
                  {item.submenu && <ChevronDown className="w-4 h-4" />}
                </NavLink>

                {item.submenu && (
                  <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {item.submenu.map((subitem) => (
                      <NavLink
                        key={subitem.name}
                        to={subitem.href}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600
                          ${isActive ? "text-orange-600 bg-orange-50" : ""}`
                        }
                      >
                        {subitem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-6">
            <button className="text-gray-700 hover:text-orange-600">
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Inquries
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-700 hover:text-orange-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed z-40 inset-0 bg-gray-800/50 transition-opacity lg:hidden ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                {/* <span className="text-white font-bold text-lg">T</span> */}
                <img src="/logo.png" alt="" />
              </div>
              <span className="text-lg font-bold text-gray-900">WebReich</span>
            </div>
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-4 py-6 space-y-6 overflow-y-auto max-h-[calc(100vh-5rem)]">
            {menuItems.map((item) => (
              <div key={item.name}>
                <div
                  className="flex items-center justify-between text-gray-700 hover:text-orange-600 cursor-pointer"
                  onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                >
                  <span className="text-base font-medium">{item.name}</span>
                  {item.submenu && (
                    <ChevronDown className={`w-5 h-5 transition-transform ${activeSubmenu === item.name ? "rotate-180" : ""
                      }`} />
                  )}
                </div>

                {item.submenu && activeSubmenu === item.name && (
                  <div className="mt-2 ml-4 space-y-2">
                    {item.submenu.map((subitem) => (
                      <NavLink
                        key={subitem.name}
                        to={subitem.href}
                        className={({ isActive }) =>
                          `block py-2 text-sm ${isActive ? "text-orange-600" : "text-gray-600 hover:text-orange-600"
                          }`
                        }
                        onClick={toggleMenu}
                      >
                        {subitem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t p-4">
            <Link
              to="/contact"
              className="block w-full px-5 py-3 text-center font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
              onClick={toggleMenu}
            >
              Inquries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}