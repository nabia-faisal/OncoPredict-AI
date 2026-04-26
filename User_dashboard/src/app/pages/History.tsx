import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ArrowLeft, Calendar, FileText, ImageIcon, Layers } from "lucide-react";
import { Badge } from "../components/ui/badge";

export default function History() {
  const navigate = useNavigate();
  const { predictions } = useApp();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Clinical":
        return FileText;
      case "Image":
        return ImageIcon;
      case "Combined":
        return Layers;
      default:
        return FileText;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      case "Moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-slate-800">Prediction History</h1>
        </div>
        <Badge variant="outline" className="text-sm">
          {predictions.length} {predictions.length === 1 ? "Record" : "Records"}
        </Badge>
      </div>

      {predictions.length === 0 ? (
        <Card className="p-12 bg-white border-slate-200 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No Predictions Yet</h3>
          <p className="text-slate-600 mb-6">Start making predictions to see your history here</p>
          <Button
            onClick={() => navigate("/dashboard/new-prediction")}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 rounded-lg"
          >
            New Prediction
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {predictions.map((prediction) => {
            const TypeIcon = getTypeIcon(prediction.type);
            return (
              <Card key={prediction.id} className="p-6 bg-white border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TypeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-800">{prediction.result}</h3>
                        <Badge className={getRiskColor(prediction.riskLevel)}>{prediction.riskLevel} Risk</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Date</p>
                          <p className="text-slate-700 font-medium">{prediction.date}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Model Type</p>
                          <p className="text-slate-700 font-medium">{prediction.type}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Confidence</p>
                          <p className="text-slate-700 font-medium">{prediction.confidence}%</p>
                        </div>
                        {prediction.patientName && (
                          <div>
                            <p className="text-slate-500">Patient</p>
                            <p className="text-slate-700 font-medium">{prediction.patientName}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
