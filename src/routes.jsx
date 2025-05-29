import { createBrowserRouter } from "https://cdn.jsdelivr.net/npm/react-router-dom@6.4.3/dist/umd/react-router-dom.min.js";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Discover from "./pages/Discover.jsx";
import Popular from "./pages/Popular.jsx";
import News from "./pages/News.jsx";
import Article from "./pages/Article.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/discover", element: <Discover /> },
      { path: "/popular", element: <Popular /> },
      { path: "/news", element: <News /> },
      { path: "/article/:id", element: <Article /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/forgot", element: <ForgotPassword /> },
      { path: "/signup", element: <Signup /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);

export default router;
