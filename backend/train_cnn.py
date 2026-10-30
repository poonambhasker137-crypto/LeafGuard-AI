
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from pathlib import Path
import pandas as pd
import tensorflow as tf

from image_preprocessing import create_dataset, NUM_CLASSES

# =====================================
# 1. PROJECT PATHS
# =====================================

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"
MODELS = ROOT / "models"

MODELS.mkdir(parents=True, exist_ok=True)

# =====================================
# 2. LOAD DATASET
# =====================================

train_df = pd.read_csv(RESULTS / "train.csv")
val_df = pd.read_csv(RESULTS / "val.csv")

print("\nLEAFGUARD AI - WEIGHTED CNN TRAINING")
print("-" * 45)
print("Training images:", len(train_df))
print("Validation images:", len(val_df))
print("Total classes:", NUM_CLASSES)

train_ds = create_dataset(train_df, training=True)
val_ds = create_dataset(val_df, training=False)

# =====================================
# 3. CALCULATE CLASS WEIGHTS
# =====================================

class_counts = train_df["class_id"].value_counts()

total_images = len(train_df)

class_weights = {
    int(class_id): total_images / (NUM_CLASSES * count)
    for class_id, count in class_counts.items()
}

print("\nClass weights calculated successfully!")
print("Smallest class weight:", round(min(class_weights.values()), 4))
print("Largest class weight:", round(max(class_weights.values()), 4))

# =====================================
# 4. BUILD CNN MODEL
# =====================================

model = tf.keras.Sequential([

    tf.keras.layers.Input(shape=(224, 224, 3)),

    tf.keras.layers.Rescaling(1.0 / 255),

    tf.keras.layers.Conv2D(
        32, (3, 3), activation="relu"
    ),
    tf.keras.layers.MaxPooling2D(2, 2),

    tf.keras.layers.Conv2D(
        64, (3, 3), activation="relu"
    ),
    tf.keras.layers.MaxPooling2D(2, 2),

    tf.keras.layers.Conv2D(
        128, (3, 3), activation="relu"
    ),
    tf.keras.layers.MaxPooling2D(2, 2),

    tf.keras.layers.GlobalAveragePooling2D(),

    tf.keras.layers.Dense(
        128, activation="relu"
    ),

    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(
        NUM_CLASSES,
        activation="softmax"
    )
])

# =====================================
# 5. COMPILE MODEL
# =====================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# =====================================
# 6. CALLBACKS
# =====================================

callbacks = [

    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(MODELS / "cnn_weighted_best.keras"),
        monitor="val_loss",
        save_best_only=True,
        verbose=1
    ),

    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True,
        verbose=1
    )
]

# =====================================
# 7. TRAIN WEIGHTED CNN
# =====================================

print("\nStarting weighted CNN training...")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=5,
    class_weight=class_weights,
    callbacks=callbacks
)

# =====================================
# 8. SAVE FINAL MODEL
# =====================================

model.save(MODELS / "cnn_weighted_final.keras")

# =====================================
# 9. SAVE TRAINING HISTORY
# =====================================

history_df = pd.DataFrame(history.history)

history_df.to_csv(
    RESULTS / "cnn_weighted_history.csv",
    index=False
)

# =====================================
# 10. DISPLAY RESULTS
# =====================================

print("\nWEIGHTED CNN TRAINING COMPLETED!")
print("-" * 45)

print(
    "Final training accuracy:",
    round(history.history["accuracy"][-1] * 100, 2), "%"
)

print(
    "Final validation accuracy:",
    round(history.history["val_accuracy"][-1] * 100, 2), "%"
)

print("\nBest weighted model saved at:")
print(MODELS / "cnn_weighted_best.keras")

print("\nFinal weighted model saved at:")
print(MODELS / "cnn_weighted_final.keras")

print("\nTraining history saved at:")
print(RESULTS / "cnn_weighted_history.csv")

