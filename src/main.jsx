import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootLayout from "./RootLayout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [{}],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
