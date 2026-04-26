# pyright: ignore[reportMissingModuleSource]
from tensorflow.keras.applications import MobileNetV2 # pyright: ignore[reportMissingImports]
from tensorflow.keras.layers import Dense, Flatten # pyright: ignore[reportMissingModuleSource]
from tensorflow.keras.models import Model # pyright: ignore[reportMissingModuleSource]
from tensorflow.keras.optimizers import Adam # pyright: ignore[reportMissingModuleSource]

from src.image_model.config import IMAGE_SIZE

# =========================
# BUILD MODEL
# =========================

def build_model():
    """
    Creates CNN model using transfer learning
    """

    # Load pretrained base model
    base_model = MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3)
    )

    # Freeze base layers
    for layer in base_model.layers:
        layer.trainable = False

    # Add custom layers
    x = Flatten()(base_model.output)
    x = Dense(128, activation="relu")(x)
    output = Dense(1, activation="sigmoid")(x)

    # Final model
    model = Model(inputs=base_model.input, outputs=output)

    # Compile model
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss="binary_crossentropy",
        metrics=["accuracy"]
    )

    return model