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
import ProfileLayout from "./pages/Profile/ProfileLayout.jsx";
import Financials from "./pages/Profile/Financials.jsx";
import PersonalInfo from "./pages/Profile/PersonalInfo.jsx";
import PurchaseHistory from "./pages/Profile/PurchaseHistory.jsx";
import ReviewsManagement from "./pages/Profile/ReviewsManagement.jsx";
import UploadedDocs from "./pages/Profile/UploadedDocs.jsx";
import AuthorDetail from "./pages/Author/AuthorDetail.jsx";
import UploadPage from "./pages/Document/UploadPage.jsx";
import DonationsReceived from "./pages/Profile/DonationsReceived.jsx";
import MainLayout from "./MainLayout.jsx";
import Cart from "./pages/Cart.jsx";
import DocumentReading from "./pages/DocumentReading.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/documentDetail/:documentId",
            element: <DocumentDetail />,
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
            path: "document",
            element: <DocumentPage />,
          },
          {
            path: "search",
            element: <SearchResultsPage />,
          },
          {
            path: "author/:authorId",
            element: <AuthorDetail />,
          },
          {
            path: "/cart",
            element: <Cart />,
          },
          {
            path: "/documentReading/:documentId",
            element: <DocumentReading />,
          },
          {
            path: "profile/:userId",
            element: <ProfileLayout />,
            children: [
              {
                index: true,
                element: <PersonalInfo />,
              },
              {
                path: "financials",
                element: <Financials />,
              },
              {
                path: "purchase-history",
                element: <PurchaseHistory />,
              },
              {
                path: "reviewsManagement",
                element: <ReviewsManagement />,
              },
              {
                path: "uploadedDocs",
                element: <UploadedDocs />,
              },
              {
                path: "donationsReceived",
                element: <DonationsReceived />,
              },
            ],
          },
          {
            path: "upload",
            element: <UploadPage />,
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgotPassword",
        element: <ForgotPassword />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
