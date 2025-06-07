import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, Clock, Users, MapPin } from "lucide-react";

function TripCard({ trip, onProvinceClick, isHighlighted, onRateTrip }) {
  const [isLiked, setIsLiked] = useState(false);
  const [hoverRating, setHoverRating] = useState(null);
  const [userRating, setUserRating] = useState(null); // Track user's rating
  const navigate = useNavigate();

  // Function to check if the trip is in favorites
  const checkIsFavourite = () => {
    const favouriteTrips = JSON.parse(
      localStorage.getItem("favouriteTrips") || "[]"
    );
    const isFavourite = favouriteTrips.some(
      (favTrip) => favTrip.id === trip.id
    );
    setIsLiked(isFavourite);
  };

  // Function to get user's rating from session storage
  const getUserRating = () => {
    const userRatings = JSON.parse(
      sessionStorage.getItem("userRatings") || "{}"
    );
    return userRatings[trip.id] || null;
  };

  // Function to save user's rating to session storage
  const saveUserRating = (rating) => {
    const userRatings = JSON.parse(
      sessionStorage.getItem("userRatings") || "{}"
    );
    userRatings[trip.id] = rating;
    sessionStorage.setItem("userRatings", JSON.stringify(userRatings));
    setUserRating(rating);
    console.log(
      `Saved rating ${rating} for trip ${trip.id} to session storage`
    );
  };

  // Check if trip is in favorites and get user rating on component mount
  useEffect(() => {
    checkIsFavourite();
    const savedRating = getUserRating();
    setUserRating(savedRating);
  }, [trip.id]);

  // Listen for favorites update events
  useEffect(() => {
    const handleFavouritesUpdate = () => {
      // Slight delay to ensure localStorage has been updated
      setTimeout(() => {
        checkIsFavourite();
      }, 50);
    };

    window.addEventListener("favouritesUpdated", handleFavouritesUpdate);
    return () => {
      window.removeEventListener("favouritesUpdated", handleFavouritesUpdate);
    };
  }, [trip.id]);

  const renderStars = (rating, interactive = false) => {
    // Use user's rating if available, otherwise use trip's default rating
    const displayRating = userRating !== null ? userRating : rating;

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`transition-colors duration-200 ${
          interactive ? "cursor-pointer" : ""
        } ${
          i < Math.floor(hoverRating ?? displayRating)
            ? "text-yellow-400 fill-current"
            : i < (hoverRating ?? displayRating)
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
        onClick={
          interactive
            ? (e) => {
                e.preventDefault();
                e.stopPropagation();
                const newRating = i + 1;
                saveUserRating(newRating);
                if (onRateTrip) {
                  onRateTrip(trip.id, newRating);
                }
                console.log(`Rated trip ${trip.id} with ${newRating} stars`);
              }
            : undefined
        }
        onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(null) : undefined}
        role={interactive ? "button" : undefined}
        aria-label={
          interactive
            ? `Rate ${i + 1} star${i + 1 === 1 ? "" : "s"}`
            : undefined
        }
      />
    ));
  };

  const handleViewDetails = () => {
    navigate(`/trip/${trip.id}`);
  };

  const handleToggleFavourite = () => {
    const favouriteTrips = JSON.parse(
      localStorage.getItem("favouriteTrips") || "[]"
    );

    if (isLiked) {
      // Remove from favorites
      const updatedFavourites = favouriteTrips.filter(
        (favTrip) => favTrip.id !== trip.id
      );
      localStorage.setItem("favouriteTrips", JSON.stringify(updatedFavourites));
      setIsLiked(false);
      console.log(`Removed trip ${trip.name} from favourites`);
    } else {
      // Add to favorites
      const updatedFavourites = [...favouriteTrips, trip];
      localStorage.setItem("favouriteTrips", JSON.stringify(updatedFavourites));
      setIsLiked(true);
      console.log(`Added trip ${trip.name} to favourites`);
    }

    // Dispatch custom event to notify other components of changes
    window.dispatchEvent(new CustomEvent("favouritesUpdated"));
  };

  // Function to clear user rating (optional - for testing or reset functionality)
  const clearUserRating = () => {
    const userRatings = JSON.parse(
      sessionStorage.getItem("userRatings") || "{}"
    );
    delete userRatings[trip.id];
    sessionStorage.setItem("userRatings", JSON.stringify(userRatings));
    setUserRating(null);
    console.log(`Cleared rating for trip ${trip.id}`);
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
        isHighlighted ? "ring-2 ring-blue-500 ring-opacity-50 scale-102" : ""
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => console.error(`Failed to load image for ${trip.name}`)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <button
          onClick={handleToggleFavourite}
          className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
          aria-label={isLiked ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart
            size={18}
            className={`${
              isLiked
                ? "text-red-500 fill-current"
                : "text-white fill-none hover:text-red-200"
            } transition-all duration-200 group-hover:scale-110`}
          />
        </button>
        <button
          onClick={() => onProvinceClick(trip.province)}
          className="absolute top-3 left-3 bg-blue-600/80 text-white px-2 py-1 rounded-full text-xs font-medium hover:bg-blue-700 transition-all duration-200 flex items-center gap-1"
        >
          <MapPin size={10} />
          {trip.province}
        </button>
        <div className="absolute bottom-2 left-2 flex gap-1">
          <div className="bg-white/80 backdrop-blur-sm text-gray-800 px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock size={10} />
            {trip.duration}
          </div>
          <div className="bg-green-500/80 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
            {trip.access}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {trip.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {trip.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {renderStars(trip.rating, true)}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {userRating !== null ? userRating : trip.rating}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({trip.reviews} reviews)
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Users size={12} />
            <span className="text-xs">{trip.accessibility}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Best time: {trip.bestTime}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md flex items-center gap-1"
            >
              <MapPin size={12} />
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripCard;
