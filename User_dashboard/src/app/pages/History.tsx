import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function History() {
  const navigate = useNavigate();
  const { predictions } = useApp();

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Low": return "success";
      case "Moderate": return "warning";
      case "High": return "danger";
      default: return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Clinical": return "📋";
      case "Image": return "🖼️";
      case "Combined": return "🔗";
      default: return "📄";
    }
  };

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h2 className="fw-bold mb-0">Prediction History</h2>
        </div>
        <span className="badge bg-primary fs-6">
          {predictions.length} {predictions.length === 1 ? "Record" : "Records"}
        </span>
      </div>

      {predictions.length === 0 ? (
        /* Empty state */
        <div className="card border-0 shadow-sm text-center p-5">
          <div className="display-1 mb-3">📭</div>
          <h4 className="fw-semibold">No Predictions Yet</h4>
          <p className="text-muted">Start making predictions to see your history here.</p>
          <div className="mt-3">
            <button
              className="btn btn-primary px-4"
              onClick={() => navigate("/dashboard/new-prediction")}
            >
              New Prediction
            </button>
          </div>
        </div>
      ) : (
        /* Prediction list */
        <div className="row g-3">
          {predictions.map((prediction) => (
            <div className="col-12" key={prediction.id}>
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <span className="display-6">{getTypeIcon(prediction.type)}</span>
                    </div>
                    <div className="col">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h5 className="fw-semibold mb-0">{prediction.result}</h5>
                        <span className={`badge bg-${getRiskBadge(prediction.riskLevel)}`}>
                          {prediction.riskLevel} Risk
                        </span>
                        <span className="badge bg-secondary">{prediction.type}</span>
                      </div>
                      <div className="row g-3 text-sm">
                        <div className="col-auto">
                          <small className="text-muted">Date: </small>
                          <small className="fw-medium">{prediction.date}</small>
                        </div>
                        <div className="col-auto">
                          <small className="text-muted">Confidence: </small>
                          <small className="fw-medium">{prediction.confidence}%</small>
                        </div>
                        {prediction.patientName && (
                          <div className="col-auto">
                            <small className="text-muted">Patient: </small>
                            <small className="fw-medium">{prediction.patientName}</small>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-auto">
                      {/* Confidence progress bar */}
                      <div style={{ width: "120px" }}>
                        <small className="text-muted">Confidence</small>
                        <div className="progress mt-1" style={{ height: "8px" }}>
                          <div
                            className={`progress-bar bg-${getRiskBadge(prediction.riskLevel)}`}
                            style={{ width: `${prediction.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
