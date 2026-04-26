import json
import os
from datetime import datetime, timedelta
from typing import Optional


class PredictionLogger:
    """Log all predictions to a JSONL file for monitoring and analysis."""

    def __init__(self, log_file: str = "logs/predictions.jsonl"):
        self.log_file = log_file
        # Make sure the logs directory exists
        os.makedirs(os.path.dirname(log_file), exist_ok=True)

    def log_prediction(self,
                       prediction_type: str,
                       input_data: dict,
                       output: dict,
                       response_time: float,
                       success: bool = True,
                       error: Optional[str] = None):
        """Append one prediction record to the log file."""
        record = {
            "timestamp": datetime.now().isoformat(),
            "type": prediction_type,       # "clinical" | "image" | "multimodal"
            "input": self._sanitize(input_data),
            "output": output,
            "response_time_ms": round(response_time * 1000, 2),
            "success": success,
            "error": error
        }
        with open(self.log_file, "a") as f:
            f.write(json.dumps(record) + "\n")
        return record

    def _sanitize(self, data: dict) -> dict:
        """Strip any PII fields before logging."""
        return {k: v for k, v in data.items() if k not in ("patient_id", "name")}

    def get_statistics(self, hours: int = 24) -> dict:
        """Return basic stats over the last N hours."""
        if not os.path.exists(self.log_file):
            return {"error": "No log file found"}

        cutoff = datetime.now() - timedelta(hours=hours)
        records = []

        with open(self.log_file) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    rec = json.loads(line)
                    ts = datetime.fromisoformat(rec["timestamp"])
                    if ts >= cutoff:
                        records.append(rec)
                except Exception:
                    continue

        if not records:
            return {"period_hours": hours, "total_predictions": 0}

        total = len(records)
        successful = sum(1 for r in records if r.get("success"))
        failed = total - successful
        avg_rt = sum(r["response_time_ms"] for r in records) / total

        by_type = {}
        for r in records:
            t = r.get("type", "unknown")
            by_type[t] = by_type.get(t, 0) + 1

        return {
            "period_hours": hours,
            "total_predictions": total,
            "successful": successful,
            "failed": failed,
            "avg_response_time_ms": round(avg_rt, 2),
            "by_type": by_type
        }


# Single shared instance — import this wherever needed
prediction_logger = PredictionLogger()