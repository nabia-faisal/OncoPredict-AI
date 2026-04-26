import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientHistory from "./pages/PatientHistory";
import PredictionSelection from "./pages/PredictionSelection";
import ClinicalModel from "./pages/ClinicalModel";
import ImageModel from "./pages/ImageModel";
import CombinedModel from "./pages/CombinedModel";
import Result from "./pages/Result";
import History from "./pages/History";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      { index: true, Component: Dashboard },
      { path: "new-prediction", Component: PatientHistory },
      { path: "model-selection", Component: PredictionSelection },
      { path: "clinical-model", Component: ClinicalModel },
      { path: "image-model", Component: ImageModel },
      { path: "combined-model", Component: CombinedModel },
      { path: "result", Component: Result },
      { path: "history", Component: History },
      { path: "about", Component: About },
    ],
  },
]);
