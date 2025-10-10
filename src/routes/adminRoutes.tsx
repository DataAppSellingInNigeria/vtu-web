// src/routes/adminRoutes.tsx (or integrate into your main router file)
import { createBrowserRouter } from "react-router-dom";
import RequireAccess from "../components/admin/RequireAccess";
import AdminLayout from "../components/admin/AdminLayout";           // path may be "@/layouts/AdminLayout"
import AdminLogin from "../pages/admin/AdminLogin";
import AdminRegister from "../pages/admin/AdminRegister";
import { StatusPage } from "../pages/admin/StatusPage";
import TransactionsPage from "../pages/admin/TransactionsPage";
// import other admin pages...

export const router = createBrowserRouter([
  // Public admin auth pages
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/register", element: <AdminRegister /> }, // hide behind env flag in prod

  // Protected admin area — any of ["admin","superAdmin"]
  {
    path: "/admin",
    element: <RequireAccess anyRole={["admin","superAdmin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <StatusPage /> },      // sample
          { path: "status", element: <StatusPage /> },
          { path: "transactions", element: <TransactionsPage /> },
          // ...other admin pages
        ],
      },
    ],
  },
]);
