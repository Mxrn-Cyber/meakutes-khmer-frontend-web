// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  Globe,
  Home,
  Compass,
  TrendingUp,
  Newspaper,
  Info,
  User,
  LogOut,
} from "lucide-react";
import { auth } from "../firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isLangOpen, setIsLangOpen] = useState(false); // Language dropdown toggle
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // User profile dropdown toggle
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [selectedLang, setSelectedLang] = useState("English");
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔗 KEY INTERACTION: Listen for auth state changes from Profile component
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      // This updates when Profile component modifies user data
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenu = document.querySelector(".user-menu-dropdown");
      const userButton = document.querySelector(".user-menu-button");
      if (
        userMenu &&
        userButton &&
        !userMenu.contains(event.target) &&
        !userButton.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Discover", icon: Compass, href: "/discover" },
    { name: "Popular", icon: TrendingUp, href: "/popular" },
    { name: "News", icon: Newspaper, href: "/news" },
    { name: "About", icon: Info, href: "/about" },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // 🔗 KEY INTERACTION: Logout function that affects Profile component
  const handleLogout = async () => {
    try {
      await auth.signOut(); // This will trigger auth state change in Profile
      setUser(null); // Manually clear user state
      navigate("/login", { state: { message: "Logged out successfully!" } });
      setIsOpen(false);
      setIsUserMenuOpen(false); // Close user menu on logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200/20 dark:border-gray-700/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-sm">MK</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Meakutes Khmer
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                  >
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 group-hover:rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]"
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="text-base">
                  {languages.find((lang) => lang.name === selectedLang)?.flag}
                </span>
                <span className="truncate">{selectedLang}</span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                    isLangOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang.name);
                        setIsLangOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 text-left"
                    >
                      <span className="text-base flex-shrink-0">
                        {lang.flag}
                      </span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 🔗 KEY INTERACTION: User Profile section that shows data from Profile component */}
            {user ? (
              <div className="relative flex items-center space-x-2">
                {/* This avatar updates when Profile component changes photo */}
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400"
                />
                {/* This name updates when Profile component changes displayName */}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:inline truncate max-w-[120px]">
                  {user.displayName || user.email.split("@")[0]}
                </span>
                <div className="relative">
                  <button
                    onClick={handleToggleUserMenu}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none user-menu-button"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 user-menu-dropdown">
                      {/* 🔗 KEY INTERACTION: Navigate to Profile component */}
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)} // Close on click
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                        // Close on click
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mr-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="px-3 pt-3 pb-4 space-y-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-lg mt-3 border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Section */}
            {user ? (
              <div className="space-y-2 pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  {/* Mobile avatar that updates from Profile changes */}
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400"
                  />
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {user.displayName || user.email.split("@")[0]}
                  </span>
                </div>
                {/* 🔗 KEY INTERACTION: Mobile Profile link */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 w-full text-left"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-2 pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-400 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setIsOpen(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-center transition-all duration-200 border-2 border-blue-500"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Backdrop for mobile menu */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Language dropdown backdrop */}
        {isLangOpen && (
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsLangOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
