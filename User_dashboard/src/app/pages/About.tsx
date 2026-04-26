import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ArrowLeft, Brain, Shield, TrendingUp, Database } from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  const parameters = [
    "Age Range - Patient age group",
    "Menopause Status - Hormonal status",
    "Tumor Size - Size in millimeters",
    "Invasive Nodes - Number of affected nodes",
    "Node Caps - Capsule involvement",
    "Degree of Malignancy - Tumor grade (1-3)",
    "Breast Location - Left or right",
    "Breast Quadrant - Tumor location",
    "Irradiation - Radiation therapy status",
  ];

  const features = [
    {
      icon: Database,
      title: "Analysis of 9 Critical Parameters",
      description: "Comprehensive evaluation of patient medical data",
    },
    {
      icon: Brain,
      title: "CNN-Based Image Analysis",
      description: "Advanced deep learning for mammogram interpretation",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Predictions",
      description: "Instant results with confidence scoring",
    },
    {
      icon: Shield,
      title: "Risk Categorization",
      description: "Clear Low, Moderate, and High risk levels",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="rounded-lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-400 rounded-2xl flex items-center justify-center">
            <span className="text-white text-3xl font-bold">O</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">OncoPredict AI</h1>
        <p className="text-lg text-slate-600">Advanced machine learning system for breast cancer diagnosis support</p>
      </div>

      <Card className="p-8 bg-white border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Purpose</h2>
        <p className="text-slate-700 leading-relaxed">
          OncoPredict AI uses machine learning and deep learning (CNN) to predict the likelihood of breast cancer
          recurrence based on patient medical data and mammogram images. It analyzes multiple factors including age,
          tumor characteristics, and treatment history to provide diagnostic support to medical professionals.
        </p>
      </Card>

      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">⚠️ Important: This system assists doctors, not replaces them</h3>
            <p className="text-sm text-red-700">
              OncoPredict AI is a decision support tool and should never be used as a replacement for professional
              medical judgment.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 bg-white border-slate-200">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="p-8 bg-white border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Input Parameters</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {parameters.map((param, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-700 text-sm">{param}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Important Disclaimers</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-slate-700">
            <span className="text-yellow-600 font-bold">•</span>
            <span className="text-sm">This is a decision support tool, not a replacement for medical judgment</span>
          </li>
          <li className="flex items-start gap-2 text-slate-700">
            <span className="text-yellow-600 font-bold">•</span>
            <span className="text-sm">Always consult with specialists for final diagnosis</span>
          </li>
          <li className="flex items-start gap-2 text-slate-700">
            <span className="text-yellow-600 font-bold">•</span>
            <span className="text-sm">Low confidence predictions (&lt;70%) require additional evaluation</span>
          </li>
          <li className="flex items-start gap-2 text-slate-700">
            <span className="text-yellow-600 font-bold">•</span>
            <span className="text-sm">Results should be considered alongside other clinical findings</span>
          </li>
        </ul>
      </Card>

      <Card className="p-8 bg-slate-50 border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Technologies Used</h2>
        <p className="text-slate-700">
          HTML, CSS, JavaScript, React, Tailwind CSS, FastAPI, Machine Learning, CNN
        </p>
      </Card>
    </div>
  );
}
