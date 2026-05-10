import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function Result() {
  const navigate = useNavigate();
  const { currentPrediction } = useApp();

  if (!currentPrediction) {
    navigate("/dashboard");
    return null;
  }

  const getAlertType = () => {
    if (currentPrediction.riskLevel === "Low") return "success";
    if (currentPrediction.riskLevel === "Moderate") return "warning";
    return "danger";
  };

  const getIcon = () => {
    if (currentPrediction.riskLevel === "Low") return "✅";
    if (currentPrediction.riskLevel === "Moderate") return "⚠️";
    return "🚨";
  };

  const alertType = getAlertType();

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">

          <h2 className="fw-bold text-center mb-4">Prediction Result</h2>

          {/* Main result card */}
          <div className={`card border-${alertType} shadow mb-4`}>
            <div className={`card-header bg-${alertType} bg-opacity-10 text-center py-4`}>
              <div className="display-3 mb-2">{getIcon()}</div>
              <h3 className={`fw-bold text-${alertType} mb-1`}>{currentPrediction.result}</h3>
              <span className={`badge bg-${alertType} fs-6`}>{currentPrediction.riskLevel} Risk</span>
            </div>
            <div className="card-body p-4">

              {/* Confidence bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-medium">Confidence Score</span>
                  <span className={`fw-bold text-${alertType}`}>{currentPrediction.confidence}%</span>
                </div>
                <div className="progress" style={{ height: "12px" }}>
                  <div
                    className={`progress-bar bg-${alertType}`}
                    style={{ width: `${currentPrediction.confidence}%` }}
                    role="progressbar"
                  ></div>
                </div>
              </div>

              {/* Details grid */}
              <div className="row g-3 border-top pt-3">
                <div className="col-6">
                  <small className="text-muted d-block">Date</small>
                  <span className="fw-semibold">{currentPrediction.date}</span>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Model Type</small>
                  <span className="fw-semibold">{currentPrediction.type}</span>
                </div>
                {currentPrediction.patientName && (
                  <div className="col-12">
                    <small className="text-muted d-block">Patient</small>
                    <span className="fw-semibold">{currentPrediction.patientName}</span>
                  </div>
                )}
              </div>

              {currentPrediction.confidence < 70 && (
                <div className="alert alert-warning mt-3 mb-0">
                  ⚠️ Low confidence prediction. Consultation with a specialist is recommended.
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="alert alert-info">
            <strong>Important Note:</strong> This AI system provides diagnostic support and should not replace
            professional medical judgment. Always consult with specialists before making final decisions.
          </div>

          {/* Action buttons */}
          <div className="d-flex gap-3">
            <button className="btn btn-primary flex-grow-1" onClick={() => navigate("/dashboard")}>
              🏠 Back to Dashboard
            </button>
            <button className="btn btn-outline-secondary flex-grow-1" onClick={() => navigate("/dashboard/new-prediction")}>
              New Prediction
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
