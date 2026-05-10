import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { predictClinical } from "../api";

export default function ClinicalModel() {
  const navigate = useNavigate();
  const { addPrediction, patientHistory } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    age: "", menopause: "", tumorSize: "", invNodes: "",
    nodeCaps: "", degMalig: "", breast: "", breastQuad: "", irradiat: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await predictClinical({
        age: formData.age, menopause: formData.menopause,
        tumor_size: formData.tumorSize, inv_nodes: formData.invNodes,
        node_caps: formData.nodeCaps, deg_malig: formData.degMalig,
        breast: formData.breast, breast_quad: formData.breastQuad,
        irradiat: formData.irradiat,
      });
      const riskLevel = result.confidence > 70 ? "High" : result.confidence > 40 ? "Moderate" : "Low";
      await addPrediction({
        date: new Date().toLocaleDateString(),
        type: "Clinical",
        patientName: patientHistory?.patientName || "Unknown",
        result: result.prediction,
        confidence: Math.round(result.confidence),
        riskLevel: riskLevel as "Low" | "Moderate" | "High",
      });
      navigate("/dashboard/result");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFormData({ ...formData, [field]: e.target.value });

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/dashboard/model-selection")}>
          ← Back
        </button>
        <h2 className="fw-bold mb-0">Clinical Model — Patient Data</h2>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">

          {patientHistory && (
            <div className="alert alert-info mb-4">
              <strong>Patient:</strong> {patientHistory.patientName} &nbsp;|&nbsp;
              <strong>Age:</strong> {patientHistory.age}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">

              <div className="col-md-6">
                <label className="form-label fw-medium">Age Range</label>
                <select className="form-select" value={formData.age} onChange={set("age")} required>
                  <option value="">Select age range</option>
                  {["20-29","30-39","40-49","50-59","60-69","70-79"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Menopause Status</label>
                <select className="form-select" value={formData.menopause} onChange={set("menopause")} required>
                  <option value="">Select status</option>
                  <option value="lt40">Less than 40</option>
                  <option value="ge40">Greater or equal 40</option>
                  <option value="premeno">Premenopausal</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Tumor Size (mm)</label>
                <select className="form-select" value={formData.tumorSize} onChange={set("tumorSize")} required>
                  <option value="">Select size</option>
                  {["0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Invasive Nodes</label>
                <select className="form-select" value={formData.invNodes} onChange={set("invNodes")} required>
                  <option value="">Select number</option>
                  {["0-2","3-5","6-8","9-11","12-14","15-17","18-20","21-23","24-26"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Node Caps</label>
                <select className="form-select" value={formData.nodeCaps} onChange={set("nodeCaps")} required>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Degree of Malignancy</label>
                <select className="form-select" value={formData.degMalig} onChange={set("degMalig")} required>
                  <option value="">Select grade</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Breast</label>
                <select className="form-select" value={formData.breast} onChange={set("breast")} required>
                  <option value="">Select</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Breast Quadrant</label>
                <select className="form-select" value={formData.breastQuad} onChange={set("breastQuad")} required>
                  <option value="">Select quadrant</option>
                  <option value="left_up">Left Upper</option>
                  <option value="left_low">Left Lower</option>
                  <option value="right_up">Right Upper</option>
                  <option value="right_low">Right Lower</option>
                  <option value="central">Central</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Irradiation</label>
                <select className="form-select" value={formData.irradiat} onChange={set("irradiat")} required>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

            </div>

            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Analyzing...
                  </>
                ) : "Run Prediction"}
              </button>
              <button type="button" className="btn btn-outline-secondary flex-grow-1"
                onClick={() => setFormData({ age:"", menopause:"", tumorSize:"", invNodes:"", nodeCaps:"", degMalig:"", breast:"", breastQuad:"", irradiat:"" })}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
