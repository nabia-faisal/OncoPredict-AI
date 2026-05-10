// ─── BASE URLs ─────────────────────────────────────────────────────────────
const PYTHON_API = "http://localhost:8000";   // FastAPI (ML models)
const EXPRESS_API = "http://localhost:5000";  // Express (auth + DB)

// ─── TOKEN HELPERS ──────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ─── AUTH ───────────────────────────────────────────────────────────────────
export async function loginDoctor(doctorId: string, password: string) {
  const res = await fetch(`${EXPRESS_API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doctorId, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Login failed");
  }
  return res.json(); // { doctorId, name, token }
}

export async function registerDoctor(doctorId: string, password: string, name?: string) {
  const res = await fetch(`${EXPRESS_API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doctorId, password, name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Registration failed");
  }
  return res.json(); // { doctorId, name, token }
}

// ─── PREDICTIONS (MongoDB) ──────────────────────────────────────────────────
export async function fetchPredictions() {
  const res = await fetch(`${EXPRESS_API}/api/predictions`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch predictions");
  return res.json();
}

export async function savePrediction(prediction: {
  type: "Clinical" | "Image" | "Combined";
  patientName?: string;
  result: string;
  confidence: number;
  riskLevel: "Low" | "Moderate" | "High";
  date: string;
}) {
  const res = await fetch(`${EXPRESS_API}/api/predictions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(prediction),
  });
  if (!res.ok) throw new Error("Failed to save prediction");
  return res.json();
}

export async function deletePrediction(id: string) {
  const res = await fetch(`${EXPRESS_API}/api/predictions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete prediction");
  return res.json();
}

// ─── PATIENTS (MongoDB) ─────────────────────────────────────────────────────
export async function savePatient(patientData: object) {
  const res = await fetch(`${EXPRESS_API}/api/patients`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(patientData),
  });
  if (!res.ok) throw new Error("Failed to save patient");
  return res.json();
}

export async function fetchPatients() {
  const res = await fetch(`${EXPRESS_API}/api/patients`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

// ─── CLINICAL (Python FastAPI) ──────────────────────────────────────────────
export async function predictClinical(data: {
  age: string;
  menopause: string;
  tumor_size: string;
  inv_nodes: string;
  node_caps: string;
  deg_malig: string;
  breast: string;
  breast_quad: string;
  irradiat: string;
}) {
  const res = await fetch(`${PYTHON_API}/predict-clinical`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Clinical prediction failed");
  }
  return res.json();
}

// ─── IMAGE (Python FastAPI) ─────────────────────────────────────────────────
export async function predictImage(imageFile: File) {
  const form = new FormData();
  form.append("file", imageFile);
  const res = await fetch(`${PYTHON_API}/predict-image`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Image prediction failed");
  }
  return res.json();
}

// ─── MULTIMODAL (Python FastAPI) ────────────────────────────────────────────
export async function predictMultimodal(
  clinicalData: object | null,
  imageFile: File | null
) {
  const form = new FormData();
  if (clinicalData) form.append("data", JSON.stringify(clinicalData));
  if (imageFile) form.append("file", imageFile);
  const res = await fetch(`${PYTHON_API}/predict-multimodal`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Multimodal prediction failed");
  }
  return res.json();
}
