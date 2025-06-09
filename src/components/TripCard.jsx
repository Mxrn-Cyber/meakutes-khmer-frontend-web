import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, Clock, Users, MapPin } from "lucide-react";

function TripCard({ trip, onProvinceClick, isHighlighted, onRateTrip }) {
  const [isLiked, setIsLiked] = useState(false);
  const [hoverRating, setHoverRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const navigate = useNavigate();

  // Memoize the initial favorite state check
  const initialFavoriteState = useMemo(() => {
    try {
      const favouriteTrips = JSON.parse(
        localStorage.getItem("favouriteTrips") || "[]"
      );
      return favouriteTrips.some((favTrip) => favTrip.id === trip.id);
    } catch (error) {
      console.warn("Error reading favorites from localStorage:", error);
      return false;
    }
  }, [trip.id]);

  // Memoize the initial rating state
  const initialRatingState = useMemo(() => {
    try {
      const userRatings = JSON.parse(
        sessionStorage.getItem("userRatings") || "{}"
      );
      return userRatings[trip.id] || null;
    } catch (error) {
      console.warn("Error reading ratings from sessionStorage:", error);
      return null;
    }
  }, [trip.id]);

  // Initialize states
  useEffect(() => {
    setIsLiked(initialFavoriteState);
    setUserRating(initialRatingState);
  }, [initialFavoriteState, initialRatingState]);

  // Optimized function to save user rating
  const saveUserRating = useCallback(
    (rating) => {
      try {
        const userRatings = JSON.parse(
          sessionStorage.getItem("userRatings") || "{}"
        );
        userRatings[trip.id] = rating;
        sessionStorage.setItem("userRatings", JSON.stringify(userRatings));
        setUserRating(rating);

        if (onRateTrip) {
          onRateTrip(trip.id, rating);
        }
      } catch (error) {
        console.warn("Error saving rating to sessionStorage:", error);
      }
    },
    [trip.id, onRateTrip]
  );

  // Optimized favorites update handler
  const handleFavouritesUpdate = useCallback(() => {
    try {
      const favouriteTrips = JSON.parse(
        localStorage.getItem("favouriteTrips") || "[]"
      );
      const isFavourite = favouriteTrips.some(
        (favTrip) => favTrip.id === trip.id
      );
      setIsLiked(isFavourite);
    } catch (error) {
      console.warn("Error updating favorites:", error);
    }
  }, [trip.id]);

  // Event listener for favorites updates
  useEffect(() => {
    window.addEventListener("favouritesUpdated", handleFavouritesUpdate);
    return () => {
      window.removeEventListener("favouritesUpdated", handleFavouritesUpdate);
    };
  }, [handleFavouritesUpdate]);

  // Optimized star rendering
  const renderStars = useCallback(
    (rating, interactive = false) => {
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
    },
    [userRating, hoverRating, saveUserRating]
  );

  // Optimized navigation handler
  const handleViewDetails = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Use replace: false to ensure proper navigation history
      navigate(`/trip/${trip.id}`, { replace: false });
    },
    [navigate, trip.id]
  );

  // Optimized toggle favorite handler
  const handleToggleFavourite = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const favouriteTrips = JSON.parse(
          localStorage.getItem("favouriteTrips") || "[]"
        );

        let updatedFavourites;
        if (isLiked) {
          updatedFavourites = favouriteTrips.filter(
            (favTrip) => favTrip.id !== trip.id
          );
          setIsLiked(false);
        } else {
          updatedFavourites = [...favouriteTrips, trip];
          setIsLiked(true);
        }

        localStorage.setItem(
          "favouriteTrips",
          JSON.stringify(updatedFavourites)
        );

        // Dispatch event after state update
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("favouritesUpdated"));
        }, 0);
      } catch (error) {
        console.warn("Error toggling favorites:", error);
      }
    },
    [isLiked, trip]
  );

  // Optimized province click handler
  const handleProvinceClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onProvinceClick) {
        onProvinceClick(trip.province);
      }
    },
    [onProvinceClick, trip.province]
  );

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
          loading="lazy"
          onError={(e) => {
            console.warn(`Failed to load image for ${trip.name}`);
            e.target.style.display = "none";
          }}
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
          onClick={handleProvinceClick}
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
