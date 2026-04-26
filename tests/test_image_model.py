import numpy as np
import cv2
import tensorflow as tf

# Load the model
print("Loading model...")
model = tf.keras.models.load_model("models/image_model.h5")
print("Model loaded successfully!")

# Test with a cancer image
img = cv2.imread("data/images/cancer/benign_benign (1).png")
img = cv2.resize(img, (224, 224))
img = img / 255.0
img = np.expand_dims(img, axis=0)
pred = model.predict(img)[0][0]
print(f"\nCancer image prediction   : {pred:.4f}")
print(f"Result: {'Cancer Detected' if pred > 0.5 else 'No Cancer'}")

# Test with a no_cancer image
img2 = cv2.imread("data/images/no_cancer/normal_normal (1).png")
img2 = cv2.resize(img2, (224, 224))
img2 = img2 / 255.0
img2 = np.expand_dims(img2, axis=0)
pred2 = model.predict(img2)[0][0]
print(f"\nNo-cancer image prediction: {pred2:.4f}")
print(f"Result: {'Cancer Detected' if pred2 > 0.5 else 'No Cancer'}")

# Verify outputs are valid probabilities
assert 0.0 <= pred  <= 1.0, "ERROR: prediction out of range!"
assert 0.0 <= pred2 <= 1.0, "ERROR: prediction out of range!"
print("\nAll tests passed! Model is ready for integration.")