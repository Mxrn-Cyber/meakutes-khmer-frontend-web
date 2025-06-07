import { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Clock,
  Users,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import tripsData from "./data/tripsData.js";
import TripCard from "../components/TripCard.jsx";
import About from "./About.jsx";
import { Link } from "react-router-dom";
function Home() {
  // Debugging: Log tripsData to verify import
  console.log("Imported tripsData:", tripsData);

  // Sample images for slideshow
  const slideImages = [
    "/angkor-morning.png",
    "/angkor-wat.png",
    "/bayon-temple.png",
    "/palace.png",
    "/manument.png",
    "/Landscape.png",
    "/monk-front.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tripRatings, setTripRatings] = useState({});
  const tripsPerPage = 8;

  // Reference for the destinations section
  const destinationsRef = useRef(null);

  // Auto-change slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 3000);

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

  // Scroll to destinations section
  const scrollToDestinations = () => {
    destinationsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Provinces
  const provinces = [
    "All Provinces",
    ...[...new Set(tripsData.map((trip) => trip.province))].sort(),
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
    setCurrentPage(1); // Reset to first page on province change
    setTimeout(() => {
      setHighlightedProvince("");
    }, 3000);
  };

  // Handle trip rating
  const handleRateTrip = (tripId, rating) => {
    setTripRatings((prev) => ({
      ...prev,
      [tripId]: rating,
    }));
    console.log(`Home: Rated trip ${tripId} with ${rating} stars`);
  };

  // Apply user ratings to trips
  const tripsWithRatings = tripsData.map((trip) => ({
    ...trip,
    rating: tripRatings[trip.id] || trip.rating,
  }));

  // Filter and sort trips
  const filteredAndSortedTrips = tripsWithRatings
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

  // Debugging: Log filtered and paginated data
  console.log("Filtered and Sorted Trips:", filteredAndSortedTrips);
  const totalPages = Math.ceil(filteredAndSortedTrips.length / tripsPerPage);
  const paginatedTrips = filteredAndSortedTrips.slice(
    (currentPage - 1) * tripsPerPage,
    currentPage * tripsPerPage
  );
  console.log("Current Page:", currentPage, "Total Pages:", totalPages);
  console.log("Paginated Trips:", paginatedTrips);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    destinationsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1); // Reset to first page on sort change
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
                    onError={() =>
                      console.error(`Failed to load slide image ${image}`)
                    }
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
                Meakutes-Khmer is a web application developed to promote tourism
                in Cambodia, one of the oldest countries in Southeast Asia with
                a rich cultural heritage. Cambodia boasts a variety of tourist
                attractions, from historical resorts like the luxurious and
                awe-inspiring temples built by Khmer ancestors to innovative
                modern resorts, stunning mountain landscapes, diverse wildlife,
                and some of the most beautiful beaches in Asia. These
                attractions have the potential to draw both national and
                international visitors. However, the COVID-19 pandemic caused a
                significant decline in tourism, impacting local livelihoods.
              </p>
              <p className="text-base lg:text-lg leading-relaxed">
                To address this, we, the students of the Department of
                Information Technology Engineering (8th generation) at Lao
                Thomorn, under the guidance of our advisor, Ky Sok Lay, created
                this final-year project. Meakutes-Khmer aims to promote new and
                beautiful tourist sites across Cambodia, helping Cambodians and
                foreign visitors discover these areas. By doing so, we hope to
                benefit society, improve the livelihoods of people around these
                tourist sites, and contribute to the recovery of Cambodia’s
                tourism industry.
              </p>
              <p className="text-base lg:text-lg leading-relaxed">
                I hope this website is helpful to boost our tourist sector and
                promote cambodia to the world.From ITE G8 Student
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToDestinations}
                className="px-8 py-4 text-lg font-semibold bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                Explore Now
              </button>
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
      <section ref={destinationsRef} className="w-full px-2 pb-12">
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
          {paginatedTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paginatedTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onProvinceClick={handleProvinceClick}
                  isHighlighted={highlightedProvince === trip.province}
                  onRateTrip={handleRateTrip}
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
                  setCurrentPage(1);
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-full ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                } hover:bg-blue-500 hover:text-white transition-all duration-300`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
