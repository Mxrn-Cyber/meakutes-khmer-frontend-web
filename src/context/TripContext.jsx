// contexts/TripContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const TripContext = createContext();

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripContext must be used within a TripProvider");
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from storage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favouriteTrips");
      const storedRatings = sessionStorage.getItem("userRatings");

      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      if (storedRatings) {
        setRatings(JSON.parse(storedRatings));
      }
    } catch (error) {
      console.warn("Error loading trip data from storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites) => {
    try {
      localStorage.setItem("favouriteTrips", JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.warn("Error saving favorites:", error);
    }
  }, []);

  // Save ratings to sessionStorage
  const saveRatings = useCallback((newRatings) => {
    try {
      sessionStorage.setItem("userRatings", JSON.stringify(newRatings));
      setRatings(newRatings);
    } catch (error) {
      console.warn("Error saving ratings:", error);
    }
  }, []);

  // Add trip to favorites
  const addToFavorites = useCallback(
    (trip) => {
      const newFavorites = [...favorites, trip];
      saveFavorites(newFavorites);
    },
    [favorites, saveFavorites]
  );

  // Remove trip from favorites
  const removeFromFavorites = useCallback(
    (tripId) => {
      const newFavorites = favorites.filter((trip) => trip.id !== tripId);
      saveFavorites(newFavorites);
    },
    [favorites, saveFavorites]
  );

  // Check if trip is favorite
  const isFavorite = useCallback(
    (tripId) => {
      return favorites.some((trip) => trip.id === tripId);
    },
    [favorites]
  );

  // Rate a trip
  const rateTrip = useCallback(
    (tripId, rating) => {
      const newRatings = { ...ratings, [tripId]: rating };
      saveRatings(newRatings);
    },
    [ratings, saveRatings]
  );

  // Get trip rating
  const getTripRating = useCallback(
    (tripId) => {
      return ratings[tripId] || null;
    },
    [ratings]
  );

  const value = {
    favorites,
    ratings,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    rateTrip,
    getTripRating,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
