import requests
import time

# Correct endpoint — was "/predict", should be "/predict-clinical"
url = "http://127.0.0.1:8000/predict-clinical"

# deg_malig must be a string ("1","2","3") to match the Pydantic schema
data = {
    "age": "30-39",
    "menopause": "premeno",
    "tumor_size": "15-19",
    "inv_nodes": "0-2",
    "node_caps": "no",
    "deg_malig": "2",   # string, not int
    "breast": "left",
    "breast_quad": "left_low",
    "irradiat": "no"
}


def run_test(n_requests):
    times = []
    errors = 0
    start_total = time.time()

    for i in range(n_requests):
        start = time.time()
        try:
            response = requests.post(url, json=data, timeout=10)
            if response.status_code != 200:
                errors += 1
        except Exception as e:
            errors += 1
        end = time.time()
        times.append(end - start)

    end_total = time.time()
    total_time = end_total - start_total
    avg_time = sum(times) / len(times)
    throughput = n_requests / total_time

    print(f"\n--- {n_requests} Requests ---")
    print(f"Average time per request : {avg_time:.4f} sec")
    print(f"Total time               : {total_time:.4f} sec")
    print(f"Throughput               : {throughput:.2f} req/sec")
    print(f"Errors                   : {errors}/{n_requests}")


if __name__ == "__main__":
    print("Starting stress test — make sure uvicorn is running first!")
    run_test(10)
    run_test(50)
    run_test(100)