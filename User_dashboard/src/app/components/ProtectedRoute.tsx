import { Navigate, Outlet } from "react-router";
import { useApp } from "../context/AppContext";
import DashboardLayout from "./DashboardLayout";

export default function ProtectedRoute() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
