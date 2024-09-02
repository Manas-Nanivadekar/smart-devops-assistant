import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./RootLayout";
import LandingPage from "./pages/LandingPage";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Solutions = React.lazy(() => import("./pages/Solutions"));
const Support = React.lazy(() => import("./pages/Support"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "dashboard",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </React.Suspense>
        ),
      },
      {
        path: "solutions",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Solutions />
          </React.Suspense>
        ),
      },
      {
        path: "support",
        element: (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Support />
          </React.Suspense>
        ),
      },

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}