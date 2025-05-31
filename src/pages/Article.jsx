import { useParams, Link } from "react-router-dom";
import { newsEvents } from "/src/pages/data/newsEvents.js";

function Article() {
  const { id } = useParams();
  const item = newsEvents.find((e) => e.id === parseInt(id));

  if (!item) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
          Event Not Found
        </h1>
        <Link
          to="/news"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold"
        >
          ← Back to Events
        </Link>
      </div>
    );
  }

  const duration = item.date.includes("-") ? "Multi-day" : "Single day";
  const bestTime = item.bestTime || "November - March";
  const accessibility = item.accessibility || "Easy";

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
        <div className="w-full lg:w-1/2">
          <img
            src={item.pic}
            alt={item.title}
            className="w-full h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
            onError={(e) => {
              e.target.src = "/src/assets/default.png";
            }}
          />
        </div>
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-between">
          {" "}
          <div>
            <h1 className="text-6xl font-extrabold text-blue-700 dark:text-blue-400 mb-6">
              {" "}
              {/* Increased font size */}
              {item.title}
            </h1>
            <p className="text-xl text-gray-800 dark:text-gray-300 mb-8">
              {" "}
              {/* Increased margin and font size */}
              {item.description}
            </p>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 text-lg">
              {" "}
              {/* Increased text size */}
              <p>
                <strong>📍 Location:</strong> {item.location}
              </p>
              <p>
                <strong>🗓️ Date:</strong> {item.date}
              </p>
              <p>
                <strong>🕒 Duration:</strong> {duration}
              </p>
              <p>
                <strong>🌤️ Best Time:</strong> {bestTime}
              </p>
              <p>
                <strong>♿ Accessibility:</strong> {accessibility}
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Link
              to="/news"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition duration-300 ease-in-out" // Increased padding and font size
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
