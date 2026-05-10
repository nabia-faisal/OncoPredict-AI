FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libglib2.0-0 libsm6 libxext6 libxrender-dev libgomp1 libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --default-timeout=300 fastapi==0.104.1 uvicorn[standard]==0.24.0 python-multipart==0.0.6
RUN pip install --no-cache-dir --default-timeout=300 numpy==1.26.4 pandas==2.1.3 scikit-learn==1.4.2 joblib==1.3.2
RUN pip install --no-cache-dir --default-timeout=300 Pillow==10.1.0 opencv-python==4.8.1.78
RUN pip install --no-cache-dir --default-timeout=300 tensorflow==2.15.0
RUN pip install --no-cache-dir --default-timeout=300 shap==0.43.0 pydantic==2.5.0 python-dotenv==1.0.0
RUN pip install --no-cache-dir --default-timeout=300 python-json-logger==2.0.7 pytest==7.4.3 pytest-asyncio==0.21.1 httpx==0.25.1

COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]