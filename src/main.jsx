import { createRoot } from "react-dom/client";
import "./index.css";
import RootLayout from "./RootLayout.jsx";
import HomePage from "./pages/Homepage/HomePage.jsx";
import DocumentDetail from "./pages/DocumentDetail/DocumentDetail.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import FAQ from "./pages/FAQ.jsx";
import Privacy from "./pages/PrivacyPolicy.jsx";
import Contact from "./pages/Contact.jsx";  
import TermsOfService from "./pages/TermsOfService.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import DocumentPage from "./pages/DocumentPage.jsx";
import SearchResultsPage from "./pages/SearchResultPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/Document/:id",
        element: <DocumentDetail />,
      },
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "Register",
        element: <Register />,
      },
      {
        path: "forgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "terms",
        element: <TermsOfService />,
      },  
      {
        path: "about",
        element: <AboutUs />, 
      }, 
      {
        path: "Document*",
        element: <DocumentPage />,
      },
       {
        path: '/search',
        element: <SearchResultsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
