import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { doctorId, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">O</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-800">OncoPredict AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <User className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700">{doctorId}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
