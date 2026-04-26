const BASE_URL = "http://localhost:8000";

// ─── CLINICAL ──────────────────────────────────────────────────────────────
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
  const res = await fetch(`${BASE_URL}/predict-clinical`, {
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

// ─── IMAGE ─────────────────────────────────────────────────────────────────
export async function predictImage(imageFile: File) {
  const form = new FormData();
  form.append("file", imageFile);
  const res = await fetch(`${BASE_URL}/predict-image`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Image prediction failed");
  }
  return res.json();
}

// ─── MULTIMODAL ────────────────────────────────────────────────────────────
export async function predictMultimodal(
  clinicalData: object | null,
  imageFile: File | null
) {
  const form = new FormData();
  if (clinicalData) form.append("data", JSON.stringify(clinicalData));
  if (imageFile) form.append("file", imageFile);
  const res = await fetch(`${BASE_URL}/predict-multimodal`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Multimodal prediction failed");
  }
  return res.json();
}