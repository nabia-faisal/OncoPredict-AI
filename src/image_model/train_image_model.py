import os
import numpy as np
import tensorflow
import tensorflow.keras.applications
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from src.image_model.config import IMAGE_SIZE, BATCH_SIZE, EPOCHS, MODEL_PATH


train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    horizontal_flip=True,       # augmentation
    zoom_range=0.1,
    rotation_range=10
)

classes_order = ['no_cancer', 'cancer']

train_generator = train_datagen.flow_from_directory(
    "data/images",
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary",
    classes=classes_order,
    subset="training",
    seed=42
)

val_generator = train_datagen.flow_from_directory(
    "data/images",
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary",
    classes=classes_order,
    subset="validation",
    seed=42
)

print(f"Training samples  : {train_generator.samples}")
print(f"Validation samples: {val_generator.samples}")


base_model = tensorflow.keras.applications.MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

for layer in base_model.layers:
    layer.trainable = False

x = Flatten()(base_model.output)
x = Dense(128, activation="relu")(x)
output = Dense(1, activation="sigmoid")(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)


total       = len(train_generator.classes)
n_cancer    = int(np.sum(train_generator.classes == 1))
n_no_cancer = int(np.sum(train_generator.classes == 0))

class_weights = {
    0: (1 / n_no_cancer) * (total / 2.0),
    1: (1 / n_cancer)    * (total / 2.0)
}

print(f"Class weights: {class_weights}")


model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    class_weight=class_weights
)


os.makedirs("models", exist_ok=True)
model.save(MODEL_PATH)
print("\nModel saved to:", MODEL_PATH)


test_datagen = ImageDataGenerator(rescale=1./255)

test_generator = test_datagen.flow_from_directory(
    "data/test_images",
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary",
    classes=classes_order,
    shuffle=False
)

print(f"\nTest samples (unseen): {test_generator.samples}")

loss, accuracy = model.evaluate(test_generator)
print(f"\nTest Loss    : {loss:.4f}")
print(f"Test Accuracy: {accuracy:.4f}")

# Predictions for detailed report
from sklearn.metrics import classification_report, confusion_matrix

preds = model.predict(test_generator)
pred_labels = (preds > 0.5).astype(int).flatten()
true_labels = test_generator.classes

print("\nClassification Report:")
print(classification_report(true_labels, pred_labels, target_names=["No Cancer", "Cancer"]))

print("Confusion Matrix:")
print(confusion_matrix(true_labels, pred_labels))