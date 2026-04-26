import { createContext, useContext, useState, ReactNode } from "react";

interface Prediction {
  id: string;
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
  login: (id: string) => void;
  logout: () => void;
  addPrediction: (prediction: Prediction) => void;
  setCurrentPrediction: (prediction: Prediction | null) => void;
  setPatientHistory: (history: PatientHistory) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);
  const [patientHistory, setPatientHistoryState] = useState<PatientHistory | null>(null);

  const login = (id: string) => {
    setDoctorId(id);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setDoctorId("");
    setPredictions([]);
    setCurrentPrediction(null);
    setPatientHistoryState(null);
  };

  const addPrediction = (prediction: Prediction) => {
    setPredictions((prev) => [prediction, ...prev]);
  };

  const setPatientHistory = (history: PatientHistory) => {
    setPatientHistoryState(history);
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
