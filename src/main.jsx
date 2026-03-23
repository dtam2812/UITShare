import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi.js' 
import { createRoot } from "react-dom/client";
import "./index.css";
import RootLayout from "./RootLayout.jsx";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/Auth/Login.jsx"
import Register from "./pages/Auth/Register.jsx"
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ProfileLayout from "./pages/Profile/ProfileLayout.jsx"
import Financials from "./pages/Profile/Financials.jsx"
import PersonalInfo from "./pages/Profile/PersonalInfo.jsx"
import PurchaseHistory from "./pages/Profile/PurchaseHistory.jsx"
import ReviewsManagement from "./pages/Profile/ReviewsManagement.jsx"
import UploadedDocs from "./pages/Profile/UploadedDocs.jsx"
import AuthorDetail from "./pages/Author/AuthorDetail.jsx";
import UploadPage from "./pages/Document/UploadPage.jsx";
import DonationsReceived from './pages/Profile/DonationsReceived.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
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
        path: "forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "author/:id",
        element: <AuthorDetail />
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <PersonalInfo />
          },
          {
            path: "financials",
            element: <Financials />
          },
          {
            path: "purchase-history",
            element: <PurchaseHistory />
          },
          {
            path: "reviews-management",
            element: <ReviewsManagement />
          },
          {
            path: "uploaded-docs",
            element: <UploadedDocs />
          },
          {
            path: "donated-received",
            element: <DonationsReceived />
          }
        ]
      },
      {
        path: "upload",
        element: <UploadPage />
      }
    ],
  },
]);

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </WagmiProvider>
);