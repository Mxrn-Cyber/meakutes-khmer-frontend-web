import { useState, useEffect } from "react";
import Button from "../components/Button.jsx";
import angkorWat from "../assets/angkor-wat.jpg";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Clock,
  Users,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import tripsData from "./data/tripsData.js";

// Individual Trip Card Component
function TripCard({ trip, onProvinceClick, isHighlighted }) {
  const [isLiked, setIsLiked] = useState(false);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden ${
        isHighlighted ? "ring-4 ring-blue-500 ring-opacity-50 scale-105" : ""
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
        >
          <Heart
            size={20}
            className={`${
              isLiked
                ? "text-red-500 fill-current"
                : "text-white hover:text-red-300"
            } transition-colors duration-300`}
          />
        </button>
        <button
          onClick={() => onProvinceClick(trip.province)}
          className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center gap-1"
        >
          <MapPin size={12} />
          {trip.province}
        </button>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock size={12} />
            {trip.duration}
          </div>
          <div className="bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            {trip.access}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {trip.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {trip.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(trip.rating)}
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {trip.rating}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({trip.reviews} reviews)
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Users size={14} />
            <span className="text-xs">{trip.accessibility}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              Free Visit
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Best time: {trip.bestTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-1">
              <MapPin size={14} />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  // Sample images for slideshow
  const slideImages = [
    angkorWat,
    "src/assets/angkor-morning.png",
    "src/assets/palace.png",
    "src/assets/monument.png",
    "src/assets/people.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-change slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slideImages.length]);

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slideImages.length) % slideImages.length
    );
  };

  // Provinces
  const provinces = [
    "All Provinces",
    "Banteay Meanchey",
    "Battambang",
    "Kampong Cham",
    "Kampong Chhnang",
    "Kampong Speu",
    "Kampong Thom",
    "Kampot",
    "Kandal",
    "Kep",
    "Koh Kong",
    "Kratie",
    "Mondulkiri",
    "Oddar Meanchey",
    "Pailin",
    "Phnom Penh",
    "Preah Vihear",
    "Prey Veng",
    "Pursat",
    "Ratanakiri",
    "Siem Reap",
    "Preah Sihanouk",
    "Stung Treng",
    "Svay Rieng",
    "Takeo",
    "Tbong Khmum",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("All Provinces");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [highlightedProvince, setHighlightedProvince] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Handle province click from trip card
  const handleProvinceClick = (province) => {
    setSelectedProvince(province);
    setHighlightedProvince(province);
    setTimeout(() => {
      setHighlightedProvince("");
    }, 3000);
  };

  // Filter and sort trips
  const filteredAndSortedTrips = tripsData
    .filter((trip) => {
      const matchesSearch =
        trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvince =
        selectedProvince === "All Provinces" ||
        trip.province === selectedProvince;
      return matchesSearch && matchesProvince;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "reviews":
          aValue = a.reviews;
          bValue = b.reviews;
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "accessibility":
          const accessOrder = { Easy: 1, Moderate: 2, Challenging: 3 };
          aValue = accessOrder[a.accessibility] || 4;
          bValue = accessOrder[b.accessibility] || 4;
          break;
        default:
          return 0;
      }
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="w-full px-4 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-none">
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="relative w-full">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl w-full h-[400px] lg:h-[500px] xl:h-[600px]">
                {slideImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Cambodia destination ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                      index === currentSlide
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center mt-6 space-x-2">
                {slideImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentSlide + 1} / {slideImages.length}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-block mb-4">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                Travelers Point
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              We help to find your
              <span className="text-blue-600 dark:text-blue-400 block mt-2">
                dream place
              </span>
            </h1>
            <div className="space-y-4 mb-8 text-gray-600 dark:text-gray-300">
              <p className="text-base lg:text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                aliquam, purus sit amet luctus venenatis, lectus magna fringilla
                urna, porttitor rhoncus dolor purus non enim praesent elementum
                facilisis leo, vel fringilla est ullamcorper eget nulla facilisi
              </p>
              <p className="text-base lg:text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                aliquam, purus sit amet luctus venenatis, lectu magna fringilla
                urna, porttitor rhoncus dolor purus non enim praesent elementum
                facilisis leo, vel fringilla est ullamcorper eget nulla facilisi
              </p>
              <p className="text-base lg:text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                aliquam, purus sit amet luctus venenatis, lectu magna fringilla
                urna, porttitor rhoncus dolor purus non enim praesent elementum
                facilisis leo, vel fringilla est ullamcorper eget nulla facilisi
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="primary"
                onClick={() => alert("Start your journey!")}
                className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Explore Now
              </Button>
              <Link to="/about">
                <button className="px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-blue-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Destination Section */}
      <section className="w-full px-4 pb-12">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase inline-block mb-4">
            Top Destination
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore our top destinations
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the most beautiful and culturally rich destinations that
            Cambodia has to offer
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white pl-10 pr-10 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-300 min-w-[200px]"
                >
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="rating">Rating</option>
                  <option value="reviews">Reviews</option>
                  <option value="name">Name</option>
                  <option value="accessibility">Accessibility</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc size={20} />
                  ) : (
                    <SortDesc size={20} />
                  )}
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
              >
                <Filter size={20} />
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedTrips.length} of {tripsData.length}{" "}
              destinations
              {selectedProvince !== "All Provinces" && (
                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                  {selectedProvince}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Trip Cards Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAndSortedTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onProvinceClick={handleProvinceClick}
                  isHighlighted={highlightedProvince === trip.province}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No destinations found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search terms or filters to find more
                destinations.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedProvince("All Provinces");
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
