import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  loginDoctor,
  fetchPredictions,
  savePrediction,
  savePatient,
  getToken,
} from "../api";

interface Prediction {
  id: string;
  _id?: string;
  date: string;
  type: "Clinical" | "Image" | "Combined";
  patientName?: string;
  result: string;
  confidence: number;
  riskLevel: "Low" | "Moderate" | "High";
}

interface PatientHistory {
  patientName: string;
  age: string;
  contact: string;
  bodyTemperature: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  height: string;
  weight: string;
  bmi: string;
  chiefComplaint: string;
  allergiesDrug: boolean;
  allergiesFood: boolean;
  allergiesEnvironmental: boolean;
  allergyDetails: string;
  onsetDuration: string;
  severity: string;
  pastMedicalHistory: string;
  pastSurgicalHistory: string;
  familyMedicalHistory: string;
  smoking: string;
  alcohol: string;
  diet: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  doctorId: string;
  predictions: Prediction[];
  currentPrediction: Prediction | null;
  patientHistory: PatientHistory | null;
  login: (id: string, password: string) => Promise<void>;
  logout: () => void;
  addPrediction: (prediction: Omit<Prediction, "id">) => Promise<void>;
  setCurrentPrediction: (prediction: Prediction | null) => void;
  setPatientHistory: (history: PatientHistory) => void;
  savePatientToDb: (history: PatientHistory) => Promise<void>;
  loadPredictions: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);
  const [patientHistory, setPatientHistoryState] = useState<PatientHistory | null>(null);

  // Restore session from localStorage on app load
  useEffect(() => {
    const token = getToken();
    const storedId = localStorage.getItem("doctorId");
    if (token && storedId) {
      setIsAuthenticated(true);
      setDoctorId(storedId);
    }
  }, []);

  // Load predictions from MongoDB when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadPredictions();
    }
  }, [isAuthenticated]);

  const loadPredictions = async () => {
    try {
      const data = await fetchPredictions();
      // Normalize _id to id
      const normalized = data.map((p: any) => ({
        ...p,
        id: p._id || p.id,
      }));
      setPredictions(normalized);
    } catch (err) {
      console.error("Failed to load predictions:", err);
    }
  };

  const login = async (id: string, password: string) => {
    const data = await loginDoctor(id, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("doctorId", data.doctorId);
    setDoctorId(data.doctorId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctorId");
    setIsAuthenticated(false);
    setDoctorId("");
    setPredictions([]);
    setCurrentPrediction(null);
    setPatientHistoryState(null);
  };

  const addPrediction = async (prediction: Omit<Prediction, "id">) => {
    try {
      const saved = await savePrediction(prediction);
      const normalized = { ...saved, id: saved._id || saved.id };
      setPredictions((prev) => [normalized, ...prev]);
      setCurrentPrediction(normalized);
    } catch (err) {
      console.error("Failed to save prediction:", err);
      // Fallback: still show in UI even if DB save failed
      const fallback = { ...prediction, id: Date.now().toString() };
      setPredictions((prev) => [fallback, ...prev]);
      setCurrentPrediction(fallback);
    }
  };

  const setPatientHistory = (history: PatientHistory) => {
    setPatientHistoryState(history);
  };

  const savePatientToDb = async (history: PatientHistory) => {
    try {
      await savePatient(history);
    } catch (err) {
      console.error("Failed to save patient to DB:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        doctorId,
        predictions,
        currentPrediction,
        patientHistory,
        login,
        logout,
        addPrediction,
        setCurrentPrediction,
        setPatientHistory,
        savePatientToDb,
        loadPredictions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
