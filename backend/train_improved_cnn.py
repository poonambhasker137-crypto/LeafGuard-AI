
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from pathlib import Path
import json
import pandas as pd
import tensorflow as tf

from image_preprocessing import create_dataset

# =====================================
# 1. PROJECT CONFIGURATION
# =====================================

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"
MODELS = ROOT / "models"

MODELS.mkdir(parents=True, exist_ok=True)

tf.keras.utils.set_random_seed(42)

IMG_SIZE = 224
EPOCHS = 15

# =====================================
# 2. LOAD CLASS NAMES AND DATASET
# =====================================

with open(
    RESULTS / "class_names.json",
    "r",
    encoding="utf-8"
) as f:
    class_data = json.load(f)

if isinstance(class_data, list):
    class_names = class_data
elif isinstance(class_data, dict):
    class_names = [
        class_data[str(i)]
        for i in range(len(class_data))
    ]
else:
    raise ValueError("Invalid class_names.json format")

NUM_CLASSES = len(class_names)

train_df = pd.read_csv(RESULTS / "train.csv")
val_df = pd.read_csv(RESULTS / "val.csv")

for split_name, df in [
    ("Training", train_df),
    ("Validation", val_df)
]:
    required_columns = {"image_path", "class_id"}

    if not required_columns.issubset(df.columns):
        raise ValueError(
            f"{split_name} CSV has missing columns."
        )

    if not df["class_id"].between(
        0, NUM_CLASSES - 1
    ).all():
        raise ValueError(
            f"{split_name} contains invalid class IDs."
        )

print("\nLEAFGUARD AI - IMPROVED CNN TRAINING")
print("-" * 45)
print("Training images:", len(train_df))
print("Validation images:", len(val_df))
print("Total classes:", NUM_CLASSES)

train_ds = create_dataset(
    train_df,
    training=True
)

val_ds = create_dataset(
    val_df,
    training=False
)

# =====================================
# 3. BUILD IMPROVED CNN
# =====================================

inputs = tf.keras.Input(
    shape=(IMG_SIZE, IMG_SIZE, 3)
)

# Pixel normalization happens inside CNN.
# Do not normalize again in preprocessing.
x = tf.keras.layers.Rescaling(
    1.0 / 255
)(inputs)

# CNN BLOCK 1
x = tf.keras.layers.Conv2D(
    32,
    kernel_size=3,
    padding="same",
    use_bias=False
)(x)

x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Activation("relu")(x)
x = tf.keras.layers.MaxPooling2D()(x)

# CNN BLOCK 2
x = tf.keras.layers.Conv2D(
    64,
    kernel_size=3,
    padding="same",
    use_bias=False
)(x)

x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Activation("relu")(x)
x = tf.keras.layers.MaxPooling2D()(x)

# CNN BLOCK 3
x = tf.keras.layers.Conv2D(
    128,
    kernel_size=3,
    padding="same",
    use_bias=False
)(x)

x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Activation("relu")(x)
x = tf.keras.layers.MaxPooling2D()(x)

# CNN BLOCK 4
x = tf.keras.layers.Conv2D(
    256,
    kernel_size=3,
    padding="same",
    use_bias=False
)(x)

x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Activation("relu")(x)
x = tf.keras.layers.MaxPooling2D()(x)

# CLASSIFICATION LAYERS
x = tf.keras.layers.GlobalAveragePooling2D()(x)

x = tf.keras.layers.Dense(
    256,
    activation="relu"
)(x)

x = tf.keras.layers.Dropout(0.4)(x)

outputs = tf.keras.layers.Dense(
    NUM_CLASSES,
    activation="softmax"
)(x)

model = tf.keras.Model(
    inputs=inputs,
    outputs=outputs,
    name="LeafGuard_Improved_CNN"
)

# =====================================
# 4. COMPILE CNN
# =====================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.0003
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# =====================================
# 5. CALLBACKS
# =====================================

callbacks = [

    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(
            MODELS / "cnn_improved_best.keras"
        ),
        monitor="val_accuracy",
        mode="max",
        save_best_only=True,
        verbose=1
    ),

    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=4,
        restore_best_weights=True,
        verbose=1
    ),

    tf.keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=2,
        min_lr=0.000001,
        verbose=1
    )
]

# =====================================
# 6. TRAIN THE CNN
# =====================================

print("\nStarting improved CNN training...")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=callbacks
)

# =====================================
# 7. SAVE TRAINING HISTORY
# =====================================

history_df = pd.DataFrame(history.history)

history_df.to_csv(
    RESULTS / "cnn_improved_history.csv",
    index=False
)

# =====================================
# 8. LOAD AND EVALUATE BEST MODEL
# =====================================

best_model = tf.keras.models.load_model(
    MODELS / "cnn_improved_best.keras",
    compile=False
)

best_model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.0003
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

val_loss, val_accuracy = best_model.evaluate(
    val_ds,
    verbose=1
)

# =====================================
# 9. DISPLAY FINAL RESULTS
# =====================================

print("\n===================================")
print("IMPROVED CNN TRAINING COMPLETED")
print("===================================")

print(
    "Best validation accuracy:",
    round(val_accuracy * 100, 2),
    "%"
)

print(
    "Validation loss:",
    round(val_loss, 4)
)

print("\nBest model saved at:")
print(MODELS / "cnn_improved_best.keras")

print("\nTraining history saved at:")
print(RESULTS / "cnn_improved_history.csv")

print("\nOriginal CNN model remains unchanged.")
