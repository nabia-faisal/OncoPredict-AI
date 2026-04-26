import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Activity, Clock, Info, Plus } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "New Prediction",
      description: "Start a new cancer recurrence prediction",
      icon: Plus,
      color: "from-blue-400 to-blue-500",
      path: "/dashboard/new-prediction",
    },
    {
      title: "History",
      description: "View past predictions and patient records",
      icon: Clock,
      color: "from-teal-400 to-teal-500",
      path: "/dashboard/history",
    },
    {
      title: "About Model",
      description: "Learn about the AI prediction system",
      icon: Info,
      color: "from-purple-400 to-purple-500",
      path: "/dashboard/about",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
            <Activity className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-slate-800">Welcome to OncoPredict AI</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Advanced machine learning system for breast cancer diagnosis support. Select an option below to get started.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              onClick={() => navigate(card.path)}
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-slate-200 bg-white"
            >
              <div className="space-y-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-600">{card.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
