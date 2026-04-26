import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { FileText, ImageIcon, Layers } from "lucide-react";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PredictionSelection() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Run Clinical Model",
      description: "Use patient medical data",
      icon: FileText,
      color: "from-blue-400 to-blue-500",
      path: "/dashboard/clinical-model",
    },
    {
      title: "Run Image Model",
      description: "Upload MRI scan only",
      icon: ImageIcon,
      color: "from-teal-400 to-teal-500",
      path: "/dashboard/image-model",
    },
    {
      title: "Run Combined Model",
      description: "Use both data and MRI scan",
      icon: Layers,
      color: "from-purple-400 to-purple-500",
      path: "/dashboard/combined-model",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("/dashboard/new-prediction")} variant="outline" className="rounded-lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-slate-800">Select Prediction Model</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.title}
              onClick={() => navigate(option.path)}
              className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 bg-white"
            >
              <div className="space-y-6 text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mx-auto`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{option.title}</h3>
                  <p className="text-sm text-slate-600">{option.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
