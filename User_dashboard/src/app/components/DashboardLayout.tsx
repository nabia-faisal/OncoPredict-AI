import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { doctorId, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <div className="container-fluid">
          {/* Brand */}
          <span className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <span
              className="rounded-2 text-white fw-bold d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32, background: "linear-gradient(135deg,#3b82f6,#14b8a6)", fontSize: 16 }}
            >O</span>
            OncoPredict AI
          </span>

          {/* Toggler for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav items */}
          <div className="collapse navbar-collapse justify-content-end" id="mainNav">
            <ul className="navbar-nav align-items-center gap-2 py-2 py-lg-0">
              <li className="nav-item">
                <span className="navbar-text text-white-50 small">
                  👤 {doctorId}
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-grow-1 bg-light">
        <div className="container-fluid px-3 px-md-4 py-4">
          {children}
        </div>
      </main>
    </div>
  );
}
