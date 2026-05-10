# OncoPredict AI

AI-powered breast cancer recurrence prediction system for medical professionals.
Built with the full **MERN stack** — MongoDB · Express · React · Node.js — plus a Python/FastAPI ML backend.

---

## Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [One-Time Installation](#-one-time-installation)
- [Running the App](#-running-the-app)
- [Docker](#-docker)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Bootstrap Usage](#-bootstrap-usage)
- [MVC Architecture](#-mvc-architecture)
- [React Patterns Used](#-react-patterns-used)

---

## Project Overview

OncoPredict AI allows doctors to:

- Input patient clinical data and receive ML-powered breast cancer recurrence predictions
- Upload MRI scan images for image-based prediction
- Run combined (multimodal) predictions using both data sources
- View and manage persistent prediction history per doctor account
- Authenticate securely with JWT-based login stored in MongoDB

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v7, Vite, TypeScript |
| Styling | Bootstrap 5.3 (CDN), Tailwind CSS, shadcn/ui |
| Backend (Auth + DB) | Node.js, Express.js |
| Database | MongoDB Atlas (cloud), Mongoose ODM |
| ML Backend | Python 3, FastAPI, scikit-learn |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```bash
OncoPredict-AI/
│
├── User_dashboard/              # React frontend (Vite + TypeScript)
│   ├── src/app/
│   │   ├── pages/               # 10 route-level page components
│   │   ├── components/          # DashboardLayout, ProtectedRoute, UI
│   │   ├── context/AppContext.tsx
│   │   └── api.ts               # All fetch calls to Express + FastAPI
│   ├── index.html               # Bootstrap 5.3 CDN linked here
│   ├── Dockerfile               # Builds React → serves via nginx
│   └── nginx.conf
│
├── server/                      # Express.js backend (Auth + DB)
│   ├── src/
│   │   ├── index.js
│   │   ├── config/db.js         # Mongoose connection
│   │   ├── models/
│   │   │   ├── Doctor.js
│   │   │   ├── Prediction.js
│   │   │   └── PatientHistory.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── predictions.js
│   │   │   └── patients.js
│   │   └── middleware/auth.js   # JWT middleware
│   ├── .env
│   └── package.json
│
├── src/                         # Python FastAPI ML backend
│   └── main.py
├── models/                      # Trained .pkl model files
├── notebooks/                   # Jupyter training notebooks
├── venv/                        # Python virtual environment
├── requirements.txt
├── Dockerfile                   # Python FastAPI container
├── docker-compose.yml
└── .dockerignore
```

---

## Pages & Routes

| # | Page | Route | Description |
|---|---|---|---|
| 1 | Login / Register | `/` | JWT auth, create or log into doctor account |
| 2 | Dashboard | `/dashboard` | Welcome, stats, navigation cards |
| 3 | Patient History Form | `/dashboard/new-prediction` | Patient details, saved to MongoDB |
| 4 | Prediction Selection | `/dashboard/model-selection` | Choose Clinical / Image / Combined |
| 5 | Clinical Model | `/dashboard/clinical-model` | 9-field clinical form |
| 6 | Image Model | `/dashboard/image-model` | MRI image upload → FastAPI |
| 7 | Combined Model | `/dashboard/combined-model` | Clinical + image together |
| 8 | Result | `/dashboard/result` | Result card with progress bar |
| 9 | History | `/dashboard/history` | All predictions from MongoDB |
| 10 | About | `/dashboard/about` | Model info and accuracy |

All `/dashboard` routes are protected — unauthenticated users are redirected to login.

---

## One-Time Installation

These steps only need to be done once on a new machine.

### Python environment

```powershell
cd C:\Users\HP\Downloads\OncoPredict-AI
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Train the ML models

```powershell
cd C:\Users\HP\Downloads\OncoPredict-AI
venv\Scripts\activate
### Generate Clinical Model Files
python -m src.training.train
This trains the Random Forest and Logistic Regression models and saves all required files to models/:
random_forest_model.joblib
logistic_model.joblib
encoder.joblib
imputer.joblib
```powershell
cd C:\Users\HP\Downloads\OncoPredict-AI
venv\Scripts\activate
```

### Generate Clinical Model Files

```powershell
python -m src.training.train
```

This trains the Random Forest and Logistic Regression models and saves all required files to `models/`:

```text
random_forest_model.joblib
logistic_model.joblib
encoder.joblib
imputer.joblib
```

### Generate Image Model File

Organise your MRI images into this structure first:

```text
data/
├── images/
│   ├── cancer/
│   └── no_cancer/
└── test_images/
    ├── cancer/
    └── no_cancer/
```

Then run:

```powershell
python -m src.image_model.train_image_model
```

This saves `models/image_model.h5`
This saves models/image_model.h5
```

Open the notebooks in the `notebooks/` folder and run all cells. Trained `.pkl` files will be saved to `models/`. **Only needs to be done once** — models persist on disk.

### Express server dependencies

```powershell
cd C:\Users\HP\Downloads\OncoPredict-AI\server
npm install
```

### React frontend dependencies

```powershell
cd C:\Users\HP\Downloads\OncoPredict-AI\User_dashboard
npm install
```

---

## Running the App

Open **3 terminals** and run one command in each. All three must be running at the same time.

### Terminal 1 — Python ML API (port 8000)

```powershell
cd C:\Users\HP\Downloads\OncoPredict-AI
venv\Scripts\activate
uvicorn src.api.main:app --reload --port 8000
```

> Use `python -m uvicorn` not just `uvicorn` — this prevents the "Could not import module src.main" error

Expected output:

```powershell
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started reloader process using StatReload
```

### Terminal 2 — Express + MongoDB (port 5000)

```powershell
cd C:\Users\HP\Downloads\OncoPredict-AI\server
npm run dev
```

Expected output:

```powershell
🚀 Express server running on http://localhost:5000
✅ MongoDB Connected: ac-xxxxx.mongodb.net
```

### Terminal 3 — React Frontend (port 5173)

```powershell
cd C:\Users\HP\Downloads\OncoPredict-AI\User_dashboard
npm run dev
```

Expected output:

```powershell
VITE v6.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Then open **http://localhost:5173** in your browser. On first visit click **"New doctor? Register here"** to create your account.

---

## Docker

Docker runs the **Python ML API** and **React frontend** together. The Express server still runs separately with `npm run dev`.

Make sure Docker Desktop is open, then from the project root:

### Start everything

```powershell
cd C:\Users\HP\Downloads\OncoPredict-AI
docker-compose up --build
```

- ML API → http://localhost:8000
- React frontend → http://localhost:80

### Stop

```powershell
docker-compose down
```

### Rebuild after code changes

```powershell
docker-compose up --build --force-recreate
```

### Run containers individually

```powershell
# ML API only
docker build -t oncopredict-ml .
docker run -p 8000:8000 -v ./models:/app/models oncopredict-ml

# Frontend only
cd User_dashboard
docker build -t oncopredict-frontend .
docker run -p 80:80 oncopredict-frontend
```

---

## Environment Variables

### `server/.env`

```dotenv
PORT=5000
MONGODB_URI=mongodb://username:password@ac-xxxxx-shard-00-00.mongodb.net:27017,ac-xxxxx-shard-00-01.mongodb.net:27017,ac-xxxxx-shard-00-02.mongodb.net:27017/oncopredict?ssl=true&replicaSet=atlas-xxx&authSource=admin&appName=oncopredict
JWT_SECRET=oncopredict_secret_key_2024
```

To get your `MONGODB_URI`: MongoDB Atlas → Clusters → Connect → Drivers → toggle **SRV Connection String OFF** → copy the string → replace `<db_password>` with your password.

---

## API Reference

### Express Server — http://localhost:5000

#### Auth (public)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{ doctorId, password, name? }` | Create doctor account |
| POST | `/api/auth/login` | `{ doctorId, password }` | Returns JWT token |

#### Predictions *(Bearer token required)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/predictions` | Get all predictions for logged-in doctor |
| POST | `/api/predictions` | Save a new prediction |
| DELETE | `/api/predictions/:id` | Delete a prediction |

#### Patients *(Bearer token required)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/patients` | Get all patient records |
| POST | `/api/patients` | Save a patient record |
| GET | `/api/patients/:id` | Get a single patient |

### FastAPI ML Server — http://localhost:8000

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/predict-clinical` | JSON clinical fields | Clinical prediction |
| POST | `/predict-image` | `multipart/form-data` with `file` | Image prediction |
| POST | `/predict-multimodal` | `multipart/form-data` with `data` + `file` | Combined prediction |

---

## Bootstrap Usage

Bootstrap 5.3 loaded via CDN in `index.html`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

| Feature | File | Classes |
|---|---|---|
| Navbar (responsive, collapsible) | `DashboardLayout.tsx` | `navbar navbar-expand-lg navbar-dark bg-dark` |
| Responsive Grid | `Dashboard.tsx` | `row row-cols-1 row-cols-md-3 g-3` |
| Cards | `Dashboard`, `History`, `Result` | `card card-body card-header card-footer` |
| Badges | `History`, `Dashboard` | `badge bg-success bg-warning bg-danger` |
| Alerts | `Dashboard`, `ClinicalModel`, `Result` | `alert alert-primary alert-info alert-danger` |
| Forms | `ClinicalModel`, `Login` | `form-select form-label form-control` |
| Buttons | All pages | `btn btn-primary btn-outline-secondary` |
| Progress Bar | `Result.tsx` | `progress progress-bar` |
| Spinner | `ClinicalModel.tsx` | `spinner-border spinner-border-sm` |
| Spacing utilities | Throughout | `mt-4 mb-3 p-4 gap-3 mx-auto` |
| Containers | All layouts | `container container-fluid` |

---

## MVC Architecture

| Layer | Location | Responsibility |
|---|---|---|
| **Model** | `server/src/models/` | Mongoose schemas — Doctor, Prediction, PatientHistory |
| **View** | `User_dashboard/src/app/pages/` | 10 React components rendering the UI |
| **Controller** | `server/src/routes/` | Express route handlers — auth, predictions, patients |

---

## React Patterns Used

| Pattern | Location | Description |
|---|---|---|
| `useState` | Every page | Form inputs, loading flags, error messages |
| `useEffect` | `AppContext.tsx` | Fetches predictions from MongoDB on login |
| `useContext` | All pages | `useApp()` reads global auth and prediction state |
| Context API | `AppContext.tsx` | Provides `isAuthenticated`, `doctorId`, `predictions`, `login`, `logout`, `addPrediction` globally |
| Props | `DashboardLayout.tsx` | Accepts `children` prop to wrap all dashboard pages |
| ProtectedRoute | `routes.tsx` | Redirects to `/` if not logged in |
| React Router v7 | `routes.tsx` | `createBrowserRouter` with nested routes under `/dashboard` |
| `map()` | `Dashboard`, `History` | Renders cards and prediction list from arrays |
| `async/await` | Model pages | API calls with loading and error handling |

---

## 👥 Team

BSAI-1A, Spring 2026 — CS 343 Web Technologies  
Instructor: Dr. Naima Iltaf  
Member 1: Nabia Faisal  
Member 2: Abiha Khan