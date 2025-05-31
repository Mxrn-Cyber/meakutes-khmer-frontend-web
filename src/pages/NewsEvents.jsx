import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { newsEvents } from "/src/pages/data/newsEvents.js";

function NewsEvents() {
  const currentDate = new Date();
  const navigate = useNavigate();

  // Helper to parse event date strings (e.g., "March 1 - March 5", or "March 10")
  const isEventHappeningNow = (eventDate) => {
    try {
      const [startDateStr, endDateStr] = eventDate.includes("-")
        ? eventDate.split("-")
        : [eventDate, eventDate];

      const parseDate = (str) => {
        const months = {
          January: 0,
          February: 1,
          March: 2,
          April: 3,
          May: 4,
          June: 5,
          July: 6,
          August: 7,
          September: 8,
          October: 9,
          November: 10,
          December: 11,
        };
        const parts = str.trim().replace(",", "").split(" ");
        if (parts.length < 2) return new Date("Invalid");
        const [month, day, year = "2025"] = parts;
        return new Date(+year, months[month], +day);
      };

      const start = parseDate(startDateStr);
      const end = new Date(parseDate(endDateStr).setHours(23, 59, 59)); // End of day

      return currentDate >= start && currentDate <= end;
    } catch {
      return false;
    }
  };

  // Sort events: currently happening first, then by id
  const sortedEvents = useMemo(() => {
    return [...newsEvents].sort((a, b) => {
      const aNow = isEventHappeningNow(a.date) ? -1 : 1;
      const bNow = isEventHappeningNow(b.date) ? -1 : 1;
      if (aNow !== bNow) return aNow - bNow;
      return a.id - b.id;
    });
  }, [newsEvents, currentDate]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-600 dark:text-blue-400">
        Cambodia Events 2025
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {sortedEvents.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative"
          >
            {isEventHappeningNow(item.date) && (
              <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Happening Now
              </span>
            )}
            <img
              src={item.pic}
              alt={item.title}
              className="w-full aspect-[3/2] object-cover rounded-t-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/default.png";
              }}
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                <strong>Date:</strong> {item.date}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 flex items-center gap-1">
                <MapPin size={14} />
                <span>{item.location}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-200 text-sm mb-4 line-clamp-3">
                {item.description}
              </p>
              <button
                onClick={() => navigate(`/article/${item.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1"
              >
                <MapPin size={16} />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsEvents;
