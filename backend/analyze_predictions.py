
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from pathlib import Path
import numpy as np
import pandas as pd
import tensorflow as tf

from image_preprocessing import create_dataset

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"
MODELS = ROOT / "models"

# Load validation data
val_df = pd.read_csv(RESULTS / "val.csv")

# Select 10 images from each of 38 classes
sample_df = (
    val_df.groupby("class_name", group_keys=False)
    .sample(n=10, random_state=42)
    .reset_index(drop=True)
)

print("\nLEAFGUARD AI - PREDICTION ANALYSIS")
print("-" * 50)

print("Images selected:", len(sample_df))
print("Classes:", sample_df["class_name"].nunique())

# Load trained CNN
model = tf.keras.models.load_model(
    MODELS / "cnn_best.keras"
)

# No augmentation for validation
sample_ds = create_dataset(
    sample_df,
    training=False
)

# Predict
probabilities = model.predict(sample_ds, verbose=1)
predicted_ids = np.argmax(probabilities, axis=1)

# Map IDs to class names
id_to_class = (
    val_df[["class_id", "class_name"]]
    .drop_duplicates()
    .set_index("class_id")["class_name"]
    .to_dict()
)

sample_df["predicted_id"] = predicted_ids
sample_df["predicted_class"] = [
    id_to_class[int(i)] for i in predicted_ids
]

sample_df["correct"] = (
    sample_df["class_id"] == sample_df["predicted_id"]
)

# Display results
accuracy = sample_df["correct"].mean()

print("\nSample accuracy:", round(accuracy * 100, 2), "%")

print("\nMOST COMMON PREDICTED CLASSES:")
print(
    sample_df["predicted_class"]
    .value_counts()
    .head(10)
    .to_string()
)

print("\nACCURACY BY ACTUAL CLASS:")
class_accuracy = (
    sample_df.groupby("class_name")["correct"]
    .mean()
    .sort_values()
)

print(
    (class_accuracy * 100)
    .round(2)
    .to_string()
)

# Save results
sample_df.to_csv(
    RESULTS / "cnn_prediction_analysis.csv",
    index=False
)

print("\nResults saved:")
print(RESULTS / "cnn_prediction_analysis.csv")
