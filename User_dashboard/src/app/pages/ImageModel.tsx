import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ArrowLeft, Upload, ScanLine } from "lucide-react";
import { predictImage } from "../api";

export default function ImageModel() {
  const navigate = useNavigate();
  const { addPrediction, setCurrentPrediction, patientHistory } = useApp();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    setError("");
    setLoading(true);

    try {
      const result = await predictImage(image);

      // image model returns confidence as 0–1, multiply by 100
      const confidencePercent = Math.round(result.confidence * 100);
      const riskLevel =
        confidencePercent > 70 ? "High" :
        confidencePercent > 40 ? "Moderate" : "Low";

      const prediction = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        type: "Image" as const,
        patientName: patientHistory?.patientName || "Unknown",
        result: result.prediction,
        confidence: confidencePercent,
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

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("/dashboard/model-selection")} variant="outline" className="rounded-lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-slate-800">Image Model - MRI Upload</h1>
      </div>

      {patientHistory && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Patient:</span> {patientHistory.patientName} |{" "}
            <span className="font-semibold">Age:</span> {patientHistory.age}
          </p>
        </div>
      )}

      <Card className="p-8 bg-white border-slate-200">
        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center">
              <ScanLine className="w-12 h-12 text-teal-500" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload MRI Scan</h3>
            <p className="text-sm text-slate-600">Upload a single MRI scan for analysis</p>
          </div>

          {error && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-700">⚠️ {error}</p>
            </div>
          )}

          {!preview ? (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Drag and drop or click to upload</p>
                <p className="text-sm text-slate-500">JPG and PNG accepted</p>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-slate-300 rounded-xl p-4">
                <img src={preview} alt="MRI Preview" className="w-full h-64 object-contain rounded-lg" />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 rounded-lg"
                >
                  {loading ? "Analyzing..." : "Analyze Image"}
                </Button>
                <Button
                  onClick={() => { setImage(null); setPreview(null); setError(""); }}
                  variant="outline"
                  className="flex-1 rounded-lg"
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}