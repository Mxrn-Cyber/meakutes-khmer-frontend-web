import { useEffect, useState } from "react";
import { api } from "../api/client";

// Normalizes a backend NewsEventOut into the shape NewsEvents.jsx/Article.jsx
// were written against (date/pic instead of date_label/image.url).
function mapNewsEvent(item) {
  return {
    ...item,
    date: item.date_label,
    pic: item.image ? api.mediaUrl(item.image.url) : null,
    bestTime: item.best_time,
  };
}

export function useNewsEvents() {
  const [newsEvents, setNewsEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listNews()
      .then((rows) => {
        if (!cancelled) setNewsEvents(rows.map(mapNewsEvent));
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { newsEvents, isLoading, error };
}
