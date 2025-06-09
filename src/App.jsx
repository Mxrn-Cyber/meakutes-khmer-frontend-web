// App.jsx
import { Routes, Route } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { HashRouter } from "react-router-dom";
import { auth } from "./firebase";
import { TripProvider } from "./context/TripContext"; // Import the context provider
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Loading from "./components/Loading.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Translator from "./components/Translator.js";

// Lazy load all pages for better code splitting
const Home = lazy(() => import("./pages/Home.jsx"));
const Discover = lazy(() => import("./pages/Discover.jsx"));
const Popular = lazy(() => import("./pages/Popular.jsx"));
const NewsEvents = lazy(() => import("./pages/NewsEvents.jsx"));
const Article = lazy(() => import("./pages/Article.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const TripDetail = lazy(() => import("./pages/TripDetail.jsx"));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <TripProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
          {isLoading && <Loading />}
          <Navbar />
          <Translator />
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/news" element={<NewsEvents />} />
                <Route path="/article/:id" element={<Article />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/trip/:id" element={<TripDetail />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route
                  path="*"
                  element={
                    <h1 className="text-2xl font-bold">404: Page Not Found</h1>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </TripProvider>
  );
}

export default App;
