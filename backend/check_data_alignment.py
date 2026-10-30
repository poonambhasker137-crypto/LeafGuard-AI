
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from pathlib import Path
import pandas as pd

from image_preprocessing import create_dataset

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"

val_df = pd.read_csv(RESULTS / "val.csv")

# Take a small sample from different classes
sample_df = (
    val_df.groupby("class_name", group_keys=False)
    .sample(n=2, random_state=42)
    .reset_index(drop=True)
)

dataset = create_dataset(sample_df, training=False)

actual_labels = []

for images, labels in dataset:
    actual_labels.extend(labels.numpy().tolist())

expected_labels = sample_df["class_id"].tolist()

print("\nLEAFGUARD AI - DATA ALIGNMENT CHECK")
print("-" * 45)

print("Images checked:", len(expected_labels))

if actual_labels == expected_labels:
    print("RESULT: IMAGE-LABEL ALIGNMENT PASSED")
else:
    print("RESULT: IMAGE-LABEL ALIGNMENT FAILED")

print("\nFirst 10 expected labels:")
print(expected_labels[:10])

print("\nFirst 10 dataset labels:")
print(actual_labels[:10])
