import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { registerDoctor } from "../api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Stethoscope } from "lucide-react";

export default function Login() {
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerDoctor(doctorId, password);
      }
      await login(doctorId, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-32 h-32 text-blue-400" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-slate-200">
              <p className="text-sm text-slate-600">Trusted by Healthcare Professionals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">O</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">OncoPredict AI</h2>
            </div>
            <h3 className="text-lg text-slate-600">
              {isRegister ? "Create Account" : "Doctor Login"}
            </h3>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="doctorId">Doctor ID</Label>
              <Input
                id="doctorId"
                type="text"
                placeholder="Enter your doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="h-12 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isRegister ? "Create a password (min 6 chars)" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 rounded-lg"
            >
              {loading ? (isRegister ? "Creating Account..." : "Logging in...") : (isRegister ? "Register" : "Login")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isRegister ? "Already have an account? Login" : "New doctor? Register here"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Advanced AI-powered breast cancer prediction system for medical professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
