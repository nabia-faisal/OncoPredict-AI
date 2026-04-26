import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { predictClinical } from "../api";

export default function ClinicalModel() {
  const navigate = useNavigate();
  const { addPrediction, setCurrentPrediction, patientHistory } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    age: "",
    menopause: "",
    tumorSize: "",
    invNodes: "",
    nodeCaps: "",
    degMalig: "",
    breast: "",
    breastQuad: "",
    irradiat: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await predictClinical({
        age: formData.age,
        menopause: formData.menopause,
        tumor_size: formData.tumorSize,
        inv_nodes: formData.invNodes,
        node_caps: formData.nodeCaps,
        deg_malig: formData.degMalig,
        breast: formData.breast,
        breast_quad: formData.breastQuad,
        irradiat: formData.irradiat,
      });

      const riskLevel =
        result.confidence > 70 ? "High" :
        result.confidence > 40 ? "Moderate" : "Low";

      const prediction = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        type: "Clinical" as const,
        patientName: patientHistory?.patientName || "Unknown",
        result: result.prediction,
        confidence: Math.round(result.confidence),
        riskLevel: riskLevel as "Low" | "Moderate" | "High",
      };

      addPrediction(prediction);
      setCurrentPrediction(prediction);
      navigate("/dashboard/result");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: "",
      menopause: "",
      tumorSize: "",
      invNodes: "",
      nodeCaps: "",
      degMalig: "",
      breast: "",
      breastQuad: "",
      irradiat: "",
    });
    setError("");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("/dashboard/model-selection")} variant="outline" className="rounded-lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-slate-800">Clinical Model - Patient Data</h1>
      </div>

      <Card className="p-8 bg-white border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {patientHistory && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Patient:</span> {patientHistory.patientName} |{" "}
                <span className="font-semibold">Age:</span> {patientHistory.age}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-700">⚠️ {error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Age Range</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20-29">20-29</SelectItem>
                  <SelectItem value="30-39">30-39</SelectItem>
                  <SelectItem value="40-49">40-49</SelectItem>
                  <SelectItem value="50-59">50-59</SelectItem>
                  <SelectItem value="60-69">60-69</SelectItem>
                  <SelectItem value="70-79">70-79</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Menopause Status</Label>
              <Select value={formData.menopause} onValueChange={(value) => setFormData({ ...formData, menopause: value })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lt40">Less than 40</SelectItem>
                  <SelectItem value="ge40">Greater or equal 40</SelectItem>
                  <SelectItem value="premeno">Premenopausal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tumor Size (mm)</Label>
              <Select value={formData.tumorSize} onValueChange={(value) => setFormData({ ...formData, tumorSize: value })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-4">0-4</SelectItem>
                  <SelectItem value="5-9">5-9</SelectItem>
                  <SelectItem value="10-14">10-14</SelectItem>
                  <SelectItem value="15-19">15-19</SelectItem>
                  <SelectItem value="20-24">20-24</SelectItem>
                  <SelectItem value="25-29">25-29</SelectItem>
                  <SelectItem value="30-34">30-34</SelectItem>
                  <SelectItem value="35-39">35-39</SelectItem>
                  <SelectItem value="40-44">40-44</SelectItem>
                  <SelectItem value="45-49">45-49</SelectItem>
                  <SelectItem value="50-54">50-54</SelectItem>
                  <SelectItem value="55-59">55-59</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Invasive Nodes</Label>
              <Select value={formData.invNodes} onValueChange={(value) => setFormData({ ...formData, invNodes: value })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2</SelectItem>
                  <SelectItem value="3-5">3-5</SelectItem>
                  <SelectItem value="6-8">6-8</SelectItem>
                  <SelectItem value="9-11">9-11</SelectItem>
                  <SelectItem value="12-14">12-14</SelectItem>
                  <SelectItem value="15-17">15-17</SelectItem>
                  <SelectItem value="18-20">18-20</SelectItem>
                  <SelectItem value="21-23">21-23</SelectItem>
                  <SelectItem value="24-26">24-26</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Node Caps</Label>
              <Select value={formData.nodeCaps} onValueChange={(value) => setFormData({ ...formData, nodeCaps: value })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Degree of Malignancy</Label>
              <Select value={formData.degMalig} onValueChange={(value) => setFormData({ ...formData, degMalig: value })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Grade 1</SelectItem>
                  <SelectItem value="2">Grade 2</SelectItem>
                  <SelectItem value="3">Grade 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Breast</Label>
              <Select value={formData.breast} onValueChange={(value) => setFormData({ ...formData, breast: value })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Breast Quadrant</Label>
              <Select value={formData.breastQuad} onValueChange={(value) => setFormData({ ...formData, breastQuad: value })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select quadrant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left_up">Left Upper</SelectItem>
                  <SelectItem value="left_low">Left Lower</SelectItem>
                  <SelectItem value="right_up">Right Upper</SelectItem>
                  <SelectItem value="right_low">Right Lower</SelectItem>
                  <SelectItem value="central">Central</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Irradiation</Label>
              <Select value={formData.irradiat} onValueChange={(value) => setFormData({ ...formData, irradiat: value })} required>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 rounded-lg"
            >
              {loading ? "Analyzing..." : "Predict"}
            </Button>
            <Button type="button" onClick={handleReset} variant="outline" className="flex-1 rounded-lg">
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}