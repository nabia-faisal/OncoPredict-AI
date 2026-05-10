import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { doctorId, predictions } = useApp();

  const cards = [
    {
      title: "New Prediction",
      description: "Start a new breast cancer recurrence prediction using clinical data or MRI scans.",
      icon: "🔬",
      color: "primary",
      path: "/dashboard/new-prediction",
    },
    {
      title: "Prediction History",
      description: "View all past predictions and patient records saved in the database.",
      icon: "📋",
      color: "success",
      path: "/dashboard/history",
    },
    {
      title: "About Model",
      description: "Learn about the AI models powering the prediction system.",
      icon: "ℹ️",
      color: "info",
      path: "/dashboard/about",
    },
  ];

  return (
    <>
      {/* Welcome alert */}
      <div className="alert alert-primary d-flex align-items-center mb-4 py-2" role="alert">
        <span className="me-2">👋</span>
        <div className="small">
          Welcome back, <strong>{doctorId}</strong>! You have{" "}
          <span className="badge bg-primary">{predictions.length}</span>{" "}
          prediction{predictions.length !== 1 ? "s" : ""} on record.
        </div>
      </div>

      {/* Hero */}
      <div className="text-center mb-4">
        <div style={{ fontSize: 56 }}>🩺</div>
        <h2 className="fw-bold mt-2 mb-1">OncoPredict AI</h2>
        <p className="text-muted small mb-0">
          Advanced machine learning system for breast cancer diagnosis support.
          Select an option below to get started.
        </p>
      </div>

      {/* Cards */}
      <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
        {cards.map((card) => (
          <div className="col" key={card.title}>
            <div
              className="card h-100 border-0 shadow-sm text-center"
              onClick={() => navigate(card.path)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body px-3 py-4">
                <div style={{ fontSize: 40 }} className="mb-2">{card.icon}</div>
                <h6 className="card-title fw-semibold mb-1">{card.title}</h6>
                <p className="card-text text-muted small">{card.description}</p>
              </div>
              <div className="card-footer bg-transparent border-0 pb-3">
                <button className={`btn btn-${card.color} btn-sm px-4`}>
                  Open →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="row g-3">
        <div className="col-4">
          <div className="card border-0 bg-primary bg-opacity-10 text-center py-3">
            <h4 className="fw-bold text-primary mb-0">{predictions.length}</h4>
            <small className="text-muted">Total</small>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 bg-success bg-opacity-10 text-center py-3">
            <h4 className="fw-bold text-success mb-0">
              {predictions.filter(p => p.riskLevel === "Low").length}
            </h4>
            <small className="text-muted">Low Risk</small>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 bg-danger bg-opacity-10 text-center py-3">
            <h4 className="fw-bold text-danger mb-0">
              {predictions.filter(p => p.riskLevel === "High").length}
            </h4>
            <small className="text-muted">High Risk</small>
          </div>
        </div>
      </div>
    </>
  );
}
