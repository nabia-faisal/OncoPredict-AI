import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { AlertCircle, CheckCircle2, AlertTriangle, Home } from "lucide-react";

export default function Result() {
  const navigate = useNavigate();
  const { currentPrediction } = useApp();

  if (!currentPrediction) {
    navigate("/dashboard");
    return null;
  }

  const getColorScheme = () => {
    if (currentPrediction.riskLevel === "Low") {
      return {
        bg: "from-green-50 to-emerald-50",
        text: "text-green-700",
        icon: CheckCircle2,
        iconColor: "text-green-500",
        progressColor: "bg-green-500",
      };
    }
    if (currentPrediction.riskLevel === "Moderate") {
      return {
        bg: "from-yellow-50 to-orange-50",
        text: "text-yellow-700",
        icon: AlertTriangle,
        iconColor: "text-yellow-500",
        progressColor: "bg-yellow-500",
      };
    }
    return {
      bg: "from-red-50 to-pink-50",
      text: "text-red-700",
      icon: AlertCircle,
      iconColor: "text-red-500",
      progressColor: "bg-red-500",
    };
  };

  const scheme = getColorScheme();
  const Icon = scheme.icon;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Prediction Result</h1>
      </div>

      <Card className={`p-8 bg-gradient-to-br ${scheme.bg} border-slate-200`}>
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Icon className={`w-10 h-10 ${scheme.iconColor}`} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className={`text-3xl font-bold ${scheme.text}`}>{currentPrediction.result}</h2>
            <p className="text-slate-600">Risk Level: {currentPrediction.riskLevel}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Confidence Score</span>
              <span className={`text-lg font-semibold ${scheme.text}`}>{currentPrediction.confidence}%</span>
            </div>
            <Progress value={currentPrediction.confidence} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-semibold text-slate-700">{currentPrediction.date}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Model Type</p>
              <p className="font-semibold text-slate-700">{currentPrediction.type}</p>
            </div>
            {currentPrediction.patientName && (
              <div className="col-span-2">
                <p className="text-sm text-slate-500">Patient</p>
                <p className="font-semibold text-slate-700">{currentPrediction.patientName}</p>
              </div>
            )}
          </div>

          {currentPrediction.confidence < 70 && (
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-orange-700">
                ⚠️ Low confidence prediction. Consultation with a specialist is recommended for further evaluation.
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Important Note</h3>
        <p className="text-sm text-blue-700">
          This AI system provides diagnostic support and should not replace professional medical judgment. Always consult
          with specialists and consider additional clinical findings before making final decisions.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => navigate("/dashboard")}
          className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 rounded-lg"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button onClick={() => navigate("/dashboard/new-prediction")} variant="outline" className="flex-1 rounded-lg">
          New Prediction
        </Button>
      </div>
    </div>
  );
}
