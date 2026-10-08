import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./page/Home";
import Dashboard from "./page/Dashboard";
import Login from "./page/Login";
import Signup from "./page/Signup";

function ProtectedDashboard() {
  const auth = window.localStorage.getItem("expenseTrackerAuth");
  let isAuthenticated = false;

  if (auth) {
    try {
      isAuthenticated = Boolean(JSON.parse(auth)?.token);
    } catch {
      window.localStorage.removeItem("expenseTrackerAuth");
    }
  }

  return isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <ProtectedDashboard />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
