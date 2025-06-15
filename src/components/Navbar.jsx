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
  Heart,
} from "lucide-react";
import { auth } from "../firebase";

// Import the logo image (adjust the path based on your project structure)
// Example: If logo.png is in the src/assets folder
import logo from "/logo.png"; // Replace with your actual path

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFavouriteOpen, setIsFavouriteOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [selectedLang, setSelectedLang] = useState("English");
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [favouriteTrips, setFavouriteTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
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
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const loadFavourites = () => {
      const savedFavourites = localStorage.getItem("favouriteTrips");
      if (savedFavourites) {
        try {
          setFavouriteTrips(JSON.parse(savedFavourites));
        } catch (error) {
          console.error("Error loading favourite trips:", error);
          setFavouriteTrips([]);
        }
      } else {
        setFavouriteTrips([]);
      }
    };
    loadFavourites();

    const handleFavouritesUpdate = () => {
      setTimeout(() => {
        loadFavourites();
      }, 50);
    };

    window.addEventListener("favouritesUpdated", handleFavouritesUpdate);
    return () => {
      window.removeEventListener("favouritesUpdated", handleFavouritesUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".favourite-dropdown")) {
        setIsFavouriteOpen(false);
      }
      if (!event.target.closest(".user-dropdown")) {
        setIsUserMenuOpen(false);
      }
      if (!event.target.closest(".lang-dropdown")) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleToggleFavourite = () => {
    setIsFavouriteOpen(!isFavouriteOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      navigate("/login", { state: { message: "Logged out successfully!" } });
      setIsOpen(false);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleFavouriteClick = (trip) => {
    navigate(`/trip/${trip.id}`);
    setIsFavouriteOpen(false);
  };

  const removeFavourite = (tripId, e) => {
    e.stopPropagation();
    const updatedFavourites = favouriteTrips.filter(
      (trip) => trip.id !== tripId
    );
    localStorage.setItem("favouriteTrips", JSON.stringify(updatedFavourites));
    setFavouriteTrips(updatedFavourites);
    // Dispatch custom event to notify other components of changes
    window.dispatchEvent(new CustomEvent("favouritesUpdated"));
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200/20 dark:border-gray-700/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <span className="flex items-center space-x-2 group-hover:scale-105 transition-transform duration-200">
                <img
                  src={logo} // Use the imported logo variable
                  alt="Meakutes Khmer Logo"
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150x50?text=Logo";
                  }}
                />
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  MEAKUTES-KHMER
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {[
                { name: "Home", icon: Home, href: "/" },
                { name: "Discover", icon: Compass, href: "/discover" },
                { name: "Popular", icon: TrendingUp, href: "/popular" },
                { name: "News", icon: Newspaper, href: "/news" },
                { name: "About", icon: Info, href: "/about" },
              ].map((item) => {
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
            <div className="relative lang-dropdown">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]"
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="text-base">
                  {selectedLang === "English" ? "🇺🇸" : "🇰🇭"}
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
                  {[
                    { code: "en", name: "English" },
                    { code: "kh", name: "Khmer" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang.name);
                        setIsLangOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 text-left"
                    >
                      <span className="text-base flex-shrink-0">
                        {lang.code === "en" ? "🇺🇸" : "🇰🇭"}
                      </span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favourite Button */}
            <div className="relative favourite-dropdown">
              <button
                onClick={handleToggleFavourite}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group relative"
                aria-label="View favourite trips"
              >
                <Heart className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                {favouriteTrips.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {favouriteTrips.length}
                  </span>
                )}
              </button>

              {isFavouriteOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Favourite Trips ({favouriteTrips.length})
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {favouriteTrips.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No favourite trips yet
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Click the heart icon on trips to add them here
                        </p>
                      </div>
                    ) : (
                      favouriteTrips.map((trip) => (
                        <div
                          key={trip.id}
                          onClick={() => handleFavouriteClick(trip)}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <img
                                src={trip.image}
                                alt={trip.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {trip.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {trip.province} • {trip.duration}
                              </p>
                            </div>
                            <button
                              onClick={(e) => removeFavourite(trip.id, e)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                              aria-label="Remove from favourites"
                            >
                              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Section */}
            {user ? (
              <div className="relative user-dropdown flex items-center space-x-2">
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:inline truncate max-w-[120px]">
                  {user.displayName || user.email.split("@")[0]}
                </span>
                <div className="relative">
                  <button
                    onClick={handleToggleUserMenu}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
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
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="px-3 pt-3 pb-4 space-y-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-lg mt-3 border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
            {[
              { name: "Home", icon: Home, href: "/" },
              { name: "Discover", icon: Compass, href: "/discover" },
              { name: "Popular", icon: TrendingUp, href: "/popular" },
              { name: "News", icon: Newspaper, href: "/news" },
              { name: "About", icon: Info, href: "/about" },
            ].map((item) => {
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

            {/* Mobile Favourite Button */}
            <div className="relative favourite-dropdown">
              <button
                onClick={handleToggleFavourite}
                className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                aria-label="View favourite trips"
              >
                <Heart className="w-5 h-5 text-red-500 mr-3" />
                <span>Favourites ({favouriteTrips.length})</span>
              </button>

              {isFavouriteOpen && (
                <div className="mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Favourite Trips ({favouriteTrips.length})
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {favouriteTrips.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No favourite trips yet
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Click the heart icon on trips to add them here
                        </p>
                      </div>
                    ) : (
                      favouriteTrips.map((trip) => (
                        <div
                          key={trip.id}
                          onClick={() => handleFavouriteClick(trip)}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <img
                                src={trip.image}
                                alt={trip.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {trip.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {trip.province} • {trip.duration}
                              </p>
                            </div>
                            <button
                              onClick={(e) => removeFavourite(trip.id, e)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                              aria-label="Remove from favourites"
                            >
                              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Auth Section */}
            {user ? (
              <div className="space-y-2 pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
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

      <script type="text/javascript">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,kh',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            }, 'google_translate_element');
          }
        `}
      </script>
      <script
        type="text/javascript"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      ></script>
    </nav>
  );
};

export default Navbar;
