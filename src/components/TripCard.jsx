import { useState } from "react";
import { Star, Heart, Clock, Users, MapPin } from "lucide-react";

function TripCard({ trip, onProvinceClick, isHighlighted, onRateTrip }) {
  const [isLiked, setIsLiked] = useState(false);
  const [hoverRating, setHoverRating] = useState(null);

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`cursor-pointer transition-colors duration-200 ${
          i < Math.floor(hoverRating ?? rating)
            ? "text-yellow-400 fill-current"
            : i < (hoverRating ?? rating)
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
        onClick={interactive ? () => onRateTrip(trip.id, i + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(null) : undefined}
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
              {renderStars(trip.rating, true)}
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
            <button className="bg-blue-600 hover:bg-blue-700 отношение: text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-1">
              <MapPin size={14} />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripCard;
