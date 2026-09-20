import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export const useTripActions = ({ user, trip, navigate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValidTrip = useCallback(() => {
    if (!trip || !trip.id || typeof trip.id !== "string" || !trip.name) {
      console.error("Invalid trip object:", trip);
      toast.error("Invalid trip data.");
      return false;
    }
    return true;
  }, [trip]);

  // Load favorite and rating from localStorage
  useEffect(() => {
    if (!user || !user.uid || !trip || !isValidTrip()) {
      setIsLiked(false);
      setUserRating(null);
      return;
    }

    setIsLoading(true);
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
      setIsLiked(!!favorites[`${user.uid}_${trip.id}`]);

      const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");
      setUserRating(ratings[`${user.uid}_${trip.id}`] || null);
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      toast.error("Failed to load favorite or rating status.");
    } finally {
      setIsLoading(false);
    }
  }, [user, trip, isValidTrip]);

  // Save user rating to localStorage
  const saveUserRating = useCallback(
    async (rating) => {
      if (!user || !user.uid) {
        toast.error("Please log in to rate this trip.");
        navigate("/login");
        return;
      }
      if (!trip || !isValidTrip()) return;

      setIsLoading(true);
      try {
        const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");
        ratings[`${user.uid}_${trip.id}`] = rating;
        localStorage.setItem("ratings", JSON.stringify(ratings));
        setUserRating(rating);
        toast.success(`Rated ${trip.name} ${rating} stars!`);
      } catch (error) {
        console.error("Error saving rating:", error);
        toast.error("Failed to save rating.");
      } finally {
        setIsLoading(false);
      }
    },
    [user, trip, navigate, isValidTrip]
  );

  // Toggle favorite status in localStorage
  const handleToggleFavorite = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user || !user.uid) {
        toast.error("Please log in to favorite this trip.");
        navigate("/login");
        return;
      }
      if (!trip || !isValidTrip()) return;

      setIsLoading(true);
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
        if (isLiked) {
          delete favorites[`${user.uid}_${trip.id}`];
          setIsLiked(false);
          toast.success(`Removed ${trip.name} from favorites!`);
        } else {
          favorites[`${user.uid}_${trip.id}`] = {
            userId: user.uid,
            tripId: trip.id,
            trip: {
              id: trip.id,
              name: trip.name,
              province: trip.province || "Unknown",
              image: trip.image || "/placeholder-image.jpg",
              duration: trip.duration || "N/A",
              description: trip.description || "",
              rating: trip.rating || 0,
              reviews: trip.reviews || 0,
              access: trip.access || "N/A",
              bestTime: trip.bestTime || "N/A",
              accessibility: trip.accessibility || "N/A",
            },
            timestamp: new Date().toISOString(),
          };
          setIsLiked(true);
          toast.success(`Added ${trip.name} to favorites!`);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (error) {
        console.error("Error toggling favorite:", error);
        toast.error("Failed to toggle favorite.");
      } finally {
        setIsLoading(false);
      }
    },
    [user, trip, navigate, isLiked, isValidTrip]
  );

  return {
    isLiked,
    userRating,
    isLoading,
    saveUserRating,
    handleToggleFavorite,
    isValidTrip,
  };
};
