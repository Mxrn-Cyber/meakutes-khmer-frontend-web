import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import tripsData from "./data/tripsData.js";

// Use Vite environment variable with fallback
const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  "AIzaSyC_M4bm9U_MZgTZcvpZ6Lo9IZXWTzzsWps";

// Log warning if using fallback key
if (GOOGLE_MAPS_API_KEY === "AIzaSyC_M4bm9U_MZgTZcvpZ6Lo9IZXWTzzsWps") {
  console.warn(
    "Using fallback Google Maps API key. For production, set VITE_GOOGLE_MAPS_API_KEY in .env file."
  );
}

// Map container style
const mapContainerStyle = {
  width: "100%",
  height: "40vh",
  borderRadius: "0.75rem",
};

// Default map options
const mapOptions = {
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

// Singleton to track if LoadScript has been mounted
let isGoogleApiLoaded = false;

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = tripsData.find((trip) => trip.id.toString() === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shouldLoadScript, setShouldLoadScript] = useState(!isGoogleApiLoaded);

  useEffect(() => {
    if (!isGoogleApiLoaded && shouldLoadScript) {
      isGoogleApiLoaded = true;
    }
    return () => {
      // Optional: Reset on unmount if needed for route changes
      // isGoogleApiLoaded = false;
    };
  }, [shouldLoadScript]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating)
            ? "text-amber-400 fill-current"
            : i < rating
            ? "text-amber-400 fill-current opacity-50"
            : "text-gray-300 dark:text-gray-600"
        } transition-colors duration-300`}
      />
    ));
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  // Memoized map center
  const mapCenter = useMemo(() => {
    if (!trip) return { lat: 13.3671, lng: 103.8448 }; // Default to Siem Reap
    if (
      trip.latitude &&
      trip.longitude &&
      !isNaN(trip.latitude) &&
      !isNaN(trip.longitude)
    ) {
      return { lat: trip.latitude, lng: trip.longitude };
    }
    return { lat: 13.3671, lng: 103.8448 }; // Fallback
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Trip Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The destination you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 px-4 md:px-8 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left: Images and Map */}
        <div className="space-y-6">
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
            <img
              src={trip.images?.[currentImageIndex] || trip.image}
              alt={trip.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Image Thumbnails */}
          <div className="flex gap-4 overflow-x-auto">
            {trip.images?.slice(0, 4).map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => handleImageChange(index)}
                alt={`Thumbnail ${index}`}
                className={`w-24 h-24 rounded-xl object-cover cursor-pointer border-2 ${
                  currentImageIndex === index
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-transparent"
                } transition-all duration-300`}
              />
            ))}
          </div>

          {/* Google Maps Dynamic Map */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Location Map
            </h3>
            <div className="w-full rounded-xl overflow-hidden shadow-md">
              {!GOOGLE_MAPS_API_KEY ? (
                <div className="flex items-center justify-center h-[40vh] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  Please provide a valid Google Maps API key in .env file.
                </div>
              ) : (
                <>
                  {shouldLoadScript ? (
                    <LoadScript
                      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                      loadingElement={
                        <div className="flex items-center justify-center h-[40vh] bg-gray-100 dark:bg-gray-700">
                          <svg
                            className="animate-spin h-8 w-8 text-blue-600"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                            />
                          </svg>
                        </div>
                      }
                      onError={() =>
                        console.error("Failed to load Google Maps API")
                      }
                      onLoad={() => console.log("Google Maps API loaded")}
                    >
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={15}
                        options={mapOptions}
                      >
                        {trip.latitude && trip.longitude && (
                          <Marker
                            position={{
                              lat: trip.latitude,
                              lng: trip.longitude,
                            }}
                            title={trip.name}
                          />
                        )}
                      </GoogleMap>
                    </LoadScript>
                  ) : (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={15}
                      options={mapOptions}
                    >
                      {trip.latitude && trip.longitude && (
                        <Marker
                          position={{ lat: trip.latitude, lng: trip.longitude }}
                          title={trip.name}
                        />
                      )}
                    </GoogleMap>
                  )}
                </>
              )}
            </div>
            {/* External link button */}
            <div className="mt-4">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  trip.name + ", " + trip.province + ", Cambodia"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
              >
                <MapPin size={16} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Right: Trip Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {trip.name}
          </h1>
          <div className="flex items-center gap-2">
            {renderStars(trip.rating)}
            <span className="text-gray-600 dark:text-gray-300 ml-2 text-lg">
              {trip.rating}/5 ({trip.reviews} Reviews)
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {trip.description || "No description available."}
          </p>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-lg">
            <MapPin size={20} className="text-blue-500" />
            {trip.province}, Cambodia
          </div>

          {/* Additional Trip Details */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Duration
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {trip.duration}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Access
              </h4>
              <p className="text-gray-600 dark:text-gray-300">{trip.access}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Best Time
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {trip.bestTime}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Accessibility
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {trip.accessibility}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Trips */}
      <div className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Other Trips You May Like
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {tripsData
            .filter((t) => t.id.toString() !== id)
            .slice(0, 3)
            .map((otherTrip) => (
              <div
                key={otherTrip.id}
                onClick={() => navigate(`/trip/${otherTrip.id}`)}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative h-44">
                  <img
                    src={otherTrip.image}
                    alt={otherTrip.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    {otherTrip.province}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {otherTrip.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {otherTrip.description || "No description available."}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-300 pt-2">
                    {renderStars(otherTrip.rating)}
                    <span className="ml-1">{otherTrip.rating}/5</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default TripDetail;
